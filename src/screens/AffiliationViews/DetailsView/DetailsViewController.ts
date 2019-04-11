import { Component } from 'react';

import { IAuroraApiComponentProps } from 'components/AuroraApi';
import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import { ImageTagType } from 'models/ImageTagType';
import { ITag, ITagsPaged, ITagsPagedGroup } from 'models/Tag';

import LoadingStateManager from 'models/StateManager/LoadingStateManager';
import {
  IUnavailableServiceMessage,
  unavailableServiceMessageCreator
} from 'models/UnavailableServiceMessage';
import { ApplicationDeploymentDetailsRoute } from '../ApplicationDeploymentSelector';
import { TagStateManager } from './TagStateManager';
import { IImageTagTypeOption } from './VersionView/TagTypeSelector/TagTypeSelector';

export interface IDetailsViewProps
  extends ApplicationDeploymentDetailsRoute,
    IAuroraApiComponentProps {
  deployment: IApplicationDeployment;
  fetchApplicationDeployments: () => void;
  filterPathUrl: string;
}

export interface IDetailsViewState {
  tagsPagedGroup: ITagsPagedGroup;
  deploymentDetails: IApplicationDeploymentDetails;
  releaseToDeployTag: ITag;
  selectedTag?: ITag;
  selectedTagType: ImageTagType;
  loading: IDetailsViewLoading;
  versionSearchText: string;
  isInitialTagType: boolean;
}

interface IDetailsViewLoading {
  fetchTags: boolean;
  fetchDetails: boolean;
  redeploy: boolean;
  update: boolean;
}

interface IStateManagers {
  tag: TagStateManager;
  loading: LoadingStateManager<IDetailsViewLoading>;
}

type DetailsViewComponent = Component<IDetailsViewProps, IDetailsViewState>;

export default class DetailsViewController {
  public sm: IStateManagers;

  private component: DetailsViewComponent;

  constructor(component: DetailsViewComponent) {
    component.componentWillUnmount = () => {
      this.sm.tag.close();
      this.sm.loading.close();
    };

    this.component = component;

    this.sm = {
      tag: new TagStateManager(component.state.tagsPagedGroup, tagsPagedGroup =>
        component.setState({ tagsPagedGroup })
      ),
      loading: new LoadingStateManager<IDetailsViewLoading>(
        component.state.loading,
        loading => component.setState({ loading })
      )
    };
  }

  public redeployWithVersion = () => {
    const { clients, deployment } = this.component.props;
    const { selectedTag } = this.component.state;
    if (!selectedTag) {
      // TODO: Error message
      return;
    }

    this.sm.loading.withLoading(['redeploy'], async () => {
      const success = await clients.applicationDeploymentClient.redeployWithVersion(
        deployment.id,
        selectedTag.name
      );
      if (success) {
        this.component.props.fetchApplicationDeployments();
        const deploymentDetails = await clients.applicationDeploymentClient.findApplicationDeploymentDetails(
          deployment.id
        );
        this.component.setState({
          deploymentDetails,
          isInitialTagType: true
        });
      }
    });
  };

  public redeployWithCurrentVersion = () => {
    const { clients, deployment } = this.component.props;
    this.sm.loading.withLoading(['redeploy'], async () => {
      const success = await clients.applicationDeploymentClient.redeployWithCurrentVersion(
        deployment.id
      );
      if (success) {
        this.component.props.fetchApplicationDeployments();
      }
    });
  };

  public refreshApplicationDeployment = () => {
    const {
      clients,
      deployment,
      fetchApplicationDeployments
    } = this.component.props;

    this.sm.loading.withLoading(['update'], async () => {
      const success = await clients.applicationDeploymentClient.refreshApplicationDeployment(
        deployment.id
      );

      if (success) {
        fetchApplicationDeployments();
        const deploymentDetails = await clients.applicationDeploymentClient.findApplicationDeploymentDetails(
          deployment.id
        );
        this.component.setState({
          deploymentDetails
        });
      }
    });
  };

  public loadMoreTags = () => {
    const { clients, deployment } = this.component.props;
    const { selectedTagType } = this.component.state;

    const current: ITagsPaged = this.sm.tag.getTagsPaged(selectedTagType);
    const cursor = current.endCursor;

    this.sm.loading.withLoading(['fetchTags'], async () => {
      const tagsPaged = await clients.imageRepositoryClient.findTagsPaged(
        deployment.repository,
        selectedTagType,
        15,
        cursor
      );

      this.sm.tag.updateTagsPaged(selectedTagType, tagsPaged);
    });
  };

  public handleSelectStrategy = (e: Event, option: IImageTagTypeOption) => {
    e.preventDefault();
    this.component.setState(() => ({
      selectedTagType: option.key
    }));
  };

  public handleVersionSearch = (value: string) => {
    this.component.setState({
      versionSearchText: value
    });
  };

  public handleSelectNextTag = (tag?: ITag) => {
    this.component.setState(() => ({
      selectedTag: tag
    }));
  };

  public goToDeploymentsPage = () => {
    const { match, history, filterPathUrl } = this.component.props;
    history.push(`/a/${match.params.affiliation}/deployments/${filterPathUrl}`);
  };

  public onMount = () => {
    const { id, repository } = this.component.props.deployment;
    const {
      applicationDeploymentClient,
      imageRepositoryClient
    } = this.component.props.clients;

    if(repository) {
      this.sm.loading.withLoading(['fetchTags', 'fetchDetails'], async () => {
        const [deploymentDetails, tagsPagedGroup] = await Promise.all([
          applicationDeploymentClient.findApplicationDeploymentDetails(id),
          imageRepositoryClient.findGroupedTagsPaged(repository)
        ]);

        this.component.setState({ deploymentDetails });
        this.sm.tag.setTagsPagedGroup(tagsPagedGroup);
      });
    }
  };

  public getVersionViewUnavailableMessage():
    | IUnavailableServiceMessage
    | undefined {
    const { deploymentSpec } = this.component.state.deploymentDetails;
    const serviceUnavailableBecause = unavailableServiceMessageCreator(
      'Det er ikke mulig å endre versjonen på denne applikasjonen'
    );

    if (deploymentSpec && deploymentSpec.type === 'development') {
      return serviceUnavailableBecause(
        'Applikasjonen er av type development, og kan kun oppgraderes med binary builds'
      );
    }

    if (
      !this.sm.tag.containsTags() &&
      !this.component.state.loading.fetchTags
    ) {
      return serviceUnavailableBecause('Det finnes ingen tilgjengelig tags');
    }

    return undefined;
  }

  public canUpgrade = () => {
    const { deployment } = this.component.props;
    const { selectedTag, loading } = this.component.state;

    const isAuroraVersionSelectedTag = () =>
      this.component.state.deploymentDetails.deploymentSpec &&
      selectedTag &&
      selectedTag.name ===
        this.component.state.deploymentDetails.deploymentSpec.version;

    if (!selectedTag || loading.redeploy || isAuroraVersionSelectedTag()) {
      return false;
    }
    return (
      !loading.redeploy &&
      selectedTag.name !== deployment.version.deployTag.name
    );
  };
}
