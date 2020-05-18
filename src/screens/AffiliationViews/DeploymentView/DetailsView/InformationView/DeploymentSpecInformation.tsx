import * as React from 'react';

import InfoContent from 'components/InfoContent';
import { IDeploymentSpec } from 'models/DeploymentSpec';
import { InfoContentValues } from 'models/InfoContentValues';

interface IDeploymentSpecInformationProps {
  deploymentSpec?: IDeploymentSpec;
}

export const DeploymentSpecInformation = ({
  deploymentSpec,
}: IDeploymentSpecInformationProps) => {
  if (!deploymentSpec) {
    return null;
  }

  const values = new InfoContentValues();
  const { type } = deploymentSpec;
  values.addFrom(deploymentSpec, (add) => {
    add('type', 'Type');
    if (['development', 'deploy'].indexOf(type) !== -1) {
      add('groupId', 'GroupId');
      add('artifactId', 'ArtifactId');
    }
    add('version', 'Version');
    add('releaseTo', 'ReleaseTo');
    add('database', 'Database', (db) => db && 'Ja');
    add('certificate', 'Sertifikat', (cert) => cert && 'Ja');
    add('management', 'Management', (v) => `Path: ${v.path} | Port: ${v.port}`);
  });

  return (
    <>
      <h3>Gjeldende AuroraConfig</h3>
      <InfoContent infoContentValues={values} />
    </>
  );
};
