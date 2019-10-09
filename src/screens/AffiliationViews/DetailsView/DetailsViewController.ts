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

export enum DeployVersionType {
  ACTIVE_DEPLOYMENT_VERSION = 'ACTIVE_DEPLOYMENT_VERSION',
  AURORA_CONFIG_VERSION = 'AURORA_CONFIG_VERSION',
  CURRENT_VERSION = 'CURRENT_VERSION',
  NEW_VERSION = 'NEW_VERSION'
}

export interface ICanUpgrade {
  isNewVersion: boolean;
  type: DeployVersionType;
}

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
  searchTagsPaged: (
    repository: string,
    updateTagsPaged: (next?: ITagsPaged, newTags?: ITagsPaged) => void,
    first: number,
    current: ITagsPaged,
    filter: string
  ) => void;
  findTagsPaged: (
    repository: string,
    type: ImageTagType,
    updateTagsPaged: (
      type: ImageTagType,
      next?: ITagsPaged,
      newTags?: ITagsPaged
    ) => void,
    first: number,
    current: ITagsPaged
  ) => void;
  findNewTagsPaged: (
    repository: string,
    type: ImageTagType,
    updateTagsPaged: (
      type: ImageTagType,
      next?: ITagsPaged,
      newTags?: ITagsPaged
    ) => void,
    current: ITagsPaged
  ) => void;
  findTagsPagedResponse: ITagsPaged;
  findGroupedTagsPagedResult: ITagsPagedGroup;
  isRefreshingApplicationDeployment: boolean;
  isRedeploying: boolean;
  isFetchingDetails: boolean;
  isFetchingTags: boolean;
  isFetchingGroupedTags: boolean;
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

  public redeployWithVersion = async (selectedTag?: ITag) => {
    const {
      deployment,
      redeployWithVersion,
      affiliation
    } = this.component.props;
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

  public loadMoreTags = async (searchText?: string) => {
    const {
      deployment,
      findTagsPaged,
      findNewTagsPaged,
      searchTagsPaged
    } = this.component.props;
    const { selectedTagType } = this.component.state;

    const current: ITagsPaged = this.sm.tag.getTagsPaged(selectedTagType);

    const updateTagsPaged = (
      type: ImageTagType,
      next?: ITagsPaged,
      newTags?: ITagsPaged
    ) => {
      this.sm.tag.updateTagsPaged(type, next, newTags);
    };

    const fetchNewTags = () => {
      if (deployment.imageRepository) {
        findNewTagsPaged(
          deployment.imageRepository.repository,
          selectedTagType,
          updateTagsPaged,
          current
        );
      }
    };

    if (current.hasNextPage) {
      if (selectedTagType !== ImageTagType.SEARCH) {
        fetchNewTags();
      }
      if (deployment.imageRepository) {
        if (selectedTagType === ImageTagType.SEARCH) {
          const updateSearchTagsPaged = (
            next?: ITagsPaged,
            newTags?: ITagsPaged
          ) => {
            this.sm.tag.updateTagsPaged(ImageTagType.SEARCH, next, newTags);
          };
          searchTagsPaged(
            deployment.imageRepository.repository,
            updateSearchTagsPaged,
            100,
            current,
            searchText || ''
          );
        } else {
          findTagsPaged(
            deployment.imageRepository.repository,
            selectedTagType,
            updateTagsPaged,
            100,
            current
          );
        }
      }
    } else {
      fetchNewTags();
    }
  };

  public searchForVersions = (text: string) => {
    const { deployment, searchTagsPaged } = this.component.props;

    this.sm.tag.clearTagsPaged(ImageTagType.SEARCH);
    const current: ITagsPaged = this.sm.tag.getTagsPaged(ImageTagType.SEARCH);

    const updateTagsPaged = (next?: ITagsPaged, newTags?: ITagsPaged) => {
      this.sm.tag.updateTagsPaged(ImageTagType.SEARCH, next, newTags);
    };

    if (deployment.imageRepository) {
      searchTagsPaged(
        deployment.imageRepository.repository,
        updateTagsPaged,
        100,
        current,
        text
      );
    }
  };

  public handleSelectStrategy = (type: ImageTagType) => {
    this.sm.tag.clearTagsPaged(ImageTagType.SEARCH);
    this.component.setState(() => ({
      selectedTagType: type,
      versionSearchText: ''
    }));
  };

  public setVersionSearchText = (value: string) => {
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
    const { id, imageRepository } = this.component.props.deployment;
    const {
      findApplicationDeploymentDetails,
      findGroupedTagsPaged,
      deployment
    } = this.component.props;

    findApplicationDeploymentDetails(id);

    if (imageRepository && imageRepository.guiUrl) {
      const setTagsPagedGroup = (tagsPagedGroup: ITagsPagedGroup) =>
        this.sm.tag.setTagsPagedGroup(tagsPagedGroup);
      findGroupedTagsPaged(imageRepository.repository, setTagsPagedGroup);
    }
    this.component.setState(() => ({
      initialTagType: deployment.version.deployTag.type
    }));
  };

  public getVersionViewUnavailableMessage():
    | IUnavailableServiceMessage
    | undefined {
    const {
      isFetchingTags,
      isFetchingGroupedTags,
      deploymentDetails
    } = this.component.props;
    const { deploymentSpec } = deploymentDetails;

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
      !isFetchingTags &&
      !isFetchingGroupedTags
    ) {
      return serviceUnavailableBecause('Det finnes ingen tilgjengelig tags');
    }

    return undefined;
  }

  public canUpgrade = (selectedTag?: ITag): ICanUpgrade => {
    const { deployment, deploymentDetails } = this.component.props;

    const SelectedTagEqualsAuroraConfigTag: boolean =
      (selectedTag && selectedTag.name) ===
      (deploymentDetails.deploymentSpec &&
        deploymentDetails.deploymentSpec.version);

    const SelectedTagEqualsActiveDeployTag: boolean =
      (selectedTag && selectedTag.name) === deployment.version.deployTag.name;

    if (SelectedTagEqualsAuroraConfigTag) {
      if (SelectedTagEqualsActiveDeployTag) {
        return {
          isNewVersion: false,
          type: DeployVersionType.NEW_VERSION
        };
      } else {
        return {
          isNewVersion: false,
          type: DeployVersionType.AURORA_CONFIG_VERSION
        };
      }
    }

    if (
      !SelectedTagEqualsAuroraConfigTag &&
      !SelectedTagEqualsActiveDeployTag
    ) {
      return { isNewVersion: true, type: DeployVersionType.NEW_VERSION };
    } else {
      return {
        isNewVersion: false,
        type: DeployVersionType.ACTIVE_DEPLOYMENT_VERSION
      };
    }
  };
}
