import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { withAuroraApi } from 'components/AuroraApi';
import Card from 'components/Card';
import TabLink, { TabLinkWrapper } from 'components/TabLink';
import { defaultTagsPagedGroup, ITag } from 'models/Tag';

import { ImageTagType } from 'models/ImageTagType';
import DetailsActionBar from './DetailsActionBar';
import DetailsViewController, {
  IDetailsViewProps,
  IDetailsViewState
} from './DetailsViewController';
import InformationView from './InformationView/InformationView';
import VersionView from './VersionView/VersionView';

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
    tagsPagedGroup: defaultTagsPagedGroup(),
    versionSearchText: ''
  };

  private controller = new DetailsViewController(this);

  public async componentDidMount() {
    this.controller.onMount();
  }

  public async componentDidUpdate() {
    if (
      this.state.deploymentDetails.deploymentSpec &&
      this.state.deploymentDetails.deploymentSpec.version &&
      this.props.deployment.version.releaseTo
    ) {
      this.setState({
        selectedTagType: this.filterfunction()
      });
    }
  }

  public filterfunction = () => {
    const isCorrentVersion = (it: ITag) =>
      this.state.deploymentDetails.deploymentSpec &&
      it.name === this.state.deploymentDetails.deploymentSpec.version;
    if (
      this.state.tagsPagedGroup.auroraSnapshotVersion.tags.filter(
        isCorrentVersion
      ).length > 0
    ) {
      return ImageTagType.AURORA_SNAPSHOT_VERSION;
    } else if (
      this.state.tagsPagedGroup.auroraVersion.tags.filter(isCorrentVersion)
        .length > 0
    ) {
      return ImageTagType.AURORA_VERSION;
    } else if (
      this.state.tagsPagedGroup.bugfix.tags.filter(isCorrentVersion).length > 0
    ) {
      return ImageTagType.BUGFIX;
    } else if (
      this.state.tagsPagedGroup.commitHash.tags.filter(isCorrentVersion)
        .length > 0
    ) {
      return ImageTagType.COMMIT_HASH;
    } else if (
      this.state.tagsPagedGroup.latest.tags.filter(isCorrentVersion).length > 0
    ) {
      return ImageTagType.LATEST;
    } else if (
      this.state.tagsPagedGroup.major.tags.filter(isCorrentVersion).length > 0
    ) {
      return ImageTagType.MAJOR;
    } else if (
      this.state.tagsPagedGroup.minor.tags.filter(isCorrentVersion).length > 0
    ) {
      return ImageTagType.MINOR;
    } else if (
      this.state.tagsPagedGroup.snapshot.tags.filter(isCorrentVersion).length >
      0
    ) {
      return ImageTagType.SNAPSHOT;
    } else {
      return ImageTagType.AURORA_SNAPSHOT_VERSION;
    }
  };

  public deployVersion = (): ITag => {
    if (
      this.state.deploymentDetails.deploymentSpec &&
      this.props.deployment.version.releaseTo
    ) {
      return {
        name: this.state.deploymentDetails.deploymentSpec.version,
        lastModified: '',
        type: this.state.selectedTagType
      };
    } else {
      return this.props.deployment.version.deployTag;
    }
  };

  public render() {
    const { deployment, match } = this.props;
    const {
      deploymentDetails,
      loading,
      selectedTagType,
      selectedTag,
      versionSearchText
    } = this.state;

    // tslint:disable-next-line:no-console
    console.log(selectedTagType);
    return (
      <DetailsViewGrid>
        <DetailsActionBar
          title={`${deployment.environment}/${deployment.name}`}
          isRefreshing={loading.update}
          updatedTime={deployment.time}
          goToDeploymentsPage={this.controller.goToDeploymentsPage}
          refreshApplicationDeployment={
            this.controller.refreshApplicationDeployment
          }
        />
        <TabLinkWrapper>
          <TabLink to={`${match.url}/info`}>Sammendrag</TabLink>
          <TabLink to={`${match.url}/version`}>Oppgradering</TabLink>
        </TabLinkWrapper>
        <Card>
          <Switch>
            <Route path={`${match.path}/info`}>
              <InformationView
                isUpdating={loading.update}
                deployment={deployment}
                isFetchingDetails={loading.fetchDetails}
                deploymentDetails={deploymentDetails}
                refreshApplicationDeployment={
                  this.controller.refreshApplicationDeployment
                }
              />
            </Route>
            <Route path={`${match.path}/version`}>
              <VersionView
                hasPermissionToUpgrade={deployment.permission.paas.admin}
                unavailableMessage={this.controller.getVersionViewUnavailableMessage()}
                deployedTag={this.deployVersion()}
                selectedTag={selectedTag}
                selectedTagType={selectedTagType}
                tagsPaged={this.controller.sm.tag.getTagsPageFiltered(
                  selectedTagType,
                  versionSearchText
                )}
                isFetchingTags={loading.fetchTags}
                isRedeploying={loading.redeploy}
                canUpgrade={!!this.controller.canUpgrade()}
                handleSelectNextTag={this.controller.handleSelectNextTag}
                handlefetchTags={this.controller.loadMoreTags}
                handleSelectStrategy={this.controller.handleSelectStrategy}
                handleVersionSearch={this.controller.handleVersionSearch}
                redeployWithVersion={this.controller.redeployWithVersion}
                redeployWithCurrentVersion={
                  this.controller.redeployWithCurrentVersion
                }
                hasReleaseTo={this.filterfunction()}
              />
            </Route>
          </Switch>
        </Card>
      </DetailsViewGrid>
    );
  }
}

const DetailsViewGrid = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const DetailsViewBaseWithApi = withAuroraApi(DetailsView);

export default DetailsView;
