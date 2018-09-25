import * as React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';

import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';
import TabLink, { TabLinkWrapper } from 'components/TabLink';
import { ImageTagType, TagsPagedGroup } from 'models/TagsPagedGroup';
import {
  IApplicationDeployment,
  ITag,
  ITagsPaged
} from 'services/auroraApiClients';
import { IDeploymentSpec } from 'services/auroraApiClients/applicationDeploymentClient/DeploymentSpec';

import Card from 'components/Card';
import Label from 'components/Label';
import { ApplicationDeploymentDetailsRoute } from '../ApplicationDeploymentSelector';
import InformationViewBase from './InformationView';
import { IVersionStrategyOption } from './TagTypeSelector';
import VersionViewBase from './VersionView';

interface IDetailsViewState {
  tagsPagedGroup: TagsPagedGroup;
  deploymentSpec?: IDeploymentSpec;
  selectedNextTag?: string;
  imageTagType: ImageTagType;
  loading: {
    fetchTags: boolean;
    redeploy: boolean;
  };
  versionSearchText: string;
}

interface IDetailsViewProps
  extends ApplicationDeploymentDetailsRoute,
    IAuroraApiComponentProps {
  deployment: IApplicationDeployment;
  fetchApplicationDeployments: () => void;
}

class DetailsView extends React.Component<
  IDetailsViewProps,
  IDetailsViewState
> {
  public state: IDetailsViewState = {
    imageTagType: ImageTagType.MAJOR,
    loading: {
      fetchTags: false,
      redeploy: false
    },
    selectedNextTag: '',
    tagsPagedGroup: new TagsPagedGroup(),
    versionSearchText: ''
  };

  constructor(props: IDetailsViewProps) {
    super(props);
    this.state.imageTagType = props.deployment.version.deployTag.type;
  }

  public handleSelectNextTag = (tag?: ITag) => {
    this.setState({
      selectedNextTag: tag && tag.name
    });
  };

  public setLoading = (
    loading: {
      fetchTags?: boolean;
      redeploy?: boolean;
    },
    nextState?: any
  ) => {
    this.setState(state => ({
      loading: {
        fetchTags: loading.fetchTags || state.loading.fetchTags,
        redeploy: loading.redeploy || state.loading.redeploy
      },
      ...nextState
    }));
  };

  public setStatewithLoading = async (
    type: string,
    cb: () => Promise<any | undefined>
  ) => {
    this.setLoading({
      [type]: true
    });

    const result = await cb();
    const nextState = result || {};

    this.setLoading(
      {
        [type]: false
      },
      nextState
    );
  };

  public redeployWithVersion = async () => {
    const { clients, deployment } = this.props;
    const { selectedNextTag } = this.state;
    if (!selectedNextTag) {
      return;
    }

    this.setLoading({
      redeploy: true
    });

    const success = await clients.applicationDeploymentClient.redeployWithVersion(
      deployment.id,
      selectedNextTag
    );

    this.setLoading({
      redeploy: false
    });

    if (success) {
      this.props.fetchApplicationDeployments();
    }
  };

  public loadMoreTags = async () => {
    const { clients, deployment } = this.props;
    const { tagsPagedGroup, imageTagType } = this.state;

    let cursor: string;
    if (tagsPagedGroup) {
      const current: ITagsPaged = tagsPagedGroup.getTagsPaged(imageTagType);
      cursor = current.endCursor;
    }

    this.setStatewithLoading('fetchTags', async () => {
      const tagsPaged = await clients.imageRepositoryClient.findTagsPaged(
        deployment.repository,
        15,
        cursor,
        [imageTagType]
      );
      return {
        tagsPagedGroup: tagsPagedGroup.updateTagsPaged(imageTagType, tagsPaged)
      };
    });
  };

  public handleSelectedStrategy = (
    e: Event,
    option: IVersionStrategyOption
  ) => {
    e.preventDefault();
    this.setState(() => ({
      imageTagType: option.key
    }));
  };

  public handleVersionSearch = (value: string) => {
    this.setState({
      versionSearchText: value
    });
  };

  public async componentDidMount() {
    const { clients, deployment } = this.props;

    this.setLoading({
      fetchTags: true
    });

    /*
    TODO: Apply this when Gobo has implemented find DeploymentSpec
    const spec = await clients.applicationDeploymentClient.findDeploymentSpec(
      deployment.environment,
      deployment.name
    );
    this.setState(() => ({
      deploymentSpec: spec
    }));
    */

    const tagsPagedGroup = await clients.imageRepositoryClient.findGroupedTagsPaged(
      deployment.repository
    );

    this.setState(state => ({
      loading: {
        ...state.loading,
        fetchTags: false
      },
      tagsPagedGroup
    }));
  }

  public render() {
    const { deployment, match } = this.props;
    const {
      deploymentSpec,
      loading,
      imageTagType,
      selectedNextTag
    } = this.state;

    const InformationView = () => (
      <InformationViewBase
        deployment={deployment}
        deploymentSpec={deploymentSpec}
      />
    );
    const VersionView = () => (
      <VersionViewBase
        currentDeployedTag={deployment.version.deployTag.name}
        handleSelectNextTag={this.handleSelectNextTag}
        redeployWithVersion={this.redeployWithVersion}
        canLoadMore={this.canLoadMoreTags()}
        handlefetchTags={this.loadMoreTags}
        handleSelectedStrategy={this.handleSelectedStrategy}
        handleVersionSearch={this.handleVersionSearch}
        isFetchingTags={loading.fetchTags}
        isRedeploying={loading.redeploy}
        imageTagType={imageTagType}
        tags={this.getTagsForType(imageTagType)}
        canUpgrade={
          !!(
            selectedNextTag !== deployment.version.deployTag.name &&
            selectedNextTag &&
            selectedNextTag.length > 0 &&
            !loading.redeploy
          )
        }
      />
    );

    const title = `${deployment.environment}/${deployment.name}`;
    return (
      <DetailsViewGrid>
        <div className="labels">
          <Label text="deployment" subText={title} />
          <Label text="tag" subText={deployment.version.deployTag.name} />
          <Label text="versjon" subText={deployment.version.auroraVersion} />
        </div>
        <TabLinkWrapper>
          <TabLink to={`${match.url}/info`}>Informasjon</TabLink>
          <TabLink to={`${match.url}/version`}>Oppgradering</TabLink>
        </TabLinkWrapper>
        <Card>
          <Route path={`${match.path}/info`} render={InformationView} />
          <Route path={`${match.path}/version`} render={VersionView} />
        </Card>
      </DetailsViewGrid>
    );
  }
  private getTagsForType = (type: ImageTagType): ITag[] => {
    const { tagsPagedGroup, versionSearchText } = this.state;
    if (!tagsPagedGroup) {
      return [];
    }

    return tagsPagedGroup.getTagsForType(type, versionSearchText);
  };

  private canLoadMoreTags = () => {
    const { tagsPagedGroup, imageTagType } = this.state;
    return (
      !!tagsPagedGroup && tagsPagedGroup.getTagsPaged(imageTagType).hasNextPage
    );
  };
}

const DetailsViewGrid = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  .labels {
    display: flex;
    margin: 10px 0 20px 0;
  }
`;

export const DetailsViewBaseWithApi = withAuroraApi(DetailsView);

export default DetailsView;
