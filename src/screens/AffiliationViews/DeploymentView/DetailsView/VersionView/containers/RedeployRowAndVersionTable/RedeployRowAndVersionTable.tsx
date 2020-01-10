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
  applicationId,
  hasAccessToDeploy,
  versionStatus,
  configuredVersionTag,
  deployedVersion,
  repository,
  versionType,
  deploy,
  isDeploying,
  deploymentSpecVersion,
  fetchVersion,
  releaseTo
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

  useEffect(() => {
    if (deploymentSpecVersion) {
      fetchVersion(repository, deploymentSpecVersion);
    }
  }, [deploymentSpecVersion, fetchVersion, repository]);

  return (
    <>
      <RedeployRow
        hasAccessToDeploy={hasAccessToDeploy}
        versionStatus={versionStatus}
        configuredVersionTag={configuredVersionTag}
        versionBeingDeployed={versionBeingDeploy}
        onConfirmDeploy={onConfirmDeploy}
        currentVersion={deployedVersion}
        releaseTo={releaseTo}
      />
      <VersionTableContainer
        versionType={versionType}
        versionBeingDeployed={versionBeingDeploy}
        onConfirmDeploy={onConfirmDeploy}
        hasAccessToDeploy={hasAccessToDeploy}
        currentVersion={deployedVersion}
        configuredVersionTag={configuredVersionTag}
        releaseTo={releaseTo}
      />
    </>
  );
};
