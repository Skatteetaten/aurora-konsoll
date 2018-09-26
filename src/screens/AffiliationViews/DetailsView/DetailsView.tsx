import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import Button from 'aurora-frontend-react-komponenter/Button';

import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';
import Spinner from 'components/Spinner';
import TabLink, { TabLinkWrapper } from 'components/TabLink';

import Card from 'components/Card';
import Label from 'components/Label';
import {
  ImageTagType,
  ITagsPagedGroup,
  TagsPagedGroup
} from 'models/TagsPagedGroup';
import {
  IApplicationDeployment,
  ITag,
  ITagsPaged
} from 'services/auroraApiClients';
import { IDeploymentSpec } from 'services/auroraApiClients/applicationDeploymentClient/DeploymentSpec';
import LoadingService from 'services/LoadingService';

import { ApplicationDeploymentDetailsRoute } from '../ApplicationDeploymentSelector';
import InformationView from './InformationView';
import { IVersionStrategyOption } from './TagTypeSelector';
import VersionView from './VersionView';

interface IDetailsViewProps
  extends ApplicationDeploymentDetailsRoute,
    IAuroraApiComponentProps {
  deployment: IApplicationDeployment;
  fetchApplicationDeployments: () => void;
}

interface IDetailsViewState {
  tagsPagedGroup: ITagsPagedGroup;
  deploymentSpec?: IDeploymentSpec;
  selectedTag?: ITag;
  imageTagType: ImageTagType;
  loading: IDetailsViewLoading;
  versionSearchText: string;
}

interface IDetailsViewLoading {
  fetchTags: boolean;
  redeploy: boolean;
  update: boolean;
}

class DetailsView extends React.Component<
  IDetailsViewProps,
  IDetailsViewState
> {
  public state: IDetailsViewState = {
    imageTagType: ImageTagType.MAJOR,
    loading: {
      fetchTags: false,
      redeploy: false,
      update: false
    },
    tagsPagedGroup: TagsPagedGroup.defaultTagsPagedGroup(),
    versionSearchText: ''
  };

  private loadingService = new LoadingService<IDetailsViewLoading>(
    this.state.loading,
    loading => this.setState({ loading })
  );

  private tagService = new TagsPagedGroup(
    this.state.tagsPagedGroup,
    tagsPagedGroup => this.setState({ tagsPagedGroup })
  );

  constructor(props: IDetailsViewProps) {
    super(props);
    this.state.imageTagType = props.deployment.version.deployTag.type;
  }

  public redeployWithVersion = () => {
    const { clients, deployment } = this.props;
    const { selectedTag } = this.state;
    if (!selectedTag) {
      return;
    }

    this.loadingService.withLoading('redeploy', async () => {
      const success = await clients.applicationDeploymentClient.redeployWithVersion(
        deployment.id,
        selectedTag.name
      );
      if (success) {
        this.props.fetchApplicationDeployments();
      }
    });
  };

  public refreshApplicationDeployment = () => {
    const { clients, deployment } = this.props;

    this.loadingService.withLoading('update', async () => {
      const success = await clients.applicationDeploymentClient.refreshApplicationDeployment(
        deployment.id
      );
      if (success) {
        this.props.fetchApplicationDeployments();
      }
    });
  };

  public loadMoreTags = () => {
    const { clients, deployment } = this.props;
    const { imageTagType } = this.state;

    const current: ITagsPaged = this.tagService.getTagsPaged(imageTagType);
    const cursor = current.endCursor;

    this.loadingService.withLoading('fetchTags', async () => {
      const tagsPaged = await clients.imageRepositoryClient.findTagsPaged(
        deployment.repository,
        15,
        cursor,
        [imageTagType]
      );

      this.tagService.updateTagsPaged(imageTagType, tagsPaged);
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

  public handleSelectNextTag = (tag?: ITag) => {
    this.setState({
      selectedTag: tag
    });
  };

  public async componentDidMount() {
    const { clients, deployment } = this.props;

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

    this.loadingService.withLoading('fetchTags', async () => {
      const tagsPagedGroup = await clients.imageRepositoryClient.findGroupedTagsPaged(
        deployment.repository
      );
      this.tagService.setTagsPagedGroup(tagsPagedGroup);
    });
  }

  public render() {
    const { deployment, match } = this.props;
    const { deploymentSpec, loading, imageTagType, selectedTag } = this.state;

    const title = `${deployment.environment}/${deployment.name}`;
    return (
      <DetailsViewGrid>
        <div className="labels-and-refresh-button">
          <div className="labels">
            <Label text="deployment" subText={title} />
            <Label text="tag" subText={deployment.version.deployTag.name} />
            <Label text="versjon" subText={deployment.version.auroraVersion} />
          </div>
          <Button
            buttonType="primaryRoundedFilled"
            onClick={this.refreshApplicationDeployment}
          >
            {loading.update ? <Spinner /> : 'Oppdater'}
          </Button>
        </div>
        <TabLinkWrapper>
          <TabLink to={`${match.url}/info`}>Informasjon</TabLink>
          <TabLink to={`${match.url}/version`}>Oppgradering</TabLink>
        </TabLinkWrapper>
        <Card>
          <Switch>
            <Route path={`${match.path}/info`}>
              <InformationView
                deployment={deployment}
                deploymentSpec={deploymentSpec}
              />
            </Route>
            <Route path={`${match.path}/version`}>
              <VersionView
                deployedTag={deployment.version.deployTag}
                selectedTag={selectedTag}
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
                canUpgrade={this.canUpgrade()}
              />
            </Route>
          </Switch>
        </Card>
      </DetailsViewGrid>
    );
  }

  private getTagsForType = (type: ImageTagType): ITag[] => {
    const { versionSearchText } = this.state;
    return this.tagService.getTagsForType(type, versionSearchText);
  };

  private canLoadMoreTags = () => {
    const { imageTagType } = this.state;
    return this.tagService.getTagsPaged(imageTagType).hasNextPage;
  };

  private canUpgrade = () => {
    const { deployment } = this.props;
    const { selectedTag, loading } = this.state;
    if (!selectedTag) {
      return false;
    }
    return (
      !loading.redeploy &&
      selectedTag.name !== deployment.version.deployTag.name
    );
  };
}

const DetailsViewGrid = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  .labels-and-refresh-button {
    display: flex;
    margin: 10px;
    align-items: center;
    .labels {
      display: flex;
      flex: 1;
    }
    button {
      justify-self: flex-end;
      min-width: 125px;
    }
  }
`;

export const DetailsViewBaseWithApi = withAuroraApi(DetailsView);

export default DetailsView;
