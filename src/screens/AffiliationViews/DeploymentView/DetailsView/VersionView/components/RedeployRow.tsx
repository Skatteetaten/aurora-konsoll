import React from 'react';
import styled from 'styled-components';

import Spinner from '@skatteetaten/frontend-components/Spinner';

import { IImageTag } from 'services/auroraApiClients/imageRepositoryClient/query';
import { WrongVersionCallout } from './WrongVersionCallout';
import {
  VersionStatus,
  versionStatusMessage,
} from '../../models/VersionStatus';
import { DeployButton } from './DeployButton';
import { VersionInfo } from './VersionInfo';
import { SpinnerSize } from 'office-ui-fabric-react/lib-commonjs';
import DateDisplay from 'components/DateDisplay';

interface IRedeployRowProps {
  isFetchingConfiguredVersionTag: boolean;
  hasAccessToDeploy: boolean;
  versionStatus: VersionStatus;
  configuredVersionTag?: IImageTag;
  versionBeingDeployed?: string;
  currentVersion: IImageTag;
  releaseTo?: string;
  onConfirmDeploy: (version: string) => void;
}

export const RedeployRow = ({
  hasAccessToDeploy,
  versionStatus,
  configuredVersionTag,
  versionBeingDeployed,
  onConfirmDeploy,
  releaseTo,
  currentVersion,
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
      <div>
        Konfigurert versjon: <strong>{configuredVersionTag.name}</strong>{' '}
        (bygget{' '}
        {configuredVersionTag.image && (
          <DateDisplay
            date={configuredVersionTag.image.buildTime}
            position="bottom"
          />
        )}
        )
      </div>
      <DeployButton
        isLoading={isLoading}
        disabled={versionBeingDeployed !== undefined}
        buttonText="Redeploy"
        dialogTitle="Vil du gjøre en redeploy?"
        isOldVersion={!configuredVersionTag.image}
        hasAccessToDeploy={hasAccessToDeploy}
        currentVersion={currentVersion}
        onConfirmDeploy={() => onConfirmDeploy(configuredVersionTag.name)}
        releaseTo={releaseTo}
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
