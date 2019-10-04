import React, { useState } from 'react';

import { ImageTagType } from 'models/ImageTagType';

import { VersionTableContainer } from './containers/VersionTable/VersionTableContainer';
import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { VersionTypeSelectorContainer } from './containers/VersionTypeSelector/VersionTypeSelectorContainer';
import { DeployResultMessageContainer } from './containers/DeployResultMessageContainer';
import { VersionTableInformation } from './components/VersionTableInformation';
import { FetchVersionsInformation } from './components/FetchVersionsInformation';

interface IVersionViewProps {
  deployment: IApplicationDeployment;
}

export const VersionView = ({ deployment }: IVersionViewProps) => {
  const [versionType, setVersionType] = useState(ImageTagType.MAJOR);

  if (!deployment.imageRepository) {
    return <p>Mangler repository</p>;
  }

  const onSelectType = (type: ImageTagType) => setVersionType(type);

  return (
    <>
      <VersionTypeSelectorContainer
        versionType={versionType}
        onSelect={onSelectType}
      />
      <DeployResultMessageContainer />
      <VersionTableInformation />
      <VersionTableContainer
        applicationId={deployment.id}
        repository={deployment.imageRepository.repository}
        versionType={versionType}
      />
      <FetchVersionsInformation />
    </>
  );
};
