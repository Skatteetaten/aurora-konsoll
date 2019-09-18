import * as React from 'react';

import InfoContent from 'components/InfoContent';
import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import { IDeploymentSpec } from 'models/DeploymentSpec';
import { InfoContentValues } from 'models/InfoContentValues';
import { IPodResource } from 'models/Pod';
import { DifferentVersionTooltip } from './DifferentVersionTooltip';

interface IActiveDeploymentInformationProps {
  pods: IPodResource[];
  deploymentSpec?: IDeploymentSpec;
  deployment: IApplicationDeployment;
  deploymentDetails: IApplicationDeploymentDetails;
}

export const ActiveDeploymentInformation = ({
  deployment,
  deploymentDetails,
  pods,
  deploymentSpec
}: IActiveDeploymentInformationProps) => {
  const values = new InfoContentValues();

  const tooltip = (tag: string) =>
    DifferentVersionTooltip({
      deploymentSpec,
      deploymentTag: tag,
      pods
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
        ? (repo: string) => ({
            value: removeFirstPath(repo),
            link: `/api/docker-registry/${removeFirstPath(repo)}/${
              deployment.version.deployTag.name
            }`
          })
        : (repo: string) => removeFirstPath(repo);
    add('repository', 'Image repository', getImageRepository);
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
