import * as React from 'react';

import MessageBar from '@skatteetaten/frontend-components/MessageBar';

import { ApplicationDeployment } from 'models/immer/ApplicationDeployment';

interface IInformationViewNotificationsProps {
  hasManagementInterface: boolean;
  deployment: ApplicationDeployment;
}

export const InformationViewNotifications = ({
  deployment,
  hasManagementInterface,
}: IInformationViewNotificationsProps) => {
  function isMissingManagementInterface() {
    if (!hasManagementInterface) {
      return false;
    }
    const anyRunningPodsHasHealth = deployment.details.pods.reduce(
      (acc, pod) => {
        return pod.phase.toLowerCase() === 'running'
          ? acc ||
              (!!pod.managementResponses && !!pod.managementResponses.health)
          : acc;
      },
      false
    );
    if (anyRunningPodsHasHealth) {
      return false;
    }
    return true;
  }

  const isInvalidImageReference =
    deployment.imageRepository &&
    !deployment.imageRepository.isFullyQualified &&
    deployment.details.deploymentSpec?.type === 'deploy';

  if (isMissingManagementInterface() || isInvalidImageReference) {
    return (
      <div>
        <h3>Meldinger</h3>
        {isMissingManagementInterface() && (
          <MessageBar type={MessageBar.Type.info} isMultiline={true}>
            Mangler management interface.
            <br />
            Helsesjekk fra pods er ikke inkludert i AuroraStatus.
          </MessageBar>
        )}
        {isInvalidImageReference && (
          <>
            <br />
            <MessageBar type={MessageBar.Type.warning} isMultiline={true}>
              Referansen til Docker Imaget går ikke mot det interne Docker
              Registry.
              <br />
              Det vil ikke gå an å se versjonslisten.
            </MessageBar>
          </>
        )}
      </div>
    );
  }

  return null;
};
