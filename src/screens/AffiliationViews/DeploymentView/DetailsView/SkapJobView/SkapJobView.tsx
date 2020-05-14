import React from 'react';
import { IRoute } from 'services/auroraApiClients/applicationDeploymentClient/query';

import { getLocalDatetime } from 'utils/date';
import StatusIcon from './StatusIcon';
import SkapJobTable from './SkapJobTable';

interface ISkapJobViewProps {
  route?: IRoute;
}

const SkapJobView = ({ route }: ISkapJobViewProps) => {
  if (!route) {
    return (
      <h2>
        SKAP integrasjon er skrudd av i dette klusteret, WebSEAL/BIG-IP jobber
        vil dermed ikke være tilgjengelig{' '}
      </h2>
    );
  }

  if (route.websealJobs.length === 0 && route.bigipJobs.length === 0) {
    return <h2>Ingen WebSEAL/BIG-IP jobber for denne applikasjonen</h2>;
  }

  const websealJobsData = route.websealJobs.map(it => {
    return {
      roles: JSON.stringify(it.roles),
      updatedFormatted: getLocalDatetime(it.updated),
      statusWithIcon: <StatusIcon status={it.status} />,
      ...it
    };
  });

  const bigipJobsData = route.bigipJobs.map(it => {
    return {
      apiPaths: JSON.stringify(it.apiPaths),
      oauthScopes: JSON.stringify(it.oauthScopes),
      updatedFormatted: getLocalDatetime(it.updated),
      statusWithIcon: <StatusIcon status={it.status} />,
      ...it
    };
  });

  return (
    <SkapJobTable websealJobs={websealJobsData} bigipJobs={bigipJobsData} />
  );
};

export default SkapJobView;
