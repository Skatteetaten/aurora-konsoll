import React, { useState } from 'react';

import Dialog from 'aurora-frontend-react-komponenter/Dialog';
import MessageBar from 'aurora-frontend-react-komponenter/MessageBar';
import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Spinner from 'aurora-frontend-react-komponenter/Spinner';
import styled from 'styled-components';
import { IImageTag } from 'services/auroraApiClients/imageRepositoryClient/query';

interface IDeployButtonProps {
  previousVersion: IImageTag;
  nextVersion: IImageTag;
  isLoading: boolean;
  onDeploy: (version: string) => void;
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
    onDeploy(nextVersion.name);
    close();
  };
  const isSameVersion = nextVersion.name === previousVersion.name;
  const buttonText = isSameVersion ? 'Redeploy' : 'Deploy';
  const title = isSameVersion
    ? 'Vil du gjøre en redeploy?'
    : 'Vil du endre versjonen?';
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
        title={title}
        dialogMinWidth="500px"
        dialogMaxWidth="800px"
      >
        {!nextVersion.image && (
          <MessageBar style={{ maxWidth: '600px' }}>
            Dette ser ut til å være en eldre versjon som har et metadata format
            vi ikke støtter. Trenger du denne versjonen ta kontakt med Aurora så
            kan vi oppgradere den manuelt for deg.
          </MessageBar>
        )}
        {isSameVersion ? (
          <>
            <VersionInfo>
              <p>Versjon:</p> {nextVersion.name}
            </VersionInfo>
          </>
        ) : (
          <>
            <VersionInfo>
              <p>Fra:</p> {previousVersion.name}
            </VersionInfo>
            <VersionInfo>
              <p>Til:</p> {nextVersion.name}
            </VersionInfo>
          </>
        )}
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
    min-width: 35px;
    margin: 0;
    margin-right: 5px;
    font-weight: 400;
  }
`;
