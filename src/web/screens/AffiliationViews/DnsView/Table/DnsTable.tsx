import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import DetailsList from '@skatteetaten/frontend-components/DetailsList';
import { IColumn } from '@skatteetaten/frontend-components/DetailsList/DetailsList.types';
import { azureColumns, onpremColumns } from './columns';
import { AzureData, OnPremData } from 'web/store/state/dns/reducer';

interface Props {
  cnames: {
    items: AzureData[] | OnPremData[];
    type: 'onPrem' | 'azure';
  };
  filter: string;
}

const DnsTable = ({ cnames, filter }: Props) => {
  const [columns, setColumns] = useState<IColumn[]>([]);
  const [cnameData, setCnameData] = useState<AzureData[] | OnPremData[]>([]);
  const [type, setType] = useState<'onPrem' | 'azure'>();

  useEffect(() => {
    if (cnames.type === 'onPrem') {
      setColumns(onpremColumns);
    } else {
      setColumns(azureColumns);
    }
    setType(cnames.type);
    setCnameData(cnames.items);
  }, [cnames, type]);

  const filterCNames = (filter: string) => {
    if (type === 'onPrem') {
      return (cname: OnPremData) =>
        cname.appName.toLowerCase().includes(filter) ||
        cname.clusterId.toLowerCase().includes(filter) ||
        cname.cname.toLowerCase().includes(filter) ||
        cname.message.toLowerCase().includes(filter) ||
        cname.namespace.toLowerCase().includes(filter) ||
        cname.routeName.toLowerCase().includes(filter) ||
        cname.status.toLowerCase().includes(filter) ||
        cname.ttl.toString().includes(filter);
    } else {
      return (cname: AzureData) =>
        cname.name.toLowerCase().includes(filter) ||
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
        items={(cnameData as any).filter(filterCNames(filter.toLowerCase()))}
        onSortUpdate={({ items, columns }) => {
          setCnameData(items);
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
