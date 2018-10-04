import * as React from 'react';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Button from 'aurora-frontend-react-komponenter/Button';

import InfoDialog from 'components/InfoDialog';
import Spinner from 'components/Spinner';
import styled from 'styled-components';

interface IUpgradeVersionDialogProps {
  previousVersion: string;
  newVersion: string | undefined;
  isRedeploying: boolean;
  redeployWithVersion: () => void;
  canUpgrade: boolean;
}

const UpgradeVersionDialog = ({
  previousVersion,
  newVersion,
  isRedeploying,
  redeployWithVersion,
  canUpgrade
}: IUpgradeVersionDialogProps) => {
  const renderFooterButtons = (close: () => void) => {
    const onClose = () => {
      redeployWithVersion();
      close();
    };
    return <ActionButton onClick={onClose}>Utfør</ActionButton>;
  };

  const renderOpenDialogButton = (open: () => void) => {
    return (
      <Button buttonType="primary" onClick={open} disabled={!canUpgrade}>
        {isRedeploying ? <Spinner /> : 'Endre versjon'}
      </Button>
    );
  };

  return (
    <InfoDialog
      title="Vil du endre versjonen?"
      renderOpenDialogButton={renderOpenDialogButton}
      renderFooterButtons={renderFooterButtons}
    >
      <>
        <VersionInfo>
          <p>Fra:</p>
          {previousVersion}
        </VersionInfo>
        <VersionInfo>
          <p>Til:</p>
          {newVersion}
        </VersionInfo>
      </>
    </InfoDialog>
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

export default UpgradeVersionDialog;
