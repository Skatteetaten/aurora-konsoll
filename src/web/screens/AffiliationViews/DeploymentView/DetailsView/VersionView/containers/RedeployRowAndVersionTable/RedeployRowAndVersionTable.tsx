import React, { useEffect, useState } from 'react';
import { RedeployRow } from '../../components/RedeployRow';
import {
  IRedeployRowAndVersionTableProps,
  IRedeployRowAndVersionTableState,
} from './RedeployRowAndVersionTable.state';
import { VersionTable } from '../VersionTable/VersionTable';

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
  imageTags,
  searchText,
}) => {
  const [versionBeingDeployed, setVersionBeingDeployed] = useState<
    string | undefined
  >();

  const onConfirmDeploy = (version: string) => {
    if (hasAccessToDeploy) {
      deploy(version, applicationId, affiliation);
      setVersionBeingDeployed(version);
    }
  };

  useEffect(() => {
    if (!isDeploying) {
      setVersionBeingDeployed(undefined);
    }
  }, [isDeploying]);

  return (
    <>
      <RedeployRow
        isFetchingConfiguredVersionTag={isFetchingConfiguredVersionTag}
        hasAccessToDeploy={hasAccessToDeploy}
        versionStatus={versionStatus}
        configuredVersionTag={configuredVersionTag}
        versionBeingDeployed={versionBeingDeployed}
        onConfirmDeploy={onConfirmDeploy}
        currentVersion={deployedVersion}
        releaseTo={releaseTo}
      />
      <VersionTable
        versionType={versionType}
        versionBeingDeployed={versionBeingDeployed}
        onConfirmDeploy={onConfirmDeploy}
        hasAccessToDeploy={hasAccessToDeploy}
        currentVersion={deployedVersion}
        configuredVersionTag={configuredVersionTag}
        releaseTo={releaseTo}
        imageTags={imageTags}
        searchText={searchText}
      />
    </>
  );
};
