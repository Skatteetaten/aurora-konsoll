import * as React from 'react';

import InfoContent from 'components/InfoContent';
import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { IDeploymentSpec } from 'models/DeploymentSpec';
import { InfoContentValues } from 'models/InfoContentValues';
import { IPodResource } from 'models/Pod';
import { DifferentVersionTooltip } from './DifferentVersionTooltip';

interface IActiveDeploymentInformationProps {
  pods: IPodResource[];
  deploymentSpec?: IDeploymentSpec;
  deployment: IApplicationDeployment;
}

export const ActiveDeploymentInformation = ({
  deployment,
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
    add('repository', 'Image repository', repo => removeFirstPath(repo));
    add('message', 'Message');
  });

  return (
    <>
      <h3>Aktivt deployment</h3>
      <InfoContent id="active-deployment" infoContentValues={values} />
    </>
  );
};
