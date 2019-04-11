import * as React from 'react';

import InfoContent from 'components/InfoContent';
import { IApplicationDeploymentDetails } from 'models/ApplicationDeployment';
import { InfoContentValues } from 'models/InfoContentValues';
import { getLocalDatetime } from 'utils/date';

interface IGitAndBuildInformationProps {
  deploymentDetails?: IApplicationDeploymentDetails;
}

export const GitAndBuildInformation = ({
  deploymentDetails
}: IGitAndBuildInformationProps) => {
  if (
    !deploymentDetails ||
    !(deploymentDetails.buildTime && deploymentDetails.gitInfo)
  ) {
    return null;
  }

  const values = new InfoContentValues();
  values.add(deploymentDetails, 'buildTime', 'Build Time', v =>
    getLocalDatetime(v)
  );
  values.addFrom(deploymentDetails.gitInfo, add => {
    add('commitId', 'CommitId');
    add('commitTime', 'CommitTime', v => getLocalDatetime(v));
  });

  return (
    <>
      <h3>Git og bygg informasjon</h3>
      <InfoContent infoContentValues={values} />
    </>
  );
};
