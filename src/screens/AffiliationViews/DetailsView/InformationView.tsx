import * as React from 'react';
import styled from 'styled-components';

import InfoContent from 'components/InfoContent';
import Spinner from 'components/Spinner';
import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
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
  let values: { [key: string]: any } = {};
  if (deploymentSpec) {
    const { database, management, certificate } = deploymentSpec;
    values = {
      GroupId: deploymentSpec.groupId,
      // tslint:disable-next-line:object-literal-sort-keys
      ArtifactId: deploymentSpec.artifactId,
      Version: deploymentSpec.version
    };
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
  return (
    <div className={className}>
      <div className="info-grid">
        <div>
          <h3>Gjeldende AuroraConfig</h3>
          <InfoContent values={values} />
        </div>
        <div>
          <h3>Aktivt deployment</h3>
          <InfoContent
            values={{
              'Aurora version': deployment.version.auroraVersion,
              'Image repository': deployment.repository
                .split('/')
                .slice(1)
                .join('/'),
              Status:
                deployment.status.code +
                (deployment.status.comment &&
                  ` (${deployment.status.comment})`),
              Tag: deployment.version.deployTag.name
            }}
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
        {pods.map(pod => (
          <PodStatus key={pod.name} pod={pod} className="info-pod" />
        ))}
      </div>
    </div>
  );
};

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
