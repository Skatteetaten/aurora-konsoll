import React from 'react';
import { ITag } from 'models/Tag';
import { DeployVersionType } from '../DetailsViewController';
import InfoDialog from 'components/InfoDialog';

import MessageBar from 'aurora-frontend-react-komponenter/MessageBar';
import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import styled from 'styled-components';
import Spinner from 'components/Spinner';

const { ACTIVE_DEPLOYMENT_VERSION, AURORA_CONFIG_VERSION } = DeployVersionType;

interface IRedployButton {
  tag: ITag;
  hasPermissionToUpgrade: boolean;
  isRedeploying: boolean;
  deployVersionType: DeployVersionType;
  redeployWithVersion: (version?: ITag) => void;
  redeployWithCurrentVersion: () => void;
  handleSelectNextTag: (item?: ITag) => void;
}

const RedployButton = ({
  tag,
  redeployWithCurrentVersion,
  redeployWithVersion,
  handleSelectNextTag,
  hasPermissionToUpgrade,
  isRedeploying,
  deployVersionType
}: IRedployButton) => {
  const renderFooterButtons = (close: () => void) => {
    const onClose = () => {
      handleSelectNextTag(tag);
      if (deployVersionType === ACTIVE_DEPLOYMENT_VERSION) {
        redeployWithVersion(tag);
      } else {
        redeployWithCurrentVersion();
      }
      close();
    };
    return <ActionButton onClick={onClose}>Utfør</ActionButton>;
  };

  const renderOpenDialogButton = (open: () => void) => {
    return (
      <>
        {isRedeploying ? (
          <Spinner />
        ) : (
          <>
            <ActionButton
              buttonType="primary"
              icon="Deploy"
              onClick={open}
              disabled={isRedeploying || !hasPermissionToUpgrade}
            >
              Redeploy
            </ActionButton>
          </>
        )}
      </>
    );
  };

  const renderMessageBar = (type: string) => (
    <MessageBar style={{ maxWidth: '600px' }}>
      <div>
        Det er forskjellige versjoner satt i Aurora Config og Aktivt Deployment.
      </div>
      <div>Det vil her deployes versjonen som er satt i {type}.</div>
    </MessageBar>
  );

  function handleWhenDifferentVersions() {
    switch (deployVersionType) {
      case ACTIVE_DEPLOYMENT_VERSION:
        return renderMessageBar('Aktivt Deployment');
      case AURORA_CONFIG_VERSION:
        return renderMessageBar('Aurora Config');
      default:
        return undefined;
    }
  }

  return (
    <InfoDialog
      title="Vil du deploye nåværende versjon?"
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
        {handleWhenDifferentVersions()}
        <VersionInfo>
          <p>Versjon:</p>
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
    width: 70px;
    margin: 0;
    font-weight: 400;
  }
`;

export default RedployButton;
