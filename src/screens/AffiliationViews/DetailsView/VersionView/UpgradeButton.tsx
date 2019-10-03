import * as React from 'react';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import MessageBar from 'aurora-frontend-react-komponenter/MessageBar';

import InfoDialog from 'components/InfoDialog';
import Spinner from 'components/Spinner';
import styled from 'styled-components';
import { ITag } from 'models/Tag';

interface IUpgradeButtonProps {
  previousVersion: string;
  tag: ITag;
  selectedTag?: ITag;
  isRedeploying: boolean;
  hasPermissionToUpgrade: boolean;
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
  
  const renderOpenDialogButton = (open: () => void) => {
    const isSelectedVersion =
    JSON.stringify(selectedTag) === JSON.stringify(tag) ||
    (previousVersion === tag.name && !selectedTag);

    return (
      <>
        {isRedeploying && isSelectedVersion ? (
          <Spinner />
        ) : (
          <ActionButton
            buttonType="primary"
            icon="Deploy"
            onClick={open}
            disabled={isRedeploying || !hasPermissionToUpgrade}
          >
            Deploy
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
        {!tag.lastModified && (
          <MessageBar style={{ maxWidth: '600px' }}>
            Dette ser ut til å være en eldre versjon som har et metadata format
            vi ikke støtter. Trenger du denne versjonen ta kontakt med Aurora så
            kan vi oppgradere den manuelt for deg.
          </MessageBar>
        )}
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
