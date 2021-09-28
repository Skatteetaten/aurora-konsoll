import React, { useState, useEffect } from 'react';
import { AuroraConfigFileResource } from 'services/auroraApiClients/applicationDeploymentClient/query';
import { RedeployRow } from '../../components/RedeployRow';
import { VersionTableContainer } from '../VersionTable/VersionTableContainer';
import {
  IRedeployRowAndVersionTableProps,
  IRedeployRowAndVersionTableState,
} from './RedeployRowAndVersionTable.state';
import YAML from 'yaml';

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
  addCurrentErrors,
  isDeploying,
  releaseTo,
  isFetchingConfiguredVersionTag,
  auroraConfigFiles,
  affiliation,
}) => {
  const [versionBeingDeploy, setVersionBeingDeploy] =
    useState<string | undefined>();

  function changeVersionInFile(
    fileName: string,
    fileContent: string,
    version: string
  ) {
    if (fileName.endsWith('json')) {
      const parsedApplicationFile: JSON = JSON.parse(fileContent);
      return JSON.stringify(
        { ...parsedApplicationFile, version: version },
        null,
        2
      );
    }
    try {
      const parsedApplicationFile = YAML.parseDocument(fileContent);
      parsedApplicationFile.set('version', version);
      return parsedApplicationFile.toString();
    } catch {
      addCurrentErrors({
        errors: [
          new Error(
            `Could not parse the content of the application file. Make sure the file is of type yaml or json and does not contain syntax errors`
          ),
        ],
        name: 'Parsing error',
      });
      return;
    }
  }

  const onConfirmDeploy = (version: string) => {
    const applicationFile: AuroraConfigFileResource | undefined =
      auroraConfigFiles.find((it) => it.type === 'APP');

    if (!applicationFile) {
      addCurrentErrors({
        errors: [new Error(`An Application must have an application file`)],
        name: 'Missing application file',
      });
      return;
    }

    const changedFile = changeVersionInFile(
      applicationFile.name,
      applicationFile.contents,
      version
    );

    if (changedFile && hasAccessToDeploy) {
      deploy(
        {
          auroraConfigName: affiliation,
          contents: changedFile,
          existingHash: applicationFile.contentHash,
          fileName: applicationFile.name,
        },
        applicationId
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
