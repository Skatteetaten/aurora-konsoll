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

  let isConfiguredVersion = true;

  let deployableVersion: IImageTag | undefined = configuredVersionTag;

  if (isBranchDeleted && !configuredVersionTag) {
    deployableVersion = currentVersion;
    isConfiguredVersion = false;
  }

  if (deployableVersion === undefined) {
    return (
      <Wrapper>
        <p>
          Finner ikke konfigurert versjon. Finnes konfigurasjonsfilen for
          applikasjonen i AuroraConfig?
        </p>
      </Wrapper>
    );
  }

  const handleOnConfirmDeploy = (version: string) => (refName?: string) => {
    onConfirmDeploy(version, refName);
  };

  const isLoading = versionBeingDeployed === deployableVersion.name;

  const versionType = isConfiguredVersion ? 'Konfigurert' : 'Deployet';

  return (
    <Wrapper>
      {versionStatus !== VersionStatus.OK && (
        <WrongVersionCallout>
          <h4>Til informasjon</h4>
          <span>{versionStatusMessage(versionStatus)}</span>
        </WrongVersionCallout>
      )}
      <span>
        {versionType} versjon: <strong>{deployableVersion.name}</strong>
        {deployableVersion.image && (
          <>
            {' '}
            (bygget{' '}
            <DateWithTooltip
              date={deployableVersion.image.buildTime}
              position="bottom"
            />
            )
          </>
        )}
      </span>
      <DeployButton
        isLoading={isLoading}
        disabled={versionBeingDeployed !== undefined}
        buttonText="Redeploy"
        dialogTitle="Vil du gjøre en redeploy?"
        isOldVersion={!deployableVersion.image}
        hasAccessToDeploy={hasAccessToDeploy}
        currentVersion={currentVersion}
        onConfirmDeploy={handleOnConfirmDeploy(deployableVersion.name)}
        releaseTo={releaseTo}
        gitReference={gitReference}
        isBranchDeleted={isBranchDeleted}
      >
        <VersionInfo>
          <p>Versjon:</p> {deployableVersion.name}
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
