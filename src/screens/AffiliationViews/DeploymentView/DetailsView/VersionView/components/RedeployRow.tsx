import React from 'react';
import styled from 'styled-components';

import { IImageTag } from 'services/auroraApiClients/imageRepositoryClient/query';
import { WrongVersionCallout } from './WrongVersionCallout';
import { getLocalDatetime } from 'utils/date';
import {
  VersionStatus,
  versionStatusMessage
} from '../../models/VersionStatus';
import { DeployButton } from './DeployButton';
import { VersionInfo } from './VersionInfo';

interface IRedeployRowProps {
  hasAccessToDeploy: boolean;
  versionStatus: VersionStatus;
  configuredVersionTag?: IImageTag;
  versionBeingDeployed?: string;
  onConfirmDeploy: (version: string) => void;
}

export const RedeployRow = ({
  hasAccessToDeploy,
  versionStatus,
  configuredVersionTag,
  versionBeingDeployed,
  onConfirmDeploy
}: IRedeployRowProps) => {
  if (!configuredVersionTag) {
    return null;
  }

  const isLoading =
    versionBeingDeployed ===
    (configuredVersionTag && configuredVersionTag.name);

  return (
    <Wrapper>
      {versionStatus !== VersionStatus.OK && (
        <WrongVersionCallout>
          <h4>Til informasjon</h4>
          <span>{versionStatusMessage(versionStatus)}</span>
        </WrongVersionCallout>
      )}
      <span>
        Konfigurert versjon: <strong>{configuredVersionTag.name}</strong>{' '}
        (bygget{' '}
        {configuredVersionTag.image &&
          getLocalDatetime(configuredVersionTag.image.buildTime)}
        )
      </span>
      <DeployButton
        isLoading={isLoading}
        buttonText="Redeploy"
        dialogTitle="Vil du gjøre en redeploy?"
        isOldVersion={!configuredVersionTag.image}
        hasAccessToDeploy={hasAccessToDeploy}
        onConfirmDeploy={() => onConfirmDeploy(configuredVersionTag.name)}
      >
        <VersionInfo>
          <p>Versjon:</p> {configuredVersionTag.name}
        </VersionInfo>
      </DeployButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  background: rgb(249, 237, 226);
  padding: 8px 7px;

  button {
    margin-right: 5px;
  }

  h4 {
    margin: 0;
  }
  p {
    margin: 0;
  }
`;
