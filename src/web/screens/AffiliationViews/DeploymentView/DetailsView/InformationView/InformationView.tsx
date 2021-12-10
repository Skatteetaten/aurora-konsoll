import React from 'react';
import styled from 'styled-components';

import { Button, ActionButton } from '@skatteetaten/frontend-components';
import { ActiveDeploymentInformation } from './ActiveDeploymentInformation';
import { DeploymentSpecInformation } from './DeploymentSpecInformation';
import { GitAndBuildInformation } from './GitAndBuildInformation';
import { ServiceLinks } from './ServiceLinks';
import StatusCheckReportCard from './StatusCheckReportCard';
import PodsStatus from './PodsStatus';
import ConfirmationDialog from 'web/components/ConfirmationDialog';
import { VersionStatus } from '../models/VersionStatus';
import { ApplicationDeployment } from 'web/models/immer/ApplicationDeployment';
import { InformationViewNotifications } from './InformationViewNotifications';

interface IInformationViewProps {
  versionStatus: VersionStatus;
  deployment: ApplicationDeployment;
  className?: string;
  isUpdating: boolean;
  refreshApplicationDeployment: () => void;
  deleteApplicationDeployment: (namespace: string, name: string) => void;
  goToDeploymentsPage: () => void;
}

const InformationView = ({
  versionStatus,
  deployment,
  className,
  refreshApplicationDeployment,
  isUpdating,
  deleteApplicationDeployment,
  goToDeploymentsPage,
}: IInformationViewProps) => {
  const { deploymentSpec, pods } = deployment.details;
  const hasManagementInterface =
    !!deploymentSpec && !!deploymentSpec.management;

  const hasManagementLinksErrors =
    pods.map(
      (pod) =>
        pod.managementResponses &&
        pod.managementResponses.links &&
        pod.managementResponses.links.error
    ).length > 0;

  const renderConfirmationOpenButton = (open: () => void) => (
    <Button
      icon="Delete"
      buttonStyle="primaryRoundedFilled"
      onClick={open}
      disabled={!deployment.permission.paas.admin}
    >
      Slett applikasjon
    </Button>
  );

  const renderConfirmationFooterButtons = (close: () => void) => {
    const deleteApp = () => {
      deleteApplicationDeployment(deployment.namespace, deployment.name);
      close();
      goToDeploymentsPage();
    };

    return (
      <>
        <ActionButton
          onClick={deleteApp}
          iconSize={ActionButton.LARGE}
          icon="Check"
          color="black"
        >
          Ja
        </ActionButton>
        <ActionButton
          onClick={close}
          iconSize={ActionButton.LARGE}
          icon="Cancel"
          color="black"
        >
          Nei
        </ActionButton>
      </>
    );
  };

  return (
    <div className={className}>
      <div className="info-grid">
        <div>
          <ActiveDeploymentInformation
            versionStatus={versionStatus}
            deployment={deployment}
          />
          <DeploymentSpecInformation deploymentSpec={deploymentSpec} />
          <GitAndBuildInformation deploymentDetails={deployment.details} />
        </div>
        <div>
          <h3>AuroraStatus for deployment</h3>
          <StatusCheckReportCard deployment={deployment} />
          <ServiceLinks serviceLinks={deployment.details.serviceLinks} />
          <br />
          <ConfirmationDialog
            title="Slett applikasjon"
            text={`Ønsker du å slette applikasjonen ${deployment.name}?`}
            renderOpenDialogButton={renderConfirmationOpenButton}
            renderFooterButtons={renderConfirmationFooterButtons}
          />
        </div>
        <div>
          <InformationViewNotifications
            hasManagementInterface={hasManagementInterface}
            deployment={deployment}
          />
        </div>
      </div>
      <hr
        style={{
          borderWidth: '2px',
          margin: '30px 0',
        }}
      />
      <h3>Pods fra OpenShift</h3>
      <div className="info-deployments">
        {hasManagementLinksErrors && (
          <PodsStatus
            isUpdating={isUpdating}
            refreshApplicationDeployment={refreshApplicationDeployment}
            details={deployment.details}
          />
        )}
      </div>
    </div>
  );
};

export default styled(InformationView)`
  margin-bottom: 16px;
  .health-status {
    background: white;
    display: flex;
    p {
      padding: 10px 0;
      margin: 0;
      &:first-child {
        margin-right: 10px;
      }
    }
  }

  .labels {
    display: flex;
  }

  .info-deployments {
    display: flex;
    flex-wrap: wrap;
  }

  .info-pod {
    max-width: 400px;
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .info-grid {
    display: flex;
    > div {
      margin-right: 40px;
    }
  }
`;
