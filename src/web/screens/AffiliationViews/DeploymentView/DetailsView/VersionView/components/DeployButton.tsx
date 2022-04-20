import React, { useState } from 'react';

import { Dialog } from '@skatteetaten/frontend-components/Dialog';
import { ActionButton } from '@skatteetaten/frontend-components/ActionButton';
import { Spinner } from '@skatteetaten/frontend-components/Spinner';
import { IImageTag } from 'web/services/auroraApiClients/imageRepositoryClient/query';
import { ReleaseToInformation } from './ReleaseToInformation';
import TextField from '@skatteetaten/frontend-components/TextField';
import styled from 'styled-components';
import MessageBar from '@skatteetaten/frontend-components/MessageBar';

export interface IDeployButtonProps {
  className?: string;
  isLoading: boolean;
  disabled: boolean;
  hasAccessToDeploy: boolean;
  dialogTitle: string;
  buttonText: string;
  releaseTo?: string;
  currentVersion: IImageTag;
  gitReference?: string;
  isBranchDeleted: boolean;
  onConfirmDeploy: (refName?: string) => void;
}

const DeployButton: React.FC<IDeployButtonProps> = ({
  className,
  isLoading,
  onConfirmDeploy,
  dialogTitle,
  buttonText,
  disabled,
  hasAccessToDeploy,
  releaseTo,
  children,
  gitReference,
  isBranchDeleted,
}) => {
  const [hidden, setHidden] = useState(true);
  const [refName, setRefName] = React.useState(gitReference);
  const close = () => {
    setHidden(true);
    setRefName(gitReference);
  };
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
        <div className={className}>
          {isBranchDeleted && (
            <MessageBar
              type={MessageBar.Type.warning}
              className="message-bar-width"
            >
              Applikasjonen har blitt deployet med en branch som er slettet.
              Løsning: Deploy applikasjonen med en annen branch som eksisterer,
              eller gjennopprett slettet branch.
            </MessageBar>
          )}
          {releaseTo && <ReleaseToInformation releaseTo={releaseTo} />}
          <div className="branch-text-field">
            <div className="branch-text-field-label">
              <p>Deployer med Aurora Config branch</p>{' '}
            </div>
            <TextField
              boldText
              errorMessage={refName === '' ? 'branch må være satt' : undefined}
              value={refName}
              onChange={(e, value) => setRefName(value)}
            />
          </div>
          {children}
        </div>
        <Dialog.Footer>
          <ActionButton
            onClick={() => {
              onConfirmDeploy(refName);
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

export default styled(DeployButton)`
  .branch-text-field {
    padding-bottom: 15px;
    margin-top: -10px;
  }

  .branch-text-field-label {
    display: flex;
    align-items: center;
    margin-bottom: -6px;
  }

  message-bar-width {
    max-width: 600px;
  }
`;
