import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import DetailsList from '@skatteetaten/frontend-components/DetailsList';
import { IColumn } from '@skatteetaten/frontend-components/DetailsList/DetailsList.types';
import { cnameTypes } from '../DnsView';
import { azureColumns, onpremColumns } from './columns';
import { Azure, OnPrem } from 'web/services/auroraApiClients/dnsClient/query';

interface Props {
  cnames: cnameTypes;
  filter: string;
}

interface OnPremData extends OnPrem {
  cname: string;
  ttl: number;
}

const DnsTable = ({ cnames, filter }: Props) => {
  const [columns, setColumns] = useState<IColumn[]>([]);
  const [cnameData, setCnameData] = useState<cnameTypes>(cnames);
  useEffect(() => {
    if (cnames.type === 'onPrem') {
      setColumns(onpremColumns);
      setCnameData({
        type: 'onPrem',
        items:
          cnames.items.map((it) => {
            return { ...it, cname: it.entry.cname, ttl: it.entry.ttl };
          }) ?? [],
      });
    } else if (cnames.type === 'azure') {
      setColumns(azureColumns);
      setCnameData({
        type: 'azure',
        items: cnames.items,
      });
    }
  }, [cnames]);

  if (cnameData.items.length === 0) {
    return <p>Finner ingen {cnames.type} DNS entries</p>;
  }

  const filterCNames = (filter: string) => {
    if (cnameData.type === 'onPrem') {
      return (cname: OnPremData) => {
        return (
          cname.appName.toLowerCase().includes(filter) ||
          cname.clusterId.toLowerCase().includes(filter) ||
          cname.cname.toLowerCase().includes(filter) ||
          cname.message.toLowerCase().includes(filter) ||
          cname.namespace.toLowerCase().includes(filter) ||
          cname.routeName.toLowerCase().includes(filter) ||
          cname.status.toLowerCase().includes(filter) ||
          cname.ttl.toString().includes(filter)
        );
      };
    } else {
      return (cname: Azure) =>
        cname.namespace.toLowerCase().includes(filter) ||
        cname.canonicalName.toLowerCase().includes(filter) ||
        cname.clusterId.toLowerCase().includes(filter) ||
        cname.ownerObjectName.toLowerCase().includes(filter) ||
        cname.ttlInSeconds.toString().includes(filter);
    }
  };

  return (
    <TableWrapper>
      <DetailsList
        columns={columns}
        items={(cnameData.items as any).filter(
          filterCNames(filter.toLowerCase())
        )}
        onSortUpdate={({ items, columns }) => {
          setCnameData({
            items: items,
            type: cnameData.type,
          });
          setColumns(columns);
        }}
      />
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
    cursor: default !important;
  }
`;

export default DnsTable;
