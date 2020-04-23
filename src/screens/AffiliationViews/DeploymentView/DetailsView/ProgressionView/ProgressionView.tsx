import React from 'react';
import {
  IProgression,
  IRoute
} from 'services/auroraApiClients/applicationDeploymentClient/query';
import Table from '@skatteetaten/frontend-components/Table';
import styled from 'styled-components';

import { getLocalDatetime } from 'utils/date';
import Icon from '@skatteetaten/frontend-components/Icon';

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
      statusWithIcon: (
        <div style={{ display: 'inline-flex', height: 0 }}>
          <p>{it.status}</p>
          <Icon
            iconName="Completed"
            style={{ fontSize: '25px', color: '#1362ae' }}
          />
        </div>
      ),
      ...it
    };
  });

  return (
    <TableWrapper>
      <h2>WebSEAL/BIG-IP progresjoner</h2>
      <Table
        style={{ background: 'white' }}
        data={progressionsData}
        columns={[
          {
            name: 'Id',
            fieldName: 'id',
            sortable: true
          },
          {
            name: 'Host',
            fieldName: 'host',
            sortable: true
          },
          {
            name: 'Roller',
            fieldName: 'roles',
            sortable: true
          },
          {
            name: 'Rute navn',
            fieldName: 'objectname',
            sortable: true
          },
          {
            name: 'Type',
            fieldName: 'type',
            sortable: true
          },
          {
            name: 'Operasjon',
            fieldName: 'operation',
            sortable: true
          },
          {
            name: 'Status',
            fieldName: 'statusWithIcon',
            sortable: true
          },
          {
            name: 'Sist oppdatert',
            fieldName: 'updatedFormatted',
            sortable: true
          },
          {
            name: 'Feilmelding',
            fieldName: 'errorMessage',
            sortable: true
          }
        ]}
      />
    </TableWrapper>
  );
};

export default ProgressionView;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-x: hidden;
  table {
    background-color: white;
    width: 100%;
  }

  tbody {
    tr {
      &:hover,
      &:active,
      &:focus {
        background: #cde1f9 !important;
        button {
          opacity: 1;
        }
      }
    }
  }
  .ms-List-cell {
    cursor: pointer;
  }
`;
