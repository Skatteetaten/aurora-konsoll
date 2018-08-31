import * as React from 'react';

import InfoStripe from 'components/InfoStripe';
import PodStatus from 'components/PodStatus';
import { IApplicationDeployment } from 'services/AuroraApiClient/types';

interface IInformationViewProps {
  deployment: IApplicationDeployment;
}

const InformationView = ({ deployment }: IInformationViewProps) => (
  <>
    <InfoStripe name="Applikasjon">
      <p>DeployTag: {deployment.version.deployTag}</p>
      <p>AuroraVersion: {deployment.version.auroraVersion}</p>
      <p>{deployment.repository}</p>
    </InfoStripe>
    <InfoStripe name="Deployment">
      {deployment.pods.map(pod => (
        <PodStatus key={pod.name} pod={pod} />
      ))}
    </InfoStripe>
  </>
);

export default InformationView;
