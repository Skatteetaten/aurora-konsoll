import * as React from 'react';
import styled from 'styled-components';

import InfoContent from 'components/InfoContent';
import Spinner from 'components/Spinner';
import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import { IDeploymentSpec } from 'models/DeploymentSpec';
import PodStatus from './PodStatus';

interface IInformationViewProps {
  isFetchingDetails: boolean;
  deploymentDetails: IApplicationDeploymentDetails;
  deployment: IApplicationDeployment;
  className?: string;
}

const InformationView = ({
  isFetchingDetails,
  deploymentDetails,
  deployment,
  className
}: IInformationViewProps) => {
  const { deploymentSpec, pods } = deploymentDetails;
  if (isFetchingDetails) {
    return <Spinner />;
  }
  return (
    <div className={className}>
      <div className="info-grid">
        <div>
          <h3>Gjeldende AuroraConfig</h3>
          <InfoContent values={getDeploymentSpecValues(deploymentSpec)} />
        </div>
        <div>
          <h3>Aktivt deployment</h3>
          <InfoContent values={getApplicationDeploymentValues(deployment)} />
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
          <PodStatus key={pod.name} pod={pod} className="info-pod" />
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
      .join('/'),
    Status:
      deployment.status.code +
      (deployment.status.comment && ` (${deployment.status.comment})`)
  };
}

export default styled(InformationView)`
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
    div {
      margin-right: 20px;
    }
  }
`;
