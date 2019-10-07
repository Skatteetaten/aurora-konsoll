import * as React from 'react';
import styled from 'styled-components';

import Button from 'aurora-frontend-react-komponenter/Button';
import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Spinner from 'components/Spinner';
import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import { ActiveDeploymentInformation } from './ActiveDeploymentInformation';
import { DeploymentSpecInformation } from './DeploymentSpecInformation';
import { GitAndBuildInformation } from './GitAndBuildInformation';
import { ManagementInterface } from './ManagementInterface';
import { ServiceLinks } from './ServiceLinks';
import StatusCheckReportCard from './StatusCheckReportCard';
import PodsStatus from './PodsStatus';
import ConfirmationDialog from 'components/ConfirmationDialog';

interface IInformationViewProps {
  isFetchingDetails: boolean;
  deploymentDetails: IApplicationDeploymentDetails;
  deployment: IApplicationDeployment;
  className?: string;
  isUpdating: boolean;
  refreshApplicationDeployment: () => void;
  refreshApplicationDeployments: () => void;
  deleteApplicationDeployment: (namespace: string, name: string) => void;
  goToDeploymentsPage: () => void;
}

const InformationView = ({
  isFetchingDetails,
  deploymentDetails,
  deployment,
  className,
  refreshApplicationDeployment,
  refreshApplicationDeployments,
  isUpdating,
  deleteApplicationDeployment,
  goToDeploymentsPage
}: IInformationViewProps) => {
  const { deploymentSpec, pods } = deploymentDetails;
  if (isFetchingDetails) {
    return <Spinner />;
  }

  const hasManagementInterface =
    !!deploymentSpec && !!deploymentSpec.management;

  const hasManagementLinksErrors =
    pods.map(
      pod =>
        pod.managementResponses &&
        pod.managementResponses.links &&
        pod.managementResponses.links.error
    ).length > 0;

  const renderConfirmationOpenButton = (open: () => void) => (
    <Button icon="Delete" buttonType="primaryRoundedFilled" onClick={open} disabled={!deployment.permission.paas.admin}>
      Slett applikasjon
    </Button>
  );

  const renderConfirmationFooterButtons = (close: () => void) => {
    const deleteApp = () => {
      deleteApplicationDeployment(deployment.namespace, deployment.name);
      close();
      goToDeploymentsPage();
      refreshApplicationDeployments();
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
            pods={pods}
            deployment={deployment}
            deploymentSpec={deploymentSpec}
            deploymentDetails={deploymentDetails}
          />
          <DeploymentSpecInformation deploymentSpec={deploymentSpec} />
          <GitAndBuildInformation deploymentDetails={deploymentDetails} />
        </div>
        <div>
          <h3>AuroraStatus for deployment</h3>
          <StatusCheckReportCard deployment={deployment} />
          <ServiceLinks serviceLinks={deploymentDetails.serviceLinks} />
          <br />
          <ConfirmationDialog
            title="Slett applikasjon"
            text={`Ønsker du å slette applikasjonen ${deployment.name}?`}
            renderOpenDialogButton={renderConfirmationOpenButton}
            renderFooterButtons={renderConfirmationFooterButtons}
          />
        </div>
        <div>
          <ManagementInterface
            hasManagementInterface={hasManagementInterface}
            details={deploymentDetails}
          />
        </div>
      </div>
      <hr
        style={{
          borderWidth: '2px',
          margin: '30px 0'
        }}
      />
      <h3>Pods fra OpenShift</h3>
      <div className="info-deployments">
        {hasManagementLinksErrors && (
          <PodsStatus
            isUpdating={isUpdating}
            refreshApplicationDeployment={refreshApplicationDeployment}
            details={deploymentDetails}
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
