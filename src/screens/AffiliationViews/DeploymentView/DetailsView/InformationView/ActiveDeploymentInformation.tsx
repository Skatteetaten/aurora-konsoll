import * as React from 'react';

import InfoContent from 'components/InfoContent';
import { InfoContentValues } from 'models/InfoContentValues';
import { DifferentVersionTooltip } from './DifferentVersionTooltip';
import { IImageRepository } from 'services/auroraApiClients/applicationDeploymentClient/query';
import { VersionStatus } from '../models/VersionStatus';
import { ApplicationDeployment } from 'models/immer/ApplicationDeployment';

interface IActiveDeploymentInformationProps {
  versionStatus: VersionStatus;
  deployment: ApplicationDeployment;
}

export const ActiveDeploymentInformation = ({
  versionStatus,
  deployment
}: IActiveDeploymentInformationProps) => {
  const values = new InfoContentValues();

  const tooltip = (tag: string) =>
    DifferentVersionTooltip({
      versionStatus,
      deploymentTag: tag
    });

  const removeFirstPath = (path: string): string =>
    path
      .split('/')
      .slice(1)
      .join('/');

  values.addFrom(deployment, add => {
    add('version', 'Tag', v => tooltip(v.deployTag.name));
    add('version', 'Aurora version', version => version.auroraVersion);
    add('message', 'Message');
  });

  values.addFrom(deployment, add => {
    const getImageRepository = (repo: IImageRepository) => {
      const isTypeDeploy =
        deployment.details.deploymentSpec &&
        deployment.details.deploymentSpec.type === 'deploy';

      if (!isTypeDeploy || !repo.isFullyQualified) {
        return removeFirstPath(repo.repository);
      }
      return {
        value: removeFirstPath(repo.repository),
        link: `${repo.guiUrl}${deployment.version.deployTag.name}`
      };
    };
    add('imageRepository', 'Image repository', getImageRepository);
  });

  values.addFrom(deployment.details, add => {
    add('updatedBy', 'Oppdatert av');
  });

  return (
    <>
      <h3>Aktivt deployment</h3>
      <InfoContent id="active-deployment" infoContentValues={values} />
    </>
  );
};
