import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import Card from 'components/Card';
import TabLink, { TabLinkWrapper } from 'components/TabLink';
import UnavailableServiceMessage from 'components/UnavailableServiceMessage';
import { InitVersionsContainer } from 'containers/InitVersionsContainer';
import {
  IUnavailableServiceMessage,
  unavailableServiceMessageCreator
} from 'models/UnavailableServiceMessage';
import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';

import { ApplicationDeploymentDetailsRoute } from '../../ApplicationDeploymentSelector';
import DetailsActionBar from './DetailsActionBar';
import InformationView from './InformationView/InformationView';
import { VersionViewContainer } from './VersionView/VersionViewContainer';
import { getVersionStatus, VersionStatus } from './models/VersionStatus';

interface IDetailsViewProps extends ApplicationDeploymentDetailsRoute {
  deployment: IApplicationDeployment;
  getAllApplicationDeployments: (affiliation: string) => void;
  filterPathUrl: string;
  findApplicationDeploymentDetails: (id: string) => void;
  deploymentDetails: IApplicationDeploymentDetails;
  refreshApplicationDeployment: (
    applicationDeploymentId: string,
    affiliation: string
  ) => void;
  refreshApplicationDeployments: () => void;
  deleteApplicationDeployment: (namespace: string, name: string) => void;
  isRefreshingApplicationDeployment: boolean;
  isFetchingDetails: boolean;
  affiliation: string;
  isApplicationDeploymentDeleted: boolean;
}

export class DetailsView extends React.Component<IDetailsViewProps> {
  public refreshApplicationDeployment = () => {
    const {
      deployment,
      refreshApplicationDeployment,
      affiliation
    } = this.props;
    refreshApplicationDeployment(deployment.id, affiliation);
  };

  public goToDeploymentsPage = () => {
    const { match, history, filterPathUrl } = this.props;
    history.push(`/a/${match.params.affiliation}/deployments/${filterPathUrl}`);
  };

  public getVersionViewUnavailableMessage():
    | IUnavailableServiceMessage
    | undefined {
    const { deploymentDetails } = this.props;
    const { deploymentSpec } = deploymentDetails;

    const serviceUnavailableBecause = unavailableServiceMessageCreator(
      'Det er ikke mulig å endre versjonen på denne applikasjonen'
    );

    if (deploymentSpec && deploymentSpec.type === 'development') {
      return serviceUnavailableBecause(
        'Applikasjonen er av type development, og kan kun oppgraderes med binary builds'
      );
    }

    return undefined;
  }

  public getVersionStatus(): VersionStatus {
    const { deployment, deploymentDetails } = this.props;
    const { pods, deploymentSpec } = deploymentDetails;
    const { deployTag, releaseTo } = deployment.version;

    const deploymentInProgress = !!deployment.status.reasons.find(
      status => status.name === 'DeploymentInProgressCheck'
    );

    return getVersionStatus(
      pods,
      deployTag.name,
      deploymentSpec && deploymentSpec.version,
      releaseTo,
      deploymentInProgress
    );
  }

  public async componentDidMount() {
    const { id } = this.props.deployment;
    const { findApplicationDeploymentDetails } = this.props;

    findApplicationDeploymentDetails(id);
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

    const unavailableMessage = this.getVersionViewUnavailableMessage();
    const versionStatus = this.getVersionStatus();

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
          goToDeploymentsPage={this.goToDeploymentsPage}
          refreshApplicationDeployment={this.refreshApplicationDeployment}
        />
        <TabLinkWrapper>
          <TabLink to={`${match.url}/info`}>Sammendrag</TabLink>
          <TabLink to={`${match.url}/version`}>Oppgradering</TabLink>
        </TabLinkWrapper>
        <Card>
          <Switch>
            <Route path={`${match.path}/info`}>
              <InformationView
                versionStatus={versionStatus}
                isUpdating={isRefreshingApplicationDeployment}
                deployment={deployment}
                isFetchingDetails={isFetchingDetails}
                deploymentDetails={deploymentDetails}
                refreshApplicationDeployment={this.refreshApplicationDeployment}
                refreshApplicationDeployments={refreshApplicationDeployments}
                deleteApplicationDeployment={deleteApplicationDeployment}
                goToDeploymentsPage={this.goToDeploymentsPage}
              />
            </Route>
            <Route path={`${match.path}/version`}>
              {unavailableMessage ? (
                <UnavailableServiceMessage message={unavailableMessage} />
              ) : (
                <VersionViewContainer
                  versionStatus={versionStatus}
                  configuredVersion={
                    deploymentDetails.deploymentSpec &&
                    deploymentDetails.deploymentSpec.version
                  }
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
