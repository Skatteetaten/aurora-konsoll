import Table from '@skatteetaten/frontend-components/Table';
import * as React from 'react';
import { CnameInfo } from 'services/auroraApiClients/dnsClient/query';
import styled from 'styled-components';
import { DnsEntry } from './models/dns';

interface props {
  dnsEntries: CnameInfo[];
}

const DnsTable = ({ dnsEntries }: props) => {
  const dnsEntires: DnsEntry[] = dnsEntries.map((it) => {
    return { ...it, cname: it.entry.cname, ttl: it.entry.ttl };
  });

  return (
    <TableWrapper>
      {dnsEntires.length === 0 && <p>Finner ingen DNS entries</p>}
      {dnsEntires.length > 0 && (
        <Table
          style={{ background: 'white' }}
          data={dnsEntires}
          columns={[
            {
              name: 'Status',
              fieldName: 'status',
              sortable: true,
            },
            {
              name: 'CName',
              fieldName: 'cname',
              sortable: true,
            },
            {
              name: 'TTL',
              fieldName: 'ttl',
              sortable: true,
            },
            {
              name: 'Namespace',
              fieldName: 'namespace',
              sortable: true,
            },
            {
              name: 'Applikasjon',
              fieldName: 'appName',
              sortable: true,
            },
            {
              name: 'Rute',
              fieldName: 'routeName',
              sortable: true,
            },
            {
              name: 'Meldinger',
              fieldName: 'message',
              sortable: true,
            },
          ]}
        />
      )}
    </TableWrapper>
  );
};

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

export default DnsTable;
