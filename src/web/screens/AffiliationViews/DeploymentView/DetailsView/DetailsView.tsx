import React from 'react';
import { Route, Switch, useRouteMatch, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import Card from 'web/components/Card';
import TabLink, { TabLinkWrapper } from 'web/components/TabLink';
import UnavailableServiceMessage from 'web/components/UnavailableServiceMessage';
import { VersionsContainer } from 'web/containers/VersionsContainer';
import {
  IUnavailableServiceMessage,
  unavailableServiceMessageCreator,
} from 'web/models/UnavailableServiceMessage';

import DetailsActionBar from './DetailsActionBar';
import InformationView from './InformationView/InformationView';
import { VersionViewContainer } from './VersionView/VersionViewContainer';
import { getVersionStatus, VersionStatus } from './models/VersionStatus';
import { ApplicationDeploymentMatchParams } from 'web/screens/AffiliationViews/DeploymentView/DetailsView/ApplicationDeploymentSelector';
import { ApplicationDeployment } from 'web/models/immer/ApplicationDeployment';
import SkapJobView from './SkapJobView/SkapJobView';

interface IDetailsViewProps {
  deployment: ApplicationDeployment;
  filterPathUrl: string;
  refreshApplicationDeployment: (
    applicationDeploymentId: string,
    affiliation: string
  ) => Promise<void>;
  deleteAndRefreshApplications: (
    affiliation: string,
    namespace: string,
    name: string
  ) => Promise<void>;
  isRefreshing: boolean;
  affiliation: string;
  refreshVersions: (repository: string) => Promise<void>;
}

function getVersionViewUnavailableMessage(
  deployment: ApplicationDeployment
): IUnavailableServiceMessage | undefined {
  const serviceUnavailableBecause = unavailableServiceMessageCreator(
    'Det er ikke mulig å endre versjonen på denne applikasjonen'
  );

  if (deployment.details.deploymentSpec?.type === 'development') {
    return serviceUnavailableBecause(
      'Applikasjonen er av type development, og kan kun oppgraderes med binary builds',
      'info'
    );
  }

  if (
    deployment.imageRepository &&
    !deployment.imageRepository.isFullyQualified
  ) {
    return serviceUnavailableBecause(
      'Applikasjonen har en Docker Image referanse som ikke går mot det interne Docker Registry, og versjoner kan dermed ikke hentes',
      'warning'
    );
  }

  if (!deployment.imageRepository) {
    return serviceUnavailableBecause(
      'Applikasjonen mangler image referanse. Dette kan bla. oppstå dersom applikasjonen er deployet med "type: development" og det er endret til "type: deploy" i applikasjonsfila. Løsningen er å deploye applikasjonen med ao slik at den får en image referanse.',
      'warning'
    );
  }

  return undefined;
}

function versionStatusMessage(
  deployment: ApplicationDeployment
): VersionStatus {
  const { pods, deploymentSpec } = deployment.details;
  const { deployTag, releaseTo } = deployment.version;

  const deploymentInProgress = !!deployment.status.reasons.find(
    (status) => status.name === 'DeploymentInProgressCheck'
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
  isRefreshing,
  deleteAndRefreshApplications,
  refreshApplicationDeployment,
  refreshVersions,
}) => {
  const match = useRouteMatch<ApplicationDeploymentMatchParams>();
  const history = useHistory();

  if (!match) {
    return null;
  }

  const unavailableMessage = getVersionViewUnavailableMessage(deployment);
  const versionStatus = versionStatusMessage(deployment);

  const goToDeploymentsPage = () => {
    history.push(`/a/${affiliation}/deployments${filterPathUrl}`);
  };

  return (
    <DetailsViewGrid>
      <VersionsContainer
        hasPermission={deployment.permission.paas.admin}
        imageRepository={deployment.imageRepository}
      />
      <DetailsActionBar
        title={`${deployment.environment}/${deployment.name}`}
        isRefreshing={isRefreshing}
        updatedTime={deployment.time}
        goToDeploymentsPage={goToDeploymentsPage}
        refreshApplicationDeployment={() => {
          refreshApplicationDeployment(deployment.id, affiliation);
          const repository = deployment.imageRepository?.repository;
          repository && refreshVersions(repository);
        }}
      />
      <TabLinkWrapper>
        <TabLink to={`${match.url}/info`}>Sammendrag</TabLink>
        <TabLink to={`${match.url}/version`}>Oppgradering</TabLink>
        <TabLink to={`${match.url}/skapJobs`}>WebSEAL/BIG-IP</TabLink>
      </TabLinkWrapper>
      <Card>
        <Switch>
          <Route path={`${match.path}/info`}>
            <InformationView
              versionStatus={versionStatus}
              isUpdating={isRefreshing}
              deployment={deployment}
              refreshApplicationDeployment={() =>
                refreshApplicationDeployment(deployment.id, affiliation)
              }
              deleteApplicationDeployment={(namespace, name) =>
                deleteAndRefreshApplications(affiliation, namespace, name)
              }
              goToDeploymentsPage={goToDeploymentsPage}
            />
          </Route>
          <Route path={`${match.path}/version`}>
            {unavailableMessage ? (
              <UnavailableServiceMessage
                message={unavailableMessage}
                type={unavailableMessage.type}
              />
            ) : (
              <VersionViewContainer
                versionStatus={versionStatus}
                deploymentSpecVersion={
                  deployment.details.deploymentSpec &&
                  deployment.details.deploymentSpec.version
                }
                deployment={deployment}
                auroraConfigFiles={deployment.files}
              />
            )}
          </Route>
          <Route path={`${match.path}/skapJobs`}>
            <SkapJobView route={deployment.route} />
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
