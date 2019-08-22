import * as React from 'react';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';

import InfoDialog from 'components/InfoDialog';
import Spinner from 'components/Spinner';
import styled from 'styled-components';
import { ITag } from 'models/Tag';

export interface IUpgradeButtonProps {
  previousVersion: string;
  tag: ITag;
  selectedTag?: ITag;
  isRedeploying: boolean;
  hasPermissionToUpgrade: boolean;
  canUpgrade: (selectedTag?: ITag) => boolean;
  redeployWithVersion: (version?: ITag) => void;
  redeployWithCurrentVersion: () => void;
  handleSelectNextTag: (item?: ITag) => void;
}

const UpgradeButton = ({
  previousVersion,
  tag,
  isRedeploying,
  hasPermissionToUpgrade,
  redeployWithVersion,
  redeployWithCurrentVersion,
  canUpgrade,
  handleSelectNextTag,
  selectedTag
}: IUpgradeButtonProps) => {
  const renderFooterButtons = (close: () => void) => {
    const onClose = () => {
      handleSelectNextTag(tag);
      redeployWithVersion(tag);
      close();
    };
    return <ActionButton onClick={onClose}>Utfør</ActionButton>;
  };

  const handleVersionChange = (tags: ITag) => {
    return canUpgrade(tags) || isRedeploying ? 'Deploy' : 'Redeploy';
  };

  const redeployType = (open: () => void) => {
    return canUpgrade(tag) ? open : redeployWithCurrentVersion;
  };

  const displayTooltip = () => {
    if (!canUpgrade(tag) && !isRedeploying) {
      return `Versjon: ${previousVersion}`;
    }
    return '';
  };

  const renderOpenDialogButton = (open: () => void) => {
    return (
      <>
        {isRedeploying &&
        JSON.stringify(selectedTag) === JSON.stringify(tag) ? (
          <Spinner />
        ) : (
          <ActionButton
            buttonType="primary"
            onClick={redeployType(open)}
            title={displayTooltip()}
            disabled={isRedeploying || !hasPermissionToUpgrade}
          >
            {handleVersionChange(tag)}
          </ActionButton>
        )}
      </>
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
          {tag.name}
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