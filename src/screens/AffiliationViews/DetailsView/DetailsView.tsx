import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { withAuroraApi } from 'components/AuroraApi';
import Card from 'components/Card';
import TabLink, { TabLinkWrapper } from 'components/TabLink';
import { defaultTagsPagedGroup } from 'models/Tag';

import DetailsService from 'services/DetailsService';
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
    releaseToDeployTag: this.props.deployment.version.deployTag,
    selectedTagType: this.props.deployment.version.deployTag.type,
    tagsPagedGroup: defaultTagsPagedGroup(),
    versionSearchText: '',
    initialTagType: '',
    isInitialTagType: true
  };

  private detailsService = new DetailsService();

  private controller = new DetailsViewController(this);

  public async componentDidMount() {
    this.controller.onMount();
  }

  public async componentDidUpdate() {
    const { tagsPagedGroup, isInitialTagType } = this.state;
    const { deployment, deploymentDetails } = this.props;
    if (
      !!deployment.version.releaseTo &&
      isInitialTagType &&
      this.detailsService.hasRecivedTagsAndVersion(
        tagsPagedGroup,
        deploymentDetails
      )
    ) {
      const deploymentSpecTag = this.detailsService.findTagForDeploymentSpec(
        tagsPagedGroup,
        deploymentDetails.deploymentSpec
      );
      const tag = deploymentSpecTag || deployment.version.deployTag;

      this.setState({
        releaseToDeployTag: tag,
        selectedTagType: tag.type,
        isInitialTagType: false
      });
    }
  }

  public getDeployTag = () => {
    const { deployment } = this.props;
    const { releaseToDeployTag } = this.state;
    return !!deployment.version.releaseTo
      ? releaseToDeployTag
      : deployment.version.deployTag;
  };

  public render() {
    const {
      deployment,
      match,
      deploymentDetails,
      isFetchingDetails,
      isFetchingTags,
      isFetchingGroupedTags,
      isRedeploying,
      isRefreshingApplicationDeployment,
      isApplicationDeploymentDeleted,
      deleteApplicationDeployment
    } = this.props;
    const { selectedTagType, selectedTag } = this.state;
    return (
      <DetailsViewGrid>
        <DetailsActionBar
          title={`${deployment.environment}/${deployment.name}`}
          isRefreshing={isRefreshingApplicationDeployment}
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
                isUpdating={isRefreshingApplicationDeployment}
                deployment={deployment}
                isFetchingDetails={isFetchingDetails}
                deploymentDetails={deploymentDetails}
                refreshApplicationDeployment={
                  this.controller.refreshApplicationDeployment
                }
                isApplicationDeploymentDeleted={isApplicationDeploymentDeleted}
                deleteApplicationDeployment={deleteApplicationDeployment}
              />
            </Route>
            <Route path={`${match.path}/version`}>
              <VersionView
                hasPermissionToUpgrade={deployment.permission.paas.admin}
                unavailableMessage={this.controller.getVersionViewUnavailableMessage()}
                deployedTag={this.getDeployTag()}
                selectedTag={selectedTag}
                selectedTagType={selectedTagType}
                tagsPaged={this.controller.sm.tag.getTagsPageFiltered(
                  selectedTagType
                )}
                isFetchingTags={isFetchingTags}
                isFetchingGroupedTags={isFetchingGroupedTags}
                isRedeploying={isRedeploying}
                canUpgrade={this.controller.canUpgrade}
                handleSelectNextTag={this.controller.handleSelectNextTag}
                handlefetchTags={this.controller.loadMoreTags}
                handleSelectStrategy={this.controller.handleSelectStrategy}
                setVersionSearchText={this.controller.setVersionSearchText}
                searchForVersions={this.controller.searchForVersions}
                redeployWithVersion={this.controller.redeployWithVersion}
                redeployWithCurrentVersion={
                  this.controller.redeployWithCurrentVersion
                }
                initialTagType={this.state.initialTagType}
                findGroupedTagsPagedResult={
                  this.props.findGroupedTagsPagedResult
                }
                versionSearchText={this.state.versionSearchText}
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
