import * as React from 'react';

import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';

import { getLocalDate } from 'utils/date';
import { mockData } from './mockData';

const Stringify = mockData;

const columns = [
  {
    fieldName: 'id',
    isResizable: true,
    key: 'column1',
    maxWidth: 150,
    minWidth: 100,
    name: 'ID'
  },
  {
    fieldName: 'cn',
    isResizable: true,
    key: 'column5',
    maxWidth: 550,
    minWidth: 500,
    name: 'CN'
  },
  {
    fieldName: 'revokedDate',
    isResizable: true,
    key: 'column7',
    maxWidth: 300,
    minWidth: 200,
    name: 'Revoked'
  },
  {
    fieldName: 'issuedDate',
    isResizable: true,
    key: 'column7',
    maxWidth: 300,
    minWidth: 200,
    name: 'Opprettet'
  }
];

const Table = () => {
  const updatedItems = Stringify.items.map(it => {
    return {
      id: it.id,
      cn: it.cn,
      issuedDate: getLocalDate(it.issuedDate),
      revokedDate: !!it.revokedDate ? it.revokedDate : '-'
    };
  });

  return <DetailsList columns={columns} items={updatedItems} />;
};

export default Table;
