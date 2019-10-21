import * as React from 'react';

import MessageBar from 'aurora-frontend-react-komponenter/MessageBar';

import { IApplicationDeploymentDetails } from 'models/ApplicationDeployment';

interface IManagementInterfaceProps {
  hasManagementInterface: boolean;
  details: IApplicationDeploymentDetails;
}

export const ManagementInterface = ({
  details,
  hasManagementInterface
}: IManagementInterfaceProps) => {
  if (!hasManagementInterface) {
    return null;
  }

  const anyRunningPodsHasHealth = details.pods.reduce((acc, pod) => {
    return pod.phase.toLowerCase() === 'running'
      ? acc || (!!pod.managementResponses && !!pod.managementResponses.health)
      : acc;
  }, false);

  if (anyRunningPodsHasHealth) {
    return null;
  }

  return (
    <>
      <h3>Til info</h3>
      <MessageBar type={MessageBar.Type.info} isMultiline={true}>
        Mangler management interface.
        <br />
        Helsesjekk fra pods er ikke inkludert i AuroraStatus.
      </MessageBar>
    </>
  );
};
