import * as React from 'react';
import styled from 'styled-components';

import { ExternalLink } from 'components/ExternalLink';
import Spinner from 'components/Spinner';
import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import { ActiveDeploymentInformation } from './ActiveDeploymentInformation';
import { DeploymentSpecInformation } from './DeploymentSpecInformation';
import { GitAndBuildInformation } from './GitAndBuildInformation';
import PodStatus from './PodStatus';
import StatusCheckReportCard from './StatusCheckReportCard';

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
  isUpdating,
  refreshApplicationDeployment
}: IInformationViewProps) => {
  const { deploymentSpec, pods } = deploymentDetails;
  if (isFetchingDetails) {
    return <Spinner />;
  }
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
          <h3>Tjenestelenker</h3>
          <ul>
            {deploymentDetails.serviceLinks.map(link => (
              <li style={{ marginBottom: '5px' }}>
                <ExternalLink target="_blank" href={link.url}>
                  {link.name}
                </ExternalLink>
              </li>
            ))}
          </ul>
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
        {pods.map(pod => (
          <PodStatus
            key={pod.name}
            pod={pod}
            className="info-pod"
            isUpdating={isUpdating}
            refreshApplicationDeployment={refreshApplicationDeployment}
          />
        ))}
      </div>
    </div>
  );
};

export default styled(InformationView)`
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
