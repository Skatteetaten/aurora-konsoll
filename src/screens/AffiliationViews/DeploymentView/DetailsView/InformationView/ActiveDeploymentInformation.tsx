import * as React from 'react';

import InfoContent from 'components/InfoContent';
import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import { IDeploymentSpec } from 'models/DeploymentSpec';
import { InfoContentValues } from 'models/InfoContentValues';
import { DifferentVersionTooltip } from './DifferentVersionTooltip';
import { IImageRepository } from 'services/auroraApiClients/applicationDeploymentClient/query';
import { VersionStatus } from '../models/VersionStatus';

interface IActiveDeploymentInformationProps {
  versionStatus: VersionStatus;
  deploymentSpec?: IDeploymentSpec;
  deployment: IApplicationDeployment;
  deploymentDetails: IApplicationDeploymentDetails;
}

export const ActiveDeploymentInformation = ({
  versionStatus,
  deployment,
  deploymentDetails,
  deploymentSpec
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
    const getImageRepository =
      deploymentSpec && deploymentSpec.type === 'deploy'
        ? (repo: IImageRepository) => ({
            value: removeFirstPath(repo.repository),
            link: `${repo.guiUrl}${deployment.version.deployTag.name}`
          })
        : (repo: IImageRepository) => removeFirstPath(repo.repository);
    add('imageRepository', 'Image repository', getImageRepository);
  });

  values.addFrom(deploymentDetails, add => {
    add('updatedBy', 'Oppdatert av');
  });

  return (
    <>
      <h3>Aktivt deployment</h3>
      <InfoContent id="active-deployment" infoContentValues={values} />
    </>
  );
};
