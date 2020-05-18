import React from 'react';
import Table from '@skatteetaten/frontend-components/Table';
import styled from 'styled-components';
import {
  IBigipJob,
  IWebsealJob
} from 'services/auroraApiClients/applicationDeploymentClient/query';

interface IWebsealJobTable extends IWebsealJob {
  updatedFormatted: string;
  statusWithIcon: JSX.Element;
}

interface IBigipJobTable extends IBigipJob {
  updatedFormatted: string;
  statusWithIcon: JSX.Element;
}

interface ISkapJobTableProps {
  websealJobs: IWebsealJobTable[];
  bigipJobs: IBigipJobTable[];
}

const SkapJobTable = ({ websealJobs, bigipJobs }: ISkapJobTableProps) => {
  return (
    <TableWrapper>
      {websealJobs.length > 0 && (
        <>
          <h2>WebSEAL jobber</h2>
          <Table
            style={{ background: 'white' }}
            data={websealJobs}
            columns={[
              {
                name: 'Status',
                fieldName: 'statusWithIcon',
                sortable: true
              },
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
                name: 'Rutenavn',
                fieldName: 'routeName',
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
        </>
      )}
      {bigipJobs.length > 0 && (
        <>
          <h2>BIG-IP jobber</h2>
          <Table
            style={{ background: 'white' }}
            data={bigipJobs}
            columns={[
              {
                name: 'Status',
                fieldName: 'statusWithIcon',
                sortable: true
              },
              {
                name: 'Id',
                fieldName: 'id',
                sortable: true
              },
              {
                name: 'Ekstern host',
                fieldName: 'externalHost',
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
                name: 'Konfigurasjon',
                fieldName: 'konfigurasjon',
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
        </>
      )}
    </TableWrapper>
  );
};

export default SkapJobTable;

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
