import * as React from 'react';
import styled from 'styled-components';

import InfoContent from 'components/InfoContent';
import InfoDialog from 'components/InfoDialog';
import Spinner from 'components/Spinner';
import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import { IDeploymentSpec } from 'models/DeploymentSpec';
import { toStatusColor } from 'models/Status';
import PodStatus from './PodStatus';
import StatusCheckReport from './StatusCheckReport';

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
          <h3>Aktivt deployment</h3>
          <InfoContent values={getApplicationDeploymentValues(deployment)} />
          <h3>Gjeldende AuroraConfig</h3>
          <InfoContent values={getDeploymentSpecValues(deploymentSpec)} />
        </div>
        <div>
          <h3>AuroraStatus</h3>
          <div className="status-card">
            <header
              style={{
                background: toStatusColor(deployment.status.code).base
              }}
            >
              {deployment.status.code}
            </header>
            {deployment.status.reasons.length > 0 && (
              <ul>
                {deployment.status.reasons.map(reason => (
                  <li key={reason.name}>
                    {reason.name} ({reason.failLevel})
                  </li>
                ))}
              </ul>
            )}
            <InfoDialog title="Helsesjekkrapport">
              <StatusCheckReport
                reports={deployment.status.reports}
                reasons={deployment.status.reasons}
              />
            </InfoDialog>
          </div>
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

function getDeploymentSpecValues(deploymentSpec?: IDeploymentSpec) {
  let values: { [key: string]: any } = {};
  if (deploymentSpec) {
    const { database, management, certificate, type } = deploymentSpec;
    values = {
      Type: type
    };
    if (['development', 'deploy'].indexOf(type) !== -1) {
      values.GroupId = deploymentSpec.groupId;
      values.ArtifactId = deploymentSpec.artifactId;
    }
    values.Version = deploymentSpec.version;
    if (deploymentSpec.releaseTo) {
      values.ReleaseTo = deploymentSpec.releaseTo;
    }
    if (database) {
      values.Database = 'Ja';
    }
    if (certificate) {
      values.Certificate = 'Ja';
    }
    if (management) {
      values.Management = `Path: ${management.path} | Port: ${management.port}`;
    }
  }
  return values;
}

function getApplicationDeploymentValues(deployment: IApplicationDeployment) {
  return {
    Tag: deployment.version.deployTag.name,
    'Aurora version': deployment.version.auroraVersion,
    'Image repository': deployment.repository
      .split('/')
      .slice(1)
      .join('/')
  };
}

export default styled(InformationView)`
  .status-card {
    min-width: 300px;
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    background: white;

    header {
      font-weight: 700;
      color: white;
      text-align: center;
      padding: 10px;
    }

    ul {
      padding-left: 20px;
      margin: 15px;
    }

    button {
      border-top: 1px solid #e8e8e8;
      padding: 20px;
    }
  }
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
  }

  .info-pod {
    flex: 1;
    margin-right: 10px;
  }

  .info-grid {
    display: flex;
    > div {
      margin-right: 40px;
    }
  }
`;
