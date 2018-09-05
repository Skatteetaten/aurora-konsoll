import * as React from 'react';

import PodStatus from 'components/PodStatus';
import { IApplicationDeployment } from 'services/AuroraApiClient/types';

interface IInformationViewProps {
  deployment: IApplicationDeployment;
}

const InformationView = ({ deployment }: IInformationViewProps) => (
  <>
    <p>DeployTag: {deployment.version.deployTag}</p>
    <p>AuroraVersion: {deployment.version.auroraVersion}</p>
    <p>{deployment.repository}</p>
    {deployment.pods.map(pod => (
      <PodStatus key={pod.name} pod={pod} />
    ))}
  </>
);

export default InformationView;
