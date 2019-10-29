import React from 'react';
import SortableDetailsList from '../../../components/SortableDetailsList';
import {
  CheckboxVisibility,
  IColumn,
  Selection,
  SelectionMode
} from 'office-ui-fabric-react/lib/DetailsList';

export const DatabaseSchemaTable: React.FC<{
  filter: string;
  viewItems: IDatabaseSchemaView[];
  shouldResetSort: boolean;
  onSchemaListSortReset: () => void;
  multiSelect: boolean;
  selection: Selection;
}> = props => {
  const columns: IColumn[] = [
    {
      fieldName: 'type',
      isResizable: true,
      key: '0',
      maxWidth: 85,
      minWidth: 85,
      name: 'Type',
      iconName: ''
    },
    {
      fieldName: 'environment',
      isResizable: true,
      key: '1',
      maxWidth: 200,
      minWidth: 200,
      name: 'Miljø',
      iconName: ''
    },
    {
      fieldName: 'application',
      isResizable: true,
      key: '2',
      maxWidth: 200,
      minWidth: 200,
      name: 'Applikasjon',
      iconName: ''
    },
    {
      fieldName: 'discriminator',
      isResizable: true,
      key: '3',
      maxWidth: 200,
      minWidth: 200,
      name: 'Diskriminator',
      iconName: ''
    },
    {
      fieldName: 'createdDate',
      isResizable: true,
      key: '4',
      maxWidth: 90,
      minWidth: 90,
      name: 'Opprettet',
      iconName: ''
    },
    {
      fieldName: 'lastUsedDate',
      isResizable: true,
      key: '5',
      maxWidth: 90,
      minWidth: 90,
      name: 'Sist brukt',
      iconName: ''
    },
    {
      fieldName: 'sizeInMb',
      isResizable: true,
      key: '6',
      maxWidth: 110,
      minWidth: 110,
      name: 'Størrelse (MB)',
      iconName: ''
    },
    {
      fieldName: 'createdBy',
      isResizable: true,
      key: '7',
      maxWidth: 80,
      minWidth: 80,
      name: 'Bruker',
      iconName: ''
    },
    {
      fieldName: 'applicationDeploymentsUses',
      isResizable: true,
      key: '8',
      maxWidth: 70,
      minWidth: 70,
      name: 'I bruk av',
      iconName: ''
    },
    {
      fieldName: 'jdbcUrl',
      isResizable: true,
      key: '9',
      maxWidth: 280,
      minWidth: 280,
      name: 'JDBC url',
      iconName: '',
      className: 'jdbcurl-col'
    }
  ];

  const filterDatabaseSchemaView = (filter: string) => {
    return (v: IDatabaseSchemaView) =>
      v.createdBy.includes(filter) ||
      v.application.includes(filter) ||
      v.environment.includes(filter) ||
      v.discriminator.includes(filter) ||
      v.createdDate.includes(filter) ||
      (!v.lastUsedDate || v.lastUsedDate === null
        ? false
        : v.lastUsedDate.includes(filter)) ||
      v.sizeInMb.toString().includes(filter) ||
      v.type.includes(filter) ||
      v.jdbcUrl.includes(filter) ||
      v.id.includes(filter);
  };

  const {
    filter,
    viewItems,
    shouldResetSort,
    onSchemaListSortReset,
    multiSelect,
    selection
  } = props;

  return (
    <div className="styledTable">
      <SortableDetailsList
        columns={columns}
        filterView={filterDatabaseSchemaView}
        selectionMode={SelectionMode.multiple}
        filter={filter}
        isHeaderVisible={true}
        items={viewItems}
        selection={selection}
        shouldResetSort={shouldResetSort}
        onResetSort={onSchemaListSortReset}
        checkboxVisibility={
          multiSelect ? CheckboxVisibility.always : CheckboxVisibility.hidden
        }
      />
    </div>
  );
};

export interface IDatabaseSchemaView {
  type: string;
  application: string;
  environment: string;
  discriminator: string;
  createdBy: string;
  createdDate: string;
  lastUsedDate?: string | null;
  sizeInMb: number;
  applicationDeploymentsUses: number;
  id: string;
  jdbcUrl: string;
}
