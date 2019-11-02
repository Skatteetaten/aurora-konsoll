import React, { useState, useEffect } from 'react';
import { RedeployRow } from '../../components/RedeployRow';
import { VersionTableContainer } from '../VersionTable/VersionTableContainer';
import {
  IRedeployRowAndVersionTableProps,
  IRedeployRowAndVersionTableState
} from './RedeployRowAndVersionTable.state';

type Props = IRedeployRowAndVersionTableProps &
  IRedeployRowAndVersionTableState;

export const RedeployRowAndVersionTable: React.FC<Props> = ({
  affiliation,
  applicationId,
  hasAccessToDeploy,
  versionStatus,
  configuredVersionTag,
  deployedVersion,
  repository,
  versionType,
  searchText,
  deploy,
  isDeploying
}) => {
  const [versionBeingDeploy, setVersionBeingDeploy] = useState<
    string | undefined
  >();

  const onConfirmDeploy = (version: string) => {
    if (hasAccessToDeploy) {
      deploy(applicationId, version);
      setVersionBeingDeploy(version);
    }
  };

  useEffect(() => {
    if (!isDeploying) {
      setVersionBeingDeploy(undefined);
    }
  }, [isDeploying]);

  return (
    <>
      <RedeployRow
        hasAccessToDeploy={hasAccessToDeploy}
        versionStatus={versionStatus}
        configuredVersionTag={configuredVersionTag}
        versionBeingDeployed={versionBeingDeploy}
        onConfirmDeploy={onConfirmDeploy}
      />
      <VersionTableContainer
        repository={repository}
        versionType={versionType}
        versionBeingDeployed={versionBeingDeploy}
        onConfirmDeploy={onConfirmDeploy}
        hasAccessToDeploy={hasAccessToDeploy}
        searchText={searchText}
        currentVersion={deployedVersion}
      />
    </>
  );
};
