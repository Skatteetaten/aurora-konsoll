import React, { useState } from 'react';

import Dialog from 'aurora-frontend-react-komponenter/Dialog';
import MessageBar from 'aurora-frontend-react-komponenter/MessageBar';
import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Spinner from 'aurora-frontend-react-komponenter/Spinner';

export interface IDeployButtonProps {
  isLoading: boolean;
  isOldVersion: boolean;
  hasAccessToDeploy: boolean;
  dialogTitle: string;
  buttonText: string;
  onConfirmDeploy: () => void;
}

export const DeployButton: React.FC<IDeployButtonProps> = ({
  isLoading,
  onConfirmDeploy,
  dialogTitle,
  isOldVersion,
  buttonText,
  hasAccessToDeploy,
  children
}) => {
  const [hidden, setHidden] = useState(true);
  const close = () => setHidden(true);
  const open = () => setHidden(false);
  return (
    <>
      <ActionButton
        disabled={isLoading || !hasAccessToDeploy}
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
        dialogMinWidth="500px"
        dialogMaxWidth="800px"
      >
        {isOldVersion && (
          <MessageBar style={{ maxWidth: '600px' }}>
            Dette ser ut til å være en eldre versjon som har et metadata format
            vi ikke støtter. Trenger du denne versjonen ta kontakt med Aurora så
            kan vi oppgradere den manuelt for deg.
          </MessageBar>
        )}
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
