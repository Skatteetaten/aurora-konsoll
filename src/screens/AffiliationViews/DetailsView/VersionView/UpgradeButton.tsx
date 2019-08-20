import * as React from 'react';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';

import InfoDialog from 'components/InfoDialog';
import Spinner from 'components/Spinner';
import styled from 'styled-components';
import { ITag } from 'models/Tag';

export interface IUpgradeButtonProps {
  previousVersion: string;
  newVersion: ITag;
  isRedeploying: boolean;
  hasPermissionToUpgrade: boolean;
  canUpgrade: (selectedTag?: ITag) => boolean;
  redeployWithVersion: (version?: ITag) => void;
  redeployWithCurrentVersion: () => void;
  handleSelectNextTag: (item?: ITag) => void;
}

const UpgradeButton = ({
  previousVersion,
  newVersion,
  isRedeploying,
  hasPermissionToUpgrade,
  redeployWithVersion,
  redeployWithCurrentVersion,
  canUpgrade
}: IUpgradeButtonProps) => {
  const renderFooterButtons = (close: () => void) => {
    const onClose = () => {
      redeployWithVersion(newVersion);
      close();
    };
    return <ActionButton onClick={onClose}>Utfør</ActionButton>;
  };

  const handleVersionChange = (newVersion: ITag) => {
    return canUpgrade(newVersion) ? 'Deploy' : 'Redeploy';
  };

  const redeployType = (open: () => void) => {
    return canUpgrade(newVersion) ? open : redeployWithCurrentVersion;
  };

  const displayTooltip = () => {
    if (!canUpgrade(newVersion) && !isRedeploying) {
      return `Versjon: ${previousVersion}`;
    }
    return '';
  };

  const renderOpenDialogButton = (open: () => void) => {
    return (
      <ActionButton
        buttonType="primary"
        onClick={redeployType(open)}
        title={displayTooltip()}
        disabled={isRedeploying || !hasPermissionToUpgrade}
      >
        {isRedeploying && newVersion.name === previousVersion ? (
          <Spinner />
        ) : (
          handleVersionChange(newVersion)
        )}
      </ActionButton>
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
          {newVersion.name}
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

export default UpgradeButton;
