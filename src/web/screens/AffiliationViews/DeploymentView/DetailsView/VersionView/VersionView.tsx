import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { ImageTagType } from 'web/models/ImageTagType';
import { Search } from './containers/Search/Search';
import { PermissionToUpgradeInformation } from './components/PermissionToUpgradeInformation';
import { VersionViewProps } from './VersionView.state';
import { RedeployRowAndVersionTableContainer } from './containers/RedeployRowAndVersionTable/RedeployRowAndVersionTableContainer';
import { BranchInformation } from './components/MissingGitBranchInformation';
import { VersionTypeSelector } from './containers/VersionTypeSelector/VersionTypeSelector';
import { Spinner } from '@skatteetaten/frontend-components/Spinner';

export const VersionView = ({
  versionStatus,
  deployment,
  imageTagsConnection,
  deploymentSpecVersion,
  configuredVersionTag,
  fetchVersion,
  isBranchDeleted,
  isFetching,
  applicationDeploymentCommand,
}: VersionViewProps) => {
  const { id, version, imageRepository } = deployment;

  const [searchText, setSearchText] = useState<string>('');
  const [versionType, setVersionType] = useState(ImageTagType.MAJOR);

  const versions = useMemo(
    () =>
      versionType === ImageTagType.SEARCH
        ? imageTagsConnection.search(searchText)
        : imageTagsConnection.getVersionsOfType(versionType),
    [versionType, searchText, imageTagsConnection]
  );

  useEffect(() => {
    if (imageRepository && deploymentSpecVersion) {
      fetchVersion(imageRepository.repository, deploymentSpecVersion);
    }
  }, [deploymentSpecVersion, fetchVersion, imageRepository]);

  const initVersionType =
    configuredVersionTag && version.releaseTo
      ? configuredVersionTag.type
      : version.deployTag.type;

  useEffect(() => setVersionType(initVersionType), [initVersionType]);

  if (isFetching) return <Spinner />;

  if (!imageRepository) {
    // TODO: Bedre feilmelding
    return <p>Mangler repository</p>;
  }

  const hasAccessToDeploy = deployment.permission.paas.admin;

  return (
    <Wrapper>
      {!hasAccessToDeploy && <PermissionToUpgradeInformation />}
      <ActionBar>
        <VersionTypeSelector
          totalCountMap={imageTagsConnection.getCountMap()}
          versionType={versionType}
          onSelect={setVersionType}
        />
        <Search
          setTypeToSearch={() => setVersionType(ImageTagType.SEARCH)}
          handleSetSearchText={setSearchText}
        />
      </ActionBar>
      <BranchInformation
        gitReference={applicationDeploymentCommand.auroraConfig.gitReference}
        isBranchDeleted={isBranchDeleted}
      />
      <RedeployRowAndVersionTableContainer
        applicationId={id}
        deployedVersion={version.deployTag}
        hasAccessToDeploy={hasAccessToDeploy}
        versionStatus={versionStatus}
        versionType={versionType}
        releaseTo={deployment.version.releaseTo}
        affiliation={deployment.affiliation}
        applicationDeploymentCommand={applicationDeploymentCommand}
        isBranchDeleted={isBranchDeleted}
        versions={versions}
        searchText={searchText}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0 16px;
`;

const ActionBar = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
`;
