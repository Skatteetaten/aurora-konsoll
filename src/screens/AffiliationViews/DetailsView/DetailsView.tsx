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
  IApplicationDeployment,
  IApplicationDeploymentDetails,
  ITag,
  ITagsPaged
} from 'services/auroraApiClients';
import LoadingStateManager from 'services/LoadingStateManager';
import {
  ImageTagType,
  ITagsPagedGroup,
  TagStateManager
} from 'services/TagStateManager';

import { ApplicationDeploymentDetailsRoute } from '../ApplicationDeploymentSelector';
import InformationView from './InformationView';
import { IImageTagTypeOption } from './TagTypeSelector/TagTypeSelector';
import VersionView from './VersionView';

interface IDetailsViewProps
  extends ApplicationDeploymentDetailsRoute,
    IAuroraApiComponentProps {
  deployment: IApplicationDeployment;
  fetchApplicationDeployments: () => void;
}

interface IDetailsViewState {
  tagsPagedGroup: ITagsPagedGroup;
  deploymentDetails: IApplicationDeploymentDetails;
  selectedTag?: ITag;
  selectedTagType: ImageTagType;
  loading: IDetailsViewLoading;
  versionSearchText: string;
}

interface IDetailsViewLoading {
  fetchTags: boolean;
  fetchDetails: boolean;
  redeploy: boolean;
  update: boolean;
}

class DetailsView extends React.Component<
  IDetailsViewProps,
  IDetailsViewState
> {
  public state: IDetailsViewState = {
    deploymentDetails: {
      pods: []
    },
    loading: {
      fetchDetails: false,
      fetchTags: false,
      redeploy: false,
      update: false
    },
    selectedTagType: this.props.deployment.version.deployTag.type,
    tagsPagedGroup: TagStateManager.defaultTagsPagedGroup(),
    versionSearchText: ''
  };

  private loadingStateManager = new LoadingStateManager<IDetailsViewLoading>(
    this.state.loading,
    loading => this.setState({ loading })
  );

  private tagStateManager = new TagStateManager(
    this.state.tagsPagedGroup,
    tagsPagedGroup => this.setState({ tagsPagedGroup })
  );

  public redeployWithVersion = () => {
    const { clients, deployment } = this.props;
    const { selectedTag } = this.state;
    if (!selectedTag) {
      // TODO: Error message
      return;
    }

    this.loadingStateManager.withLoading(['redeploy'], async () => {
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

    this.loadingStateManager.withLoading(['update'], async () => {
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
    const { selectedTagType } = this.state;

    const current: ITagsPaged = this.tagStateManager.getTagsPaged(
      selectedTagType
    );
    const cursor = current.endCursor;

    this.loadingStateManager.withLoading(['fetchTags'], async () => {
      const tagsPaged = await clients.imageRepositoryClient.findTagsPaged(
        deployment.repository,
        15,
        cursor,
        [selectedTagType]
      );

      this.tagStateManager.updateTagsPaged(selectedTagType, tagsPaged);
    });
  };

  public handleSelectedStrategy = (e: Event, option: IImageTagTypeOption) => {
    e.preventDefault();
    this.setState(() => ({
      selectedTagType: option.key
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
    const { id, repository } = this.props.deployment;
    const {
      applicationDeploymentClient,
      imageRepositoryClient
    } = this.props.clients;

    this.loadingStateManager.withLoading(
      ['fetchTags', 'fetchDetails'],
      async () => {
        const [deploymentDetails, tagsPagedGroup] = await Promise.all([
          applicationDeploymentClient.findApplicationDeploymentDetails(id),
          imageRepositoryClient.findGroupedTagsPaged(repository)
        ]);

        this.setState({ deploymentDetails });
        this.tagStateManager.setTagsPagedGroup(tagsPagedGroup);
      }
    );
  }

  public componentWillUnmount() {
    this.loadingStateManager.close();
    this.tagStateManager.close();
  }

  public render() {
    const { deployment, match } = this.props;
    const {
      deploymentDetails,
      loading,
      selectedTagType,
      selectedTag,
      versionSearchText
    } = this.state;

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
                isFetchingDetails={loading.fetchDetails}
                deploymentDetails={deploymentDetails}
              />
            </Route>
            <Route path={`${match.path}/version`}>
              <VersionView
                deployedTag={deployment.version.deployTag}
                selectedTag={selectedTag}
                selectedTagType={selectedTagType}
                tagsPaged={this.tagStateManager.getTagsPageFiltered(
                  selectedTagType,
                  versionSearchText
                )}
                isFetchingTags={loading.fetchTags}
                isRedeploying={loading.redeploy}
                canUpgrade={this.canUpgrade()}
                handleSelectNextTag={this.handleSelectNextTag}
                handlefetchTags={this.loadMoreTags}
                handleSelectedStrategy={this.handleSelectedStrategy}
                handleVersionSearch={this.handleVersionSearch}
                redeployWithVersion={this.redeployWithVersion}
              />
            </Route>
          </Switch>
        </Card>
      </DetailsViewGrid>
    );
  }

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
