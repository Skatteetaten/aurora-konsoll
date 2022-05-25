import { IColumn } from '@skatteetaten/frontend-components/DetailsList/DetailsList.types';
import {
  sort,
  sortDate,
} from 'web/components/DetailsListUtils/column/sortUtils';
import { StorageGridObjectArea } from 'web/services/auroraApiClients/storageGridClient/query';
import StatusIcon from './StatusIcon';

export const initColumns: IColumn[] = [
  {
    fieldName: 'namespace',
    isResizable: true,
    key: '0',
    maxWidth: 200,
    minWidth: 200,
    name: 'Namespace',
    sortItems: sort,
  },
  {
    fieldName: 'name',
    isResizable: true,
    key: '1',
    maxWidth: 450,
    minWidth: 450,
    name: 'Navn',
    sortItems: sort,
  },
  {
    fieldName: 'bucketName',
    isResizable: true,
    key: '2',
    maxWidth: 300,
    minWidth: 300,
    name: 'Bucket Navn',
    sortItems: sort,
  },
  {
    fieldName: 'creationTimestamp',
    isResizable: true,
    key: '3',
    maxWidth: 200,
    minWidth: 200,
    name: 'Opprettet',
    sortItems: sortDate,
  },
  {
    fieldName: 'statusSuccess',
    isResizable: true,
    key: '4',
    maxWidth: 200,
    minWidth: 200,
    name: 'Status',
    sortItems: sort,
    onRender: (it: StorageGridObjectArea) =>
      StatusIcon({ success: it.status.success, reason: it.status.reason }),
  },
];
