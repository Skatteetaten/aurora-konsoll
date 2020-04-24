import React from 'react';
import { IRoute } from 'services/auroraApiClients/applicationDeploymentClient/query';

import { getLocalDatetime } from 'utils/date';
import StatusIcon from './StatusIcon';
import ProgressionTable from './ProgressionTable';

interface IProgressionViewProps {
  route?: IRoute;
}

const ProgressionView = ({ route }: IProgressionViewProps) => {
  if (!route) {
    return (
      <h2>
        SKAP integrasjon er skrudd av i dette klusteret, WebSEAL/BIG-IP
        progresjoner vil dermed ikke være tilgjengelig{' '}
      </h2>
    );
  }

  if (route.progressions.length === 0) {
    return <h2>Ingen WebSEAL/BIG-IP progresjoner for denne applikasjonen</h2>;
  }

  const progressionsData = route.progressions.map(it => {
    return {
      host: JSON.parse(it.payload).host,
      roles: JSON.parse(it.payload).roles,
      updatedFormatted: getLocalDatetime(it.updated),
      statusWithIcon: <StatusIcon status={it.status} />,
      ...it
    };
  });

  return <ProgressionTable progressions={progressionsData} />;
};

export default ProgressionView;
