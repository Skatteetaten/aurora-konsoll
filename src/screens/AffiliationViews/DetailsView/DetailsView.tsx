import * as React from 'react';

import { IApplicationDeployment } from 'services/AuroraApiClient/types';
import PodCard from './PodCard';

export interface IDetailsViewProps {
  deployment: IApplicationDeployment;
}

const DetailsView = ({ deployment }: IDetailsViewProps) => (
  <div>
    <h1>
      {deployment.environment}/{deployment.name}
    </h1>
    <p>DeployTag: {deployment.version.deployTag}</p>
    <p>AuroraVersion: {deployment.version.auroraVersion}</p>
    <p>{deployment.repository}</p>
    {deployment.pods.map(pod => (
      <PodCard pod={pod} key={pod.name} />
    ))}
  </div>
);

export default DetailsView;
