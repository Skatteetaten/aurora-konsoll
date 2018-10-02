import * as React from 'react';
import styled from 'styled-components';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Button from 'aurora-frontend-react-komponenter/Button';
import InfoDialog from 'components/InfoDialog';
import Spinner from 'components/Spinner';

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
    return <ActionButton onClick={onClose}>Ja</ActionButton>;
  };

  const renderOpenDialogButton = (open: () => void) => {
    return (
      <Button buttonType="primary" onClick={open} disabled={!canUpgrade}>
        {isRedeploying ? <Spinner /> : 'Oppgrader'}
      </Button>
    );
  };

  return (
    <InfoDialog
      title="Vil du oppgradere?"
      renderOpenDialogButton={renderOpenDialogButton}
      renderFooterButtons={renderFooterButtons}
    >
      <p>
        Fra <strong> {previousVersion}</strong> til{' '}
        <strong>{newVersion}</strong>{' '}
      </p>
    </InfoDialog>
  );
};

export default styled(UpgradeVersionDialog)`
  p.bold {
    font-weight: bold;
  }
`;
