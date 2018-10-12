import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { withAuroraApi } from 'components/AuroraApi';
import Card from 'components/Card';
import TabLink, { TabLinkWrapper } from 'components/TabLink';
import { defaultTagsPagedGroup } from 'models/Tag';

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

  public render() {
    const { deployment, match } = this.props;
    const {
      deploymentDetails,
      loading,
      selectedTagType,
      selectedTag,
      versionSearchText
    } = this.state;
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
                showNoTagsMessage={this.controller.shouldShowMissingTagsMessage()}
                deployedTag={deployment.version.deployTag}
                selectedTag={selectedTag}
                selectedTagType={selectedTagType}
                tagsPaged={this.controller.sm.tag.getTagsPageFiltered(
                  selectedTagType,
                  versionSearchText
                )}
                isFetchingTags={loading.fetchTags}
                isRedeploying={loading.redeploy}
                canUpgrade={this.controller.canUpgrade()}
                handleSelectNextTag={this.controller.handleSelectNextTag}
                handlefetchTags={this.controller.loadMoreTags}
                handleSelectStrategy={this.controller.handleSelectStrategy}
                handleVersionSearch={this.controller.handleVersionSearch}
                redeployWithVersion={this.controller.redeployWithVersion}
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
