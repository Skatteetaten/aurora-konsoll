import React, { useState } from 'react';

import Dialog from 'aurora-frontend-react-komponenter/Dialog';
import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Spinner from 'aurora-frontend-react-komponenter/Spinner';
import styled from 'styled-components';

interface IDeployButtonProps {
  previousVersion: string;
  nextVersion: string;
  isLoading: boolean;
  onDeploy: () => void;
  disabled: boolean;
}

type Props = IDeployButtonProps;

export const DeployButton = ({
  isLoading,
  onDeploy,
  nextVersion,
  previousVersion,
  disabled
}: Props) => {
  const [hidden, setHidden] = useState(true);
  const close = () => setHidden(true);
  const open = () => setHidden(false);
  const onApply = () => {
    onDeploy();
    close();
  };
  const buttonText = nextVersion === previousVersion ? 'Redeploy' : 'Deploy';
  return (
    <>
      <ActionButton
        disabled={disabled}
        onClick={open}
        icon="Deploy"
        style={{ opacity: isLoading ? 1 : undefined }}
      >
        {isLoading ? <Spinner /> : buttonText}
      </ActionButton>
      <Dialog
        hidden={hidden}
        onDismiss={close}
        title="Vil du endre versjonen?"
        dialogMinWidth="500px"
        dialogMaxWidth="800px"
      >
        <VersionInfo>
          <p>Fra:</p> {previousVersion}
        </VersionInfo>
        <VersionInfo>
          <p>Til:</p> {nextVersion}
        </VersionInfo>
        <Dialog.Footer>
          <ActionButton onClick={onApply}>Utfør</ActionButton>
          <ActionButton onClick={close}>Lukk</ActionButton>
        </Dialog.Footer>
      </Dialog>
    </>
  );
};

const VersionInfo = styled.div`
  display: flex;
  margin: 10px 0;
  font-weight: 700;

  p {
    width: 40px;
    margin: 0;
    font-weight: 400;
  }
`;
