import MessageBar from 'aurora-frontend-react-komponenter/MessageBar';
import * as React from 'react';

import PodStatus from 'components/PodStatus';
import { IApplicationDeployment } from 'services/AuroraApiClient/types';

interface IInformationViewProps {
  deployment: IApplicationDeployment;
}

const InformationView = ({ deployment }: IInformationViewProps) => (
  <>
    <h3>Versjon</h3>
    <MessageBar>
      Følger: {deployment.version.deployTag}
      <br />
      Eksakt versjon: {deployment.version.auroraVersion}
    </MessageBar>

    <h3>Deployments</h3>
    {deployment.pods.map(pod => (
      <PodStatus key={pod.name} pod={pod} />
    ))}
  </>
);

export default InformationView;
