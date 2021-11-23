import React from 'react';
import { IRoute } from 'web/services/auroraApiClients/applicationDeploymentClient/query';

import { ComboBox } from '@skatteetaten/frontend-components';

import { getLocalDatetime } from 'web/utils//date';
import StatusIcon from './StatusIcon';
import SkapJobTable from './SkapJobTable';
import { IComboBoxOption } from '@fluentui/react';

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

  const websealJobsData = route.websealJobs
    .map((it) => ({
      roles: JSON.stringify(it.roles),
      updatedFormatted: getLocalDatetime(it.updated),
      statusWithIcon: <StatusIcon status={it.status} />,
      ...it,
    }))
    .sort((a, b) => Number(b.id) - Number(a.id));

  const bigipJobsData = route.bigipJobs
    .map((it: any) => {
      const options: IComboBoxOption[] = [];
      let index: number = 0;

      const createOption = (value: string | string[], title: string) => {
        if (value && !Array.isArray(value)) {
          options.push({
            key: index,
            text: `${title}: ${value}`,
            disabled: true,
          });
          index++;
        }
        if (Array.isArray(value) && value.length > 0) {
          options.push({
            key: index,
            text: `${title}: [${value}]`,
            disabled: true,
          });
          index++;
        }
      };

      createOption(it.apiPaths, 'Api paths');
      createOption(it.oauthScopes, 'Oauth scopes');
      createOption(it.serviceName, 'Tjenestenavn');
      createOption(it.asmPolicy, 'ASM policy');
      createOption(it.name, 'Navn');

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
        ...it,
      };
    })
    .sort((a, b) => Number(b.id) - Number(a.id));

  return (
    <SkapJobTable websealJobs={websealJobsData} bigipJobs={bigipJobsData} />
  );
};

export default SkapJobView;
