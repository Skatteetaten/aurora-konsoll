import { Component } from 'react';

import { IAuroraApiComponentProps } from 'components/AuroraApi';
import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import { ImageTagType } from 'models/ImageTagType';
import { ITag, ITagsPaged, ITagsPagedGroup } from 'models/Tag';

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
  getAllApplicationDeployments: (affiliation: string) => void;
  filterPathUrl: string;
  findApplicationDeploymentDetails: (id: string) => void;
  deploymentDetails: IApplicationDeploymentDetails;
  refreshApplicationDeployment: (
    applicationDeploymentId: string,
    affiliation: string
  ) => void;
  redeployWithVersion: (
    applicationDeploymentId: string,
    version: string,
    affiliation: string,
    id: string,
    setInitialTagTypeTrue: () => void
  ) => void;
  redeployWithCurrentVersion: (
    applicationDeploymentId: string,
    affiliation: string,
    id: string
  ) => void;
  findGroupedTagsPaged: (
    repository: string,
    setTagsPagedGroup: (tagsPagedGroup: ITagsPagedGroup) => void
  ) => void;
  findTagsPaged: (
    repository: string,
    type: ImageTagType,
    updateTagsPaged: (
      type: ImageTagType,
      next: ITagsPaged,
      newTags: ITag[]
    ) => void,
    first: number,
    current: ITagsPaged
  ) => void;
  findTagsPagedResponse: ITagsPaged;
  findGroupedTagsPagedResult: ITagsPagedGroup;
  isRefreshingApplicationDeployment: boolean;
  isRedeploying: boolean;
  isFetchingDetails: boolean;
  isFetchingTags: boolean;
  affiliation: string;
}

export interface IDetailsViewState {
  tagsPagedGroup: ITagsPagedGroup;
  releaseToDeployTag: ITag;
  selectedTag?: ITag;
  selectedTagType: ImageTagType;
  versionSearchText: string;
  isInitialTagType: boolean;
  initialTagType: string;
}

interface IStateManagers {
  tag: TagStateManager;
}

export type DetailsViewComponent = Component<
  IDetailsViewProps,
  IDetailsViewState
>;

export default class DetailsViewController {
  public sm: IStateManagers;

  private component: DetailsViewComponent;

  constructor(component: DetailsViewComponent) {
    component.componentWillUnmount = () => {
      this.sm.tag.close();
    };

    this.component = component;

    this.sm = {
      tag: new TagStateManager(component.state.tagsPagedGroup, tagsPagedGroup =>
        component.setState({ tagsPagedGroup })
      )
    };
  }

  public redeployWithVersion = async () => {
    const {
      deployment,
      redeployWithVersion,
      affiliation
    } = this.component.props;
    const { selectedTag } = this.component.state;
    if (!selectedTag) {
      // TODO: Error message
      return;
    }
    const setInitialTagTypeTrue = () => {
      this.component.setState({
        isInitialTagType: true,
        initialTagType: selectedTag.type
      });
    };

    await redeployWithVersion(
      deployment.id,
      selectedTag.name,
      affiliation,
      deployment.id,
      setInitialTagTypeTrue
    );
  };

  public redeployWithCurrentVersion = async () => {
    const {
      deployment,
      redeployWithCurrentVersion,
      affiliation
    } = this.component.props;
    await redeployWithCurrentVersion(deployment.id, affiliation, deployment.id);
  };

  public refreshApplicationDeployment = async () => {
    const {
      deployment,
      refreshApplicationDeployment,
      affiliation
    } = this.component.props;
    await refreshApplicationDeployment(deployment.id, affiliation);
  };

  public loadMoreTags = async () => {
    const { deployment, findTagsPaged } = this.component.props;
    const { selectedTagType } = this.component.state;

    const current: ITagsPaged = this.sm.tag.getTagsPaged(selectedTagType);

    const updateTagsPaged = (
      type: ImageTagType,
      next: ITagsPaged,
      newTags?: ITag[]
    ) => {
      this.sm.tag.updateTagsPaged(type, next, newTags);
    };

    await findTagsPaged(
      deployment.repository,
      selectedTagType,
      updateTagsPaged,
      15,
      current
    );
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
      findApplicationDeploymentDetails,
      findGroupedTagsPaged,
      deployment
    } = this.component.props;

    findApplicationDeploymentDetails(id);
    if (repository) {
      const setTagsPagedGroup = (tagsPagedGroup: ITagsPagedGroup) =>
        this.sm.tag.setTagsPagedGroup(tagsPagedGroup);
      findGroupedTagsPaged(repository, setTagsPagedGroup);
    }
    this.component.setState(() => ({
      initialTagType: deployment.version.deployTag.type
    }));
  };

  public getVersionViewUnavailableMessage():
    | IUnavailableServiceMessage
    | undefined {
    const { deploymentSpec } = this.component.props.deploymentDetails;
    const serviceUnavailableBecause = unavailableServiceMessageCreator(
      'Det er ikke mulig å endre versjonen på denne applikasjonen'
    );

    if (deploymentSpec && deploymentSpec.type === 'development') {
      return serviceUnavailableBecause(
        'Applikasjonen er av type development, og kan kun oppgraderes med binary builds'
      );
    }

    if (!this.sm.tag.containsTags() && !this.component.props.isFetchingTags) {
      return serviceUnavailableBecause('Det finnes ingen tilgjengelig tags');
    }

    return undefined;
  }

  public canUpgrade = () => {
    const {
      deployment,
      isRedeploying,
      deploymentDetails
    } = this.component.props;
    const { selectedTag } = this.component.state;

    const isAuroraVersionSelectedTag = () =>
      deploymentDetails.deploymentSpec &&
      selectedTag &&
      selectedTag.name === deploymentDetails.deploymentSpec.version;

    if (!selectedTag || isRedeploying || isAuroraVersionSelectedTag()) {
      return false;
    }
    return (
      !isRedeploying && selectedTag.name !== deployment.version.deployTag.name
    );
  };
}
