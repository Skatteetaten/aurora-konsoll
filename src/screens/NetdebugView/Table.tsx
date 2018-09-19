import * as React from 'react';

import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';

import { INetdebugResult } from './ResponseDataParsed';

const columns = [
  {
    fieldName: 'status',
    isResizable: true,
    key: 'column1',
    maxWidth: 100,
    minWidth: 50,
    name: 'Status'
  },
  {
    fieldName: 'resolvedIP',
    isResizable: true,
    key: 'column3',
    maxWidth: 150,
    minWidth: 50,
    name: 'Resolved IP'
  },
  {
    fieldName: 'message',
    isResizable: true,
    key: 'column5',
    maxWidth: 500,
    minWidth: 100,
    name: 'Kommentar'
  },
  {
    fieldName: 'hostIp',
    isResizable: true,
    key: 'column6',
    maxWidth: 250,
    minWidth: 100,
    name: 'IP til noden som gjør sjekk'
  },
  {
    fieldName: 'podIp',
    isResizable: true,
    key: 'column7',
    maxWidth: 250,
    minWidth: 100,
    name: 'IP til poden som gjør sjekk'
  }
];
interface ITableProps {
  parsedData: INetdebugResult[];
}

const Table = ({ parsedData }: ITableProps) => (
  <DetailsList columns={columns} items={parsedData} />
);

export default Table;
