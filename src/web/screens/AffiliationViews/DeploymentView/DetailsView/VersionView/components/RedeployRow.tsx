import React from 'react';
import styled from 'styled-components';

import { Spinner } from '@skatteetaten/frontend-components/Spinner';

import { IImageTag } from 'web/services/auroraApiClients/imageRepositoryClient/query';
import { WrongVersionCallout } from './WrongVersionCallout';
import {
  VersionStatus,
  versionStatusMessage,
} from '../../models/VersionStatus';
import DeployButton from './DeployButton';
import { VersionInfo } from './VersionInfo';
import { SpinnerSize } from '@fluentui/react';
import DateWithTooltip from 'web/components/DateWithTooltip';

interface IRedeployRowProps {
  isFetchingConfiguredVersionTag: boolean;
  hasAccessToDeploy: boolean;
  versionStatus: VersionStatus;
  configuredVersionTag?: IImageTag;
  versionBeingDeployed?: string;
  currentVersion: IImageTag;
  releaseTo?: string;
  gitReference?: string;
  isBranchDeleted: boolean;
  onConfirmDeploy: (version: string, refName?: string) => void;
}

export const RedeployRow = ({
  hasAccessToDeploy,
  versionStatus,
  configuredVersionTag,
  versionBeingDeployed,
  onConfirmDeploy,
  releaseTo,
  currentVersion,
  gitReference,
  isBranchDeleted,
  isFetchingConfiguredVersionTag,
}: IRedeployRowProps) => {
  if (isFetchingConfiguredVersionTag) {
    return (
      <Wrapper>
        <Spinner size={SpinnerSize.large} style={{ margin: '0 auto' }} />
      </Wrapper>
    );
  }

  if (!configuredVersionTag) {
    return (
      <Wrapper>
        <p>
          Finner ikke konfigurert versjon. Finnes konfigurasjonsfilen for
          applikasjonen i AuroraConfig?
        </p>
      </Wrapper>
    );
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
        {configuredVersionTag.image && (
          <DateWithTooltip
            date={configuredVersionTag.image.buildTime}
            position="bottom"
          />
        )}
        )
      </span>
      <DeployButton
        isLoading={isLoading}
        disabled={versionBeingDeployed !== undefined}
        buttonText="Redeploy"
        dialogTitle="Vil du gjøre en redeploy?"
        isOldVersion={!configuredVersionTag.image}
        hasAccessToDeploy={hasAccessToDeploy}
        currentVersion={currentVersion}
        onConfirmDeploy={(refName?: string) =>
          onConfirmDeploy(configuredVersionTag.name, refName)
        }
        releaseTo={releaseTo}
        gitReference={gitReference}
        isBranchDeleted={isBranchDeleted}
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
  padding: 14px 7px;

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
