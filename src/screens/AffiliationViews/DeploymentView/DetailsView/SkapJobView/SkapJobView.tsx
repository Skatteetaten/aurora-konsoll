import React from 'react';
import { IRoute } from 'services/auroraApiClients/applicationDeploymentClient/query';

import ComboBox from '@skatteetaten/frontend-components/ComboBox';

import { getLocalDatetime } from 'utils/date';
import StatusIcon from './StatusIcon';
import SkapJobTable from './SkapJobTable';
import { IComboBoxOption } from 'office-ui-fabric-react/lib-commonjs';

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

  const bigipJobsData = route.bigipJobs.map((it: any) => {
    const options: IComboBoxOption[] = [];
    let index: number = 0;
    if (it.apiPaths !== null && it.apiPaths.lengh > 0) {
      options.push({
        key: index,
        text: `Api paths: ${it.apiPaths}`,
        disabled: true
      });
      index++;
    }

    if (it.oauthScopes !== null && it.oauthScopes.lengh > 0) {
      options.push({
        key: index,
        text: `Oauth scopes: ${it.oauthScopes}`,
        disabled: true
      });
      index++;
    }

    if (it.serviceName !== null) {
      options.push({
        key: index,
        text: `Tjenestenavn: ${it.serviceName}`,
        disabled: true
      });
      index++;
    }
    if (it.asmPolicy !== null) {
      options.push({
        key: index,
        text: `ASM policy: ${it.asmPolicy}`,
        disabled: true
      });
      index++;
    }
    if (it.externalHost !== null) {
      options.push({
        key: index,
        text: `Ekstern host: ${it.externalHost}`,
        disabled: true
      });
    }

    return {
      apiPaths: JSON.stringify(it.apiPaths),
      oauthScopes: JSON.stringify(it.oauthScopes),
      updatedFormatted: getLocalDatetime(it.updated),
      statusWithIcon: <StatusIcon status={it.status} />,
      konfigurasjon: (
        <div style={{ width: '180px', cursor: 'pointer' }}>
          <ComboBox
            placeholder={options.length > 0 ? 'Vis konfigurasjon' : 'Ingen'}
            options={options}
            allowFreeform={false}
            ariaLabel="Eksempel ComboBox"
            useComboBoxAsMenuWidth={false}
            disabled={options.length === 0}
          />
        </div>
      ),
      ...it
    };
  });

  return (
    <SkapJobTable websealJobs={websealJobsData} bigipJobs={bigipJobsData} />
  );
};

export default SkapJobView;
