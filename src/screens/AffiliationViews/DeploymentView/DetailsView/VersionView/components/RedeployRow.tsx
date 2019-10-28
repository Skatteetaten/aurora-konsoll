import React from 'react';
import styled from 'styled-components';

import { IImageTag } from 'services/auroraApiClients/imageRepositoryClient/query';
import { DeployButtonContainer } from '../containers/DeployButton/DeployButtonContainer';
import { ITag } from 'models/Tag';
import { WrongVersionCallout } from './WrongVersionCallout';
import { getLocalDatetime } from 'utils/date';
import {
  VersionStatus,
  versionStatusMessage
} from '../../models/VersionStatus';

interface IRedeployRowProps {
  versionStatus: VersionStatus;
  affiliation: string;
  applicationId: string;
  hasAccessToDeploy: boolean;
  activeVersion?: ITag;
  version?: IImageTag;
}

export const RedeployRow = ({
  versionStatus,
  version,
  affiliation,
  hasAccessToDeploy,
  applicationId
}: IRedeployRowProps) => {
  if (!version) {
    return null;
  }

  return (
    <Wrapper>
      {versionStatus !== VersionStatus.OK && (
        <WrongVersionCallout>
          <h4>Til informasjon</h4>
          <span>{versionStatusMessage(versionStatus)}</span>
        </WrongVersionCallout>
      )}
      <span>
        Konfigurert versjon: <strong>{version.name}</strong> (bygget{' '}
        {version.image && getLocalDatetime(version.image.buildTime)})
      </span>
      <DeployButtonContainer
        affiliation={affiliation}
        applicationId={applicationId}
        hasAccessToDeploy={hasAccessToDeploy}
        currentVersion={version}
        nextVersion={version}
      />
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
