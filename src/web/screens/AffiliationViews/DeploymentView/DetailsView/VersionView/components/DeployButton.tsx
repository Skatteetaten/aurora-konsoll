import React, { useState } from 'react';

import { Dialog } from '@skatteetaten/frontend-components/Dialog';
import { ActionButton } from '@skatteetaten/frontend-components/ActionButton';
import { Spinner } from '@skatteetaten/frontend-components/Spinner';
import { IImageTag } from 'web/services/auroraApiClients/imageRepositoryClient/query';
import { ReleaseToInformation } from './ReleaseToInformation';

export interface IDeployButtonProps {
  isLoading: boolean;
  disabled: boolean;
  hasAccessToDeploy: boolean;
  dialogTitle: string;
  buttonText: string;
  releaseTo?: string;
  currentVersion: IImageTag;
  onConfirmDeploy: () => void;
}

export const DeployButton: React.FC<IDeployButtonProps> = ({
  isLoading,
  onConfirmDeploy,
  dialogTitle,
  buttonText,
  disabled,
  hasAccessToDeploy,
  releaseTo,
  currentVersion,
  children,
}) => {
  const [hidden, setHidden] = useState(true);
  const close = () => setHidden(true);
  const open = () => setHidden(false);
  return (
    <>
      <ActionButton
        disabled={isLoading || disabled || !hasAccessToDeploy}
        onClick={open}
        icon="Deploy"
        style={{ opacity: isLoading ? 1 : undefined }}
      >
        {isLoading ? <Spinner /> : buttonText}
      </ActionButton>
      <Dialog
        hidden={hidden}
        onDismiss={close}
        title={dialogTitle}
        minWidth="500px"
        maxWidth="800px"
      >
        {releaseTo && <ReleaseToInformation currentVersion={currentVersion} />}
        {children}
        <Dialog.Footer>
          <ActionButton
            onClick={() => {
              onConfirmDeploy();
              close();
            }}
          >
            Utfør
          </ActionButton>
          <ActionButton onClick={close}>Lukk</ActionButton>
        </Dialog.Footer>
      </Dialog>
    </>
  );
};
