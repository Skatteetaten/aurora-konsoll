import * as React from 'react';
import styled from 'styled-components';

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

interface IInformationViewProps {
  isFetchingDetails: boolean;
  deploymentDetails: IApplicationDeploymentDetails;
  deployment: IApplicationDeployment;
  className?: string;
  isUpdating: boolean;
  refreshApplicationDeployment: () => void;
}

const InformationView = ({
  isFetchingDetails,
  deploymentDetails,
  deployment,
  className,
  refreshApplicationDeployment,
  isUpdating
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

  return (
    <div className={className}>
      <div className="info-grid">
        <div>
          <ActiveDeploymentInformation
            pods={pods}
            deployment={deployment}
            deploymentSpec={deploymentSpec}
          />
          <DeploymentSpecInformation deploymentSpec={deploymentSpec} />
          <GitAndBuildInformation deploymentDetails={deploymentDetails} />
        </div>
        <div>
          <h3>AuroraStatus for deployment</h3>
          <StatusCheckReportCard deployment={deployment} />
          <ServiceLinks serviceLinks={deploymentDetails.serviceLinks} />
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
