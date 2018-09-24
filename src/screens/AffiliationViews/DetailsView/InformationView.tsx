import * as React from 'react';
import styled from 'styled-components';

// import MessageBar from 'aurora-frontend-react-komponenter/MessageBar';

import { IApplicationDeployment } from 'services/auroraApiClients';

import Label from 'components/Label';
import { IDeploymentSpec } from 'services/auroraApiClients/applicationDeploymentClient/DeploymentSpec';
import PodStatus from './PodStatus';

interface IInformationViewProps {
  deployment: IApplicationDeployment;
  deploymentSpec?: IDeploymentSpec;
  className?: string;
}

const InformationView = ({
  deployment,
  deploymentSpec,
  className
}: IInformationViewProps) => (
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
                <p>{management.path}</p>
                <p>{management.port}</p>
              </>
            )}
          </Label>
        </div>
        {/* <DeploymentSpecViewer>
          {JSON.stringify(deploymentSpec, undefined, '  ')}
        </DeploymentSpecViewer> */}
      </>
    )}

    <h3>Deployments</h3>
    <div className="info-deployments">
      {deployment.pods.map(pod => (
        <PodStatus key={pod.name} pod={pod} className="info-pod" />
      ))}
    </div>
  </div>
);

// const DeploymentSpecViewer = styled.pre`
//   background-color: white;
//   overflow-x: hidden;
// `;

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
