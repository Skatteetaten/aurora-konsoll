import MessageBar from 'aurora-frontend-react-komponenter/MessageBar';
import * as React from 'react';
import styled from 'styled-components';

import PodStatus from 'components/PodStatus';
import { IApplicationDeployment } from 'services/auroraApiClients';
import styled from 'styled-components';

import PodStatus from './PodStatus';

interface IInformationViewProps {
  deployment: IApplicationDeployment;
  className?: string;
}

const InformationView = ({ deployment, className }: IInformationViewProps) => (
  <div className={className}>
    <h3>Versjon</h3>
    <MessageBar>
      Følger: {deployment.version.deployTag}
      <br />
      Eksakt versjon: {deployment.version.auroraVersion}
    </MessageBar>

    <h3>Deployments</h3>
    <div className="info-deployments">
      {deployment.pods.map(pod => (
        <PodStatus key={pod.name} pod={pod} className="info-pod" />
      ))}
    </div>
  </div>
);

export default styled(InformationView)`
  .info-deployments {
    display: flex;
  }

  .info-pod {
    flex: 1;
    margin-right: 10px;
  }
`;
