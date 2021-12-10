import * as React from 'react';

import InfoContent from 'web/components/InfoContent';
import { IApplicationDeploymentDetails } from 'web/models/ApplicationDeployment';
import { InfoContentValues } from 'web/models/InfoContentValues';
import { getLocalDatetime } from 'web/utils/date';

interface IGitAndBuildInformationProps {
  deploymentDetails?: IApplicationDeploymentDetails;
}

export const GitAndBuildInformation = ({
  deploymentDetails,
}: IGitAndBuildInformationProps) => {
  if (
    !deploymentDetails ||
    (!exists(deploymentDetails, '/gitInfo/commitId') &&
      !deploymentDetails.buildTime)
  ) {
    return null;
  }

  const values = new InfoContentValues();
  values.addFrom(deploymentDetails, (add) => {
    add('buildTime', 'Build Time (CI)', (v) => getLocalDatetime(v));
    add('gitInfo', 'Commit Id', (git) => git.commitId);
    add(
      'gitInfo',
      'Commit Time',
      ({ commitTime }) => commitTime && getLocalDatetime(commitTime)
    );
  });
  return (
    <>
      <h3>Git og bygg informasjon</h3>
      <InfoContent infoContentValues={values} />
    </>
  );
};

function exists<T>(obj: T, path: string): boolean {
  const basePaths = path.split('/');
  const paths = path.startsWith('/') ? basePaths.splice(1) : basePaths;
  return obj && !!paths.reduce((next, p) => next && next[p], obj);
}
