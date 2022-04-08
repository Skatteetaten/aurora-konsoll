import React, { useState, useEffect } from 'react';
import { RedeployRow } from '../../components/RedeployRow';
import { VersionTableContainer } from '../VersionTable/VersionTableContainer';
import {
  IRedeployRowAndVersionTableProps,
  IRedeployRowAndVersionTableState,
} from './RedeployRowAndVersionTable.state';

type Props = IRedeployRowAndVersionTableProps &
  IRedeployRowAndVersionTableState;

export const RedeployRowAndVersionTable: React.FC<Props> = ({
  applicationId,
  hasAccessToDeploy,
  versionStatus,
  configuredVersionTag,
  deployedVersion,
  versionType,
  deploy,
  isDeploying,
  releaseTo,
  isFetchingConfiguredVersionTag,
  affiliation,
  environment,
  applicationName,
  gitReference,
  isBranchDeleted,
}) => {
  const [versionBeingDeploy, setVersionBeingDeploy] = useState<
    string | undefined
  >();

  const onConfirmDeploy = (version: string, refName?: string) => {
    if (hasAccessToDeploy) {
      deploy(
        version,
        applicationId,
        affiliation,
        applicationName,
        environment,
        refName ?? 'master'
      );
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
        isFetchingConfiguredVersionTag={isFetchingConfiguredVersionTag}
        hasAccessToDeploy={hasAccessToDeploy}
        versionStatus={versionStatus}
        configuredVersionTag={configuredVersionTag}
        versionBeingDeployed={versionBeingDeploy}
        onConfirmDeploy={onConfirmDeploy}
        currentVersion={deployedVersion}
        releaseTo={releaseTo}
        gitReference={gitReference}
        isBranchDeleted={isBranchDeleted}
      />
      <VersionTableContainer
        versionType={versionType}
        versionBeingDeployed={versionBeingDeploy}
        onConfirmDeploy={onConfirmDeploy}
        hasAccessToDeploy={hasAccessToDeploy}
        currentVersion={deployedVersion}
        configuredVersionTag={configuredVersionTag}
        releaseTo={releaseTo}
        gitReference={gitReference}
        isBranchDeleted={isBranchDeleted}
      />
    </>
  );
};
