import React, { useEffect } from 'react';
import { Route, Switch, useRouteMatch, useHistory } from 'react-router-dom';
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

import DetailsActionBar from './DetailsActionBar';
import InformationView from './InformationView/InformationView';
import { VersionViewContainer } from './VersionView/VersionViewContainer';
import { getVersionStatus, VersionStatus } from './models/VersionStatus';
import { ApplicationDeploymentMatchParams } from 'screens/AffiliationViews/DeploymentView/DetailsView/ApplicationDeploymentSelector';

interface IDetailsViewProps {
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
function getVersionViewUnavailableMessage(
  deploymentDetails: IApplicationDeploymentDetails
): IUnavailableServiceMessage | undefined {
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

function versionStatusMessage(
  deployment: IApplicationDeployment,
  deploymentDetails: IApplicationDeploymentDetails
): VersionStatus {
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

export const DetailsView: React.FC<IDetailsViewProps> = ({
  filterPathUrl,
  affiliation,
  deployment,
  deploymentDetails,
  isFetchingDetails,
  isRefreshingApplicationDeployment,
  deleteApplicationDeployment,
  refreshApplicationDeployments,
  refreshApplicationDeployment,
  findApplicationDeploymentDetails
}) => {
  const match = useRouteMatch<ApplicationDeploymentMatchParams>();
  const history = useHistory();
  useEffect(() => {
    findApplicationDeploymentDetails(deployment.id);
  }, [deployment.id, findApplicationDeploymentDetails]);

  if (!match) {
    return null;
  }

  const unavailableMessage = getVersionViewUnavailableMessage(
    deploymentDetails
  );
  const versionStatus = versionStatusMessage(deployment, deploymentDetails);

  const goToDeploymentsPage = () => {
    history.push(`/a/${affiliation}/deployments/${filterPathUrl}`);
  };

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
        goToDeploymentsPage={goToDeploymentsPage}
        refreshApplicationDeployment={() =>
          refreshApplicationDeployment(deployment.id, affiliation)
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
              versionStatus={versionStatus}
              isUpdating={isRefreshingApplicationDeployment}
              deployment={deployment}
              isFetchingDetails={isFetchingDetails}
              deploymentDetails={deploymentDetails}
              refreshApplicationDeployment={() =>
                refreshApplicationDeployment(deployment.id, affiliation)
              }
              refreshApplicationDeployments={refreshApplicationDeployments}
              deleteApplicationDeployment={deleteApplicationDeployment}
              goToDeploymentsPage={goToDeploymentsPage}
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
};

const DetailsViewGrid = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
