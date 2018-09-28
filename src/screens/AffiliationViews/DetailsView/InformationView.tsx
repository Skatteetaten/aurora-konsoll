import * as React from 'react';
import styled from 'styled-components';

import { IApplicationDeploymentDetails } from 'services/auroraApiClients';

import Label from 'components/Label';
import Spinner from 'components/Spinner';
import PodStatus from './PodStatus';

interface IInformationViewProps {
  isFetchingDetails: boolean;
  deploymentDetails: IApplicationDeploymentDetails;
  className?: string;
}

const InformationView = ({
  isFetchingDetails,
  deploymentDetails,
  className
}: IInformationViewProps) => {
  const { deploymentSpec, pods } = deploymentDetails;
  if (isFetchingDetails) {
    return <Spinner />;
  }
  return (
    <div className={className}>
      {deploymentSpec && (
        <>
          <h3>Tjenester</h3>
          <div className="labels">
            <Label text="Database" exists={deploymentSpec.database} />
            <Label text="Sertifikat" exists={deploymentSpec.certificate} />
            <Label text="Management" data={deploymentSpec.management}>
              {management => (
                <>
                  <p>Path: {management.path}</p>
                  <p>Port: {management.port}</p>
                </>
              )}
            </Label>
          </div>
        </>
      )}

      <h3>Deployments</h3>
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
`;
