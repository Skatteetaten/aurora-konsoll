import * as React from 'react';

import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';

import { INetdebugResult } from 'services/auroraApiClients';

const columns = [
  {
    fieldName: 'status',
    isResizable: true,
    key: 'column1',
    maxWidth: 115,
    minWidth: 50,
    name: 'Status'
  },
  {
    fieldName: 'message',
    isResizable: true,
    key: 'column5',
    maxWidth: 475,
    minWidth: 100,
    name: 'Kommentar'
  },
  {
    fieldName: 'resolvedIp',
    isResizable: true,
    key: 'column7',
    maxWidth: 250,
    minWidth: 100,
    name: 'Resolved Ip'
  },
  {
    fieldName: 'clusterNodeIp',
    isResizable: true,
    key: 'column7',
    maxWidth: 250,
    minWidth: 100,
    name: 'IP til noden som gjør sjekk'
  }
];

interface ITableProps {
  parsedData: INetdebugResult;
}

const Table = ({ parsedData }: ITableProps) => {
  const items = [...parsedData.failed, ...parsedData.open];
  return <DetailsList columns={columns} items={items} />;
};

export default Table;
