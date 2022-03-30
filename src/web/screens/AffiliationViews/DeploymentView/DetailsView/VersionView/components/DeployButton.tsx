import React, { useState } from 'react';

import { Dialog } from '@skatteetaten/frontend-components/Dialog';
import { MessageBar } from '@skatteetaten/frontend-components/MessageBar';
import { ActionButton } from '@skatteetaten/frontend-components/ActionButton';
import { Spinner } from '@skatteetaten/frontend-components/Spinner';
import { IImageTag } from 'web/services/auroraApiClients/imageRepositoryClient/query';
import { ReleaseToInformation } from './ReleaseToInformation';

export interface IDeployButtonProps {
  isLoading: boolean;
  isOldVersion: boolean;
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
  isOldVersion,
  buttonText,
  disabled,
  hasAccessToDeploy,
  releaseTo,
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
        {isOldVersion && (
          <MessageBar style={{ maxWidth: '600px' }}>
            Dette ser ut til å være en eldre versjon som har et metadata format
            vi ikke støtter. Trenger du denne versjonen ta kontakt med Aurora så
            kan vi oppgradere den manuelt for deg.
          </MessageBar>
        )}
        {releaseTo && <ReleaseToInformation releaseTo={releaseTo} />}
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
