import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { ImageTagType } from 'models/ImageTagType';

import { VersionTableContainer } from './containers/VersionTable/VersionTableContainer';
import { VersionTypeSelectorContainer } from './containers/VersionTypeSelector/VersionTypeSelectorContainer';
import { VersionTableInformation } from './components/VersionTableInformation';
import { ServerSideSearchContainer } from './containers/ServerSideSearch/ServerSideSearchContainer';
import { PermissionToUpgradeInformation } from './components/PermissionToUpgradeInformation';
import { FetchMoreVersionsContainer } from './containers/FetchMoreVersions/FetchMoreVersionsContainer';
import { VersionViewProps } from './VersionView.state';
import { RedeployRow } from './components/RedeployRow';

export const VersionView = ({
  affiliation,
  deployment,
  imageTagsConnection,
  tag
}: VersionViewProps) => {
  const { id, version, imageRepository } = deployment;

  const [searchText, setSearchText] = useState<string | undefined>();
  const [versionType, setVersionType] = useState(imageTagsConnection.getType());

  useEffect(() => {
    setVersionType(version.deployTag.type);
  }, [version.deployTag.type]);

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

  const hasAccessToDeploy = deployment.permission.paas.admin;

  return (
    <Wrapper>
      {!hasAccessToDeploy && <PermissionToUpgradeInformation />}
      <ActionBar>
        <VersionTypeSelectorContainer
          versionType={versionType}
          onSelect={onSelectType}
        />
        <ServerSideSearchContainer
          searchText={searchText}
          handleSelectVersionType={setVersionType}
          handleSetSearchText={setSearchText}
          repository={imageRepository.repository}
          selectedVersionType={versionType}
        />
      </ActionBar>
      <VersionTableInformation />
      <RedeployRow
        affiliation={affiliation}
        applicationId={id}
        hasAccessToDeploy={hasAccessToDeploy}
        activeVersion={version.deployTag}
        version={tag}
      />
      <VersionTableContainer
        hasAccessToDeploy={hasAccessToDeploy}
        affiliation={affiliation}
        searchText={searchText}
        currentVersion={version.deployTag}
        applicationId={id}
        repository={imageRepository.repository}
        versionType={versionType}
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
