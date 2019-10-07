import React, { useState } from 'react';

import { ImageTagType } from 'models/ImageTagType';

import { VersionTableContainer } from './containers/VersionTable/VersionTableContainer';
import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { VersionTypeSelectorContainer } from './containers/VersionTypeSelector/VersionTypeSelectorContainer';
import { DeployResultMessageContainer } from './containers/DeployResultMessageContainer';
import { VersionTableInformation } from './components/VersionTableInformation';
import { FetchVersionsInformation } from './components/FetchVersionsInformation';
import { ServerSideSearchContainer } from './containers/ServerSideSearch/ServerSideSearchContainer';
import styled from 'styled-components';

interface IVersionViewProps {
  deployment: IApplicationDeployment;
}

export const VersionView = ({ deployment }: IVersionViewProps) => {
  const { id, version, imageRepository } = deployment;

  const [searchText, setSearchText] = useState<string | undefined>();
  const [versionType, setVersionType] = useState(version.deployTag.type);

  if (!imageRepository) {
    return <p>Mangler repository</p>;
  }

  const onSelectType = (type: ImageTagType) => {
    setVersionType(type);
    if (type !== ImageTagType.SEARCH) {
      setSearchText(undefined);
    }
  };

  return (
    <Wrapper>
      <ActionBar>
        <VersionTypeSelectorContainer
          versionType={versionType}
          onSelect={onSelectType}
        />
        <ServerSideSearchContainer
          isFetchingTags={false}
          searchText={searchText}
          handleSelectVersionType={setVersionType}
          handleSetSearchText={setSearchText}
          repository={imageRepository.repository}
          selectedVersionType={versionType}
        />
      </ActionBar>
      <DeployResultMessageContainer />
      <VersionTableInformation />
      <VersionTableContainer
        searchText={searchText}
        currentVersion={version.deployTag.name}
        applicationId={id}
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
