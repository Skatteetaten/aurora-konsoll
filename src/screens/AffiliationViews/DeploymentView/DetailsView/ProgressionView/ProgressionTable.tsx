import React from 'react';
import Table from '@skatteetaten/frontend-components/Table';
import styled from 'styled-components';
import { IProgression } from 'services/auroraApiClients/applicationDeploymentClient/query';

interface IProgressionTable extends IProgression {
  host: string;
  roles: string;
  updatedFormatted: string;
  statusWithIcon: JSX.Element;
}

interface IProgressionTableProps {
  progressions: IProgressionTable[];
}

const ProgressionTable = ({ progressions }: IProgressionTableProps) => {
  return (
    <TableWrapper>
      <h2>WebSEAL/BIG-IP progresjoner</h2>
      <Table
        style={{ background: 'white' }}
        data={progressions}
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

export default ProgressionTable;

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
