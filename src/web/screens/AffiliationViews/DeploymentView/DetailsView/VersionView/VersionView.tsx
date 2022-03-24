import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { ImageTagType } from 'web/models/ImageTagType';

import { VersionTypeSelectorContainer } from './containers/VersionTypeSelector/VersionTypeSelectorContainer';
import { VersionTableInformation } from './components/VersionTableInformation';
import { ServerSideSearchContainer } from './containers/ServerSideSearch/ServerSideSearchContainer';
import { PermissionToUpgradeInformation } from './components/PermissionToUpgradeInformation';
import { FetchMoreVersionsContainer } from './containers/FetchMoreVersions/FetchMoreVersionsContainer';
import { VersionViewProps } from './VersionView.state';
import { RedeployRowAndVersionTableContainer } from './containers/RedeployRowAndVersionTable/RedeployRowAndVersionTableContainer';
import { InvalidRefInformation } from './components/MissingGitBranchInformation';

export const VersionView = ({
  versionStatus,
  deployment,
  imageTagsConnection,
  deploymentSpecVersion,
  configuredVersionTag,
  fetchVersion,
  deploymentErrors,
  gitReference,
}: VersionViewProps) => {
  const { id, version, imageRepository } = deployment;

  const [searchText, setSearchText] = useState<string | undefined>();
  const [versionType, setVersionType] = useState(imageTagsConnection.getType());

  useEffect(() => {
    if (imageRepository) {
      if (deploymentSpecVersion) {
        fetchVersion(imageRepository.repository, deploymentSpecVersion);
      }
    }
  }, [deploymentSpecVersion, fetchVersion, imageRepository]);

  const initVersionType =
    configuredVersionTag && version.releaseTo
      ? configuredVersionTag.type
      : version.deployTag.type;

  useEffect(() => {
    setVersionType(initVersionType);
  }, [initVersionType]);

  if (!imageRepository) {
    // TODO: Bedre feilmelding
    return <p>Mangler repository</p>;
  }

  const onSelectType = (type: ImageTagType) => {
    setVersionType(type);
    if (type !== ImageTagType.SEARCH) {
      setSearchText(undefined);
    }
  };

  const invalidRef =
    !!deploymentErrors &&
    deploymentErrors.some((it) =>
      it.message.includes('No git reference with refName')
    );

  const userIsAdmin = deployment.permission.paas.admin;

  const hasAccessToDeploy = userIsAdmin && !invalidRef;

  return (
    <Wrapper>
      {invalidRef && <InvalidRefInformation refName={gitReference} />}
      {!userIsAdmin && <PermissionToUpgradeInformation />}
      <ActionBar>
        <VersionTypeSelectorContainer
          versionType={versionType}
          onSelect={onSelectType}
        />
        <ServerSideSearchContainer
          handleSelectVersionType={setVersionType}
          handleSetSearchText={setSearchText}
          repository={imageRepository.repository}
          selectedVersionType={versionType}
        />
      </ActionBar>
      <VersionTableInformation />
      <RedeployRowAndVersionTableContainer
        applicationId={id}
        deployedVersion={version.deployTag}
        hasAccessToDeploy={hasAccessToDeploy}
        versionStatus={versionStatus}
        versionType={versionType}
        releaseTo={deployment.version.releaseTo}
        affiliation={deployment.affiliation}
      />
      <FetchMoreVersionsContainer
        searchText={searchText}
        repository={imageRepository.repository}
        versionType={versionType}
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
