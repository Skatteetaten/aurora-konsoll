import React from 'react';
import SortableDetailsList from 'components/SortableDetailsList';
import {
  CheckboxVisibility,
  SelectionMode,
  Selection,
  IColumn
} from 'office-ui-fabric-react/lib-commonjs';

import {
  IRestorableDatabaseSchema,
  IRestorableDatabaseSchemaData
} from 'models/schemas';
import { getLocalDate } from 'utils/date';

interface IRestorableDatabaseSchemaTableProps {
  filter: string;
  schemas: IRestorableDatabaseSchemaData[];
  multiSelect: boolean;
  selection: Selection;
  shouldResetSort: boolean;
  onResetSort: () => void;
}

export function RestorableDatabaseSchemaTable({
  filter,
  schemas,
  multiSelect,
  selection,
  onResetSort,
  shouldResetSort
}: IRestorableDatabaseSchemaTableProps) {
  const columns: IColumn[] = [
    {
      fieldName: 'setToCooldownAt',
      isResizable: true,
      key: '0',
      maxWidth: 85,
      minWidth: 85,
      name: 'Satt i cooldown',
      iconName: ''
    },
    {
      fieldName: 'deleteAfter',
      isResizable: true,
      key: '1',
      maxWidth: 85,
      minWidth: 85,
      name: 'Slettes permanent',
      iconName: ''
    },
    {
      fieldName: 'environment',
      isResizable: true,
      key: '2',
      maxWidth: 200,
      minWidth: 200,
      name: 'Miljø',
      iconName: ''
    },
    {
      fieldName: 'application',
      isResizable: true,
      key: '3',
      maxWidth: 200,
      minWidth: 200,
      name: 'Applikasjon',
      iconName: ''
    },
    {
      fieldName: 'discriminator',
      isResizable: true,
      key: '4',
      maxWidth: 200,
      minWidth: 200,
      name: 'Diskriminator',
      iconName: ''
    },
    {
      fieldName: 'createdDate',
      isResizable: true,
      key: '5',
      maxWidth: 90,
      minWidth: 90,
      name: 'Opprettet',
      iconName: ''
    },
    {
      fieldName: 'lastUsedDate',
      isResizable: true,
      key: '6',
      maxWidth: 90,
      minWidth: 90,
      name: 'Sist brukt',
      iconName: ''
    },
    {
      fieldName: 'sizeInMb',
      isResizable: true,
      key: '7',
      maxWidth: 110,
      minWidth: 110,
      name: 'Størrelse (MB)',
      iconName: ''
    },
    {
      fieldName: 'createdBy',
      isResizable: true,
      key: '8',
      maxWidth: 80,
      minWidth: 80,
      name: 'Bruker',
      iconName: ''
    },
    {
      fieldName: 'engine',
      isResizable: true,
      key: '9',
      maxWidth: 90,
      minWidth: 90,
      name: 'Engine',
      iconName: ''
    }
  ];

  const filterDatabaseSchemaView = (filter: string) => {
    return (v: IRestorableDatabaseSchemaView) =>
      //TODO filter for setToCooldownAt og deleteAfter
      v.createdBy.includes(filter) ||
      v.application.includes(filter) ||
      v.environment.includes(filter) ||
      v.discriminator.includes(filter) ||
      v.createdDate.includes(filter) ||
      (!v.lastUsedDate || v.lastUsedDate === null
        ? false
        : v.lastUsedDate.includes(filter)) ||
      v.sizeInMb.toString().includes(filter) ||
      v.id.includes(filter);
  };

  let viewItems = toViewSchemas(schemas || []);

  return (
    <div className="styledTable">
      <SortableDetailsList
        columns={columns}
        filterView={filterDatabaseSchemaView}
        selectionMode={SelectionMode.multiple}
        filter={filter}
        isHeaderVisible={true}
        onResetSort={onResetSort}
        shouldResetSort={shouldResetSort}
        items={viewItems}
        selection={selection}
        checkboxVisibility={
          multiSelect ? CheckboxVisibility.always : CheckboxVisibility.hidden
        }
      />
    </div>
  );
}

export interface IRestorableDatabaseSchemaView {
  type: string;
  setToCooldownAt: Date;
  deleteAfter: Date;
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

const toViewSchemas = (
  databaseSchemas: IRestorableDatabaseSchemaData[]
): IRestorableDatabaseSchemaView[] => {
  let viewItems: IRestorableDatabaseSchemaView[] = [];

  if (databaseSchemas && databaseSchemas.length > 0) {
    viewItems = databaseSchemas.map(i => toViewSchema(i));
  }
  return viewItems;
};

const toViewSchema = (
  i: IRestorableDatabaseSchemaData
): IRestorableDatabaseSchemaView => {
  const getJdbcUrlText = (prefix: string) =>
    i.databaseSchema.jdbcUrl.substring(
      i.databaseSchema.jdbcUrl.indexOf(prefix) + prefix.length
    );

  console.log(i);

  const jdbcUrl = i.databaseSchema.jdbcUrl.includes('@')
    ? getJdbcUrlText('@')
    : getJdbcUrlText('://');
  const {
    id,
    environment,
    application,
    discriminator,
    type,
    sizeInMb,
    createdBy
  } = i.databaseSchema;

  return {
    setToCooldownAt: i.setToCooldownAt,
    deleteAfter: i.deleteAfter,
    id,
    environment,
    application,
    createdDate: getLocalDate(i.databaseSchema.createdDate),
    lastUsedDate:
      i.databaseSchema.lastUsedDate &&
      getLocalDate(i.databaseSchema.lastUsedDate),
    discriminator,
    type,
    applicationDeploymentsUses: i.databaseSchema.applicationDeployments.length,
    sizeInMb: sizeInMb,
    createdBy: createdBy,
    jdbcUrl
  };
};
