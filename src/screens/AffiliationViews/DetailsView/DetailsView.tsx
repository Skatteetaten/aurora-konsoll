import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { withAuroraApi } from 'components/AuroraApi';
import Card from 'components/Card';
import TabLink, { TabLinkWrapper } from 'components/TabLink';

import DetailsActionBar from './DetailsActionBar';
import DetailsViewController, {
  IDetailsViewProps
} from './DetailsViewController';
import InformationView from './InformationView/InformationView';
import { VersionView } from 'screens/VersionView/VersionView';
import UnavailableServiceMessage from 'components/UnavailableServiceMessage';
import { InitVersionsContainer } from 'containers/InitVersionsContainer';

class DetailsView extends React.Component<IDetailsViewProps> {
  private controller = new DetailsViewController(this);

  public async componentDidMount() {
    this.controller.onMount();
  }

  public render() {
    const {
      affiliation,
      deployment,
      match,
      deploymentDetails,
      isFetchingDetails,
      isRefreshingApplicationDeployment,
      deleteApplicationDeployment,
      refreshApplicationDeployments
    } = this.props;

    const unavailableMessage = this.controller.getVersionViewUnavailableMessage();
    return (
      <DetailsViewGrid>
        <InitVersionsContainer
          hasPermission={deployment.permission.paas.admin}
          imageRepository={deployment.imageRepository}
        />
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
                refreshApplicationDeployments={refreshApplicationDeployments}
                deleteApplicationDeployment={deleteApplicationDeployment}
                goToDeploymentsPage={this.controller.goToDeploymentsPage}
              />
            </Route>
            <Route path={`${match.path}/version`}>
              {unavailableMessage ? (
                <UnavailableServiceMessage message={unavailableMessage} />
              ) : (
                <VersionView
                  affiliation={affiliation}
                  deployment={deployment}
                />
              )}
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
