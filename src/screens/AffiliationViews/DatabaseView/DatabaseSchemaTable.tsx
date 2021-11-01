import React, { useEffect, useState } from 'react';
import SortableDetailsList from 'components/SortableDetailsList';
import { Selection, CheckboxVisibility, IColumn } from '@fluentui/react';

import { IDatabaseSchemaData } from 'models/schemas';
import { getLocalDate } from 'utils/date';
interface IDatabaseSchemaTableProps {
  filter: string;
  schemas: IDatabaseSchemaData[];
  multiSelect: boolean;
  selection: Selection;
  shouldResetSort: boolean;
  onResetSort: () => void;
  isRestoreTable: boolean;
  selectedSchemas: IDatabaseSchemaData[];
}

export const DatabaseSchemaTable = ({
  filter,
  schemas,
  multiSelect,
  selection,
  onResetSort,
  shouldResetSort,
  isRestoreTable,
  selectedSchemas,
}: IDatabaseSchemaTableProps) => {
  const filterDatabaseSchemaView =
    (filter: string) => (view: IDatabaseSchemaView) =>
      view.createdBy.includes(filter) ||
      view.application.toLowerCase().includes(filter) ||
      view.environment.toLowerCase().includes(filter) ||
      view.discriminator.toLowerCase().includes(filter) ||
      view.createdDate.includes(filter) ||
      (!view.lastUsedDate || view.lastUsedDate === null
        ? false
        : view.lastUsedDate.includes(filter)) ||
      view.sizeInMb.toString().includes(filter) ||
      view.type.toLowerCase().includes(filter) ||
      view.jdbcUrl.includes(filter) ||
      view.id.includes(filter) ||
      view.engine.toLowerCase().includes(filter) ||
      (view.setToCooldownAt?.includes(filter) ?? false) ||
      (view.deleteAfter?.includes(filter) ?? false);
  const [viewItems, setViewItems] = useState<IDatabaseSchemaView[]>([]);

  useEffect(() => {
    setViewItems(schemas.map((schema) => toViewSchema(schema)));
  }, [schemas]);

  return (
    <div className="styledTable">
      <SortableDetailsList
        columns={isRestoreTable ? restoreColumns : columns}
        filterView={filterDatabaseSchemaView}
        filter={filter}
        isHeaderVisible={true}
        onResetSort={onResetSort}
        shouldResetSort={shouldResetSort}
        items={viewItems}
        selection={selection}
        checkboxVisibility={
          multiSelect ? CheckboxVisibility.always : CheckboxVisibility.hidden
        }
        selectedItems={selectedSchemas.map((schema) => toViewSchema(schema))}
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
  engine: string;
  setToCooldownAt?: string;
  deleteAfter?: string;
}

const toViewSchema = (schemaData: IDatabaseSchemaData): IDatabaseSchemaView => {
  const schema = schemaData.databaseSchema;
  const getJdbcUrlText = (prefix: string) =>
    schema.jdbcUrl.substring(schema.jdbcUrl.indexOf(prefix) + prefix.length);

  const jdbcUrl = schema.jdbcUrl.includes('@')
    ? getJdbcUrlText('@')
    : getJdbcUrlText('://');

  return {
    type: schema.type,
    application: schema.application,
    environment: schema.environment,
    discriminator: schema.discriminator,
    createdBy: schema.createdBy,
    createdDate: getLocalDate(schema.createdDate),
    lastUsedDate: schema.lastUsedDate && getLocalDate(schema.lastUsedDate),
    sizeInMb: schema.sizeInMb,
    applicationDeploymentsUses: schema.applicationDeployments.length,
    id: schema.id,
    jdbcUrl: jdbcUrl,
    engine: schema.type === 'EXTERNAL' ? '' : schema.engine,
    setToCooldownAt:
      schemaData.setToCooldownAt === undefined
        ? undefined
        : getLocalDate(schemaData.setToCooldownAt),
    deleteAfter:
      schemaData.deleteAfter === undefined
        ? undefined
        : getLocalDate(schemaData.deleteAfter),
  };
};

const restoreColumns: IColumn[] = [
  {
    fieldName: 'environment',
    isResizable: true,
    key: '0',
    maxWidth: 200,
    minWidth: 200,
    name: 'Miljø',
    iconName: '',
  },
  {
    fieldName: 'application',
    isResizable: true,
    key: '1',
    maxWidth: 200,
    minWidth: 200,
    name: 'Applikasjon',
    iconName: '',
  },
  {
    fieldName: 'discriminator',
    isResizable: true,
    key: '2',
    maxWidth: 200,
    minWidth: 200,
    name: 'Diskriminator',
    iconName: '',
  },
  {
    fieldName: 'setToCooldownAt',
    isResizable: true,
    key: '3',
    maxWidth: 200,
    minWidth: 200,
    name: 'Satt i cooldown',
    iconName: '',
  },
  {
    fieldName: 'deleteAfter',
    isResizable: true,
    key: '4',
    maxWidth: 200,
    minWidth: 200,
    name: 'Slettes permanent',
    iconName: '',
  },
  {
    fieldName: 'createdDate',
    isResizable: true,
    key: '5',
    maxWidth: 90,
    minWidth: 90,
    name: 'Opprettet',
    iconName: '',
  },
  {
    fieldName: 'lastUsedDate',
    isResizable: true,
    key: '6',
    maxWidth: 90,
    minWidth: 90,
    name: 'Sist brukt',
    iconName: '',
  },
  {
    fieldName: 'sizeInMb',
    isResizable: true,
    key: '7',
    maxWidth: 110,
    minWidth: 110,
    name: 'Størrelse (MB)',
    iconName: '',
  },
  {
    fieldName: 'createdBy',
    isResizable: true,
    key: '8',
    maxWidth: 80,
    minWidth: 80,
    name: 'Bruker',
    iconName: '',
  },
  {
    fieldName: 'engine',
    isResizable: true,
    key: '9',
    maxWidth: 90,
    minWidth: 90,
    name: 'Engine',
    iconName: '',
  },
];
const columns: IColumn[] = [
  {
    fieldName: 'type',
    isResizable: true,
    key: '0',
    maxWidth: 85,
    minWidth: 85,
    name: 'Type',
    iconName: '',
  },
  {
    fieldName: 'environment',
    isResizable: true,
    key: '1',
    maxWidth: 200,
    minWidth: 200,
    name: 'Miljø',
    iconName: '',
  },
  {
    fieldName: 'application',
    isResizable: true,
    key: '2',
    maxWidth: 200,
    minWidth: 200,
    name: 'Applikasjon',
    iconName: '',
  },
  {
    fieldName: 'discriminator',
    isResizable: true,
    key: '3',
    maxWidth: 200,
    minWidth: 200,
    name: 'Diskriminator',
    iconName: '',
  },
  {
    fieldName: 'createdDate',
    isResizable: true,
    key: '4',
    maxWidth: 90,
    minWidth: 90,
    name: 'Opprettet',
    iconName: '',
  },
  {
    fieldName: 'lastUsedDate',
    isResizable: true,
    key: '5',
    maxWidth: 90,
    minWidth: 90,
    name: 'Sist brukt',
    iconName: '',
  },
  {
    fieldName: 'sizeInMb',
    isResizable: true,
    key: '6',
    maxWidth: 110,
    minWidth: 110,
    name: 'Størrelse (MB)',
    iconName: '',
  },
  {
    fieldName: 'createdBy',
    isResizable: true,
    key: '7',
    maxWidth: 80,
    minWidth: 80,
    name: 'Bruker',
    iconName: '',
  },
  {
    fieldName: 'applicationDeploymentsUses',
    isResizable: true,
    key: '8',
    maxWidth: 70,
    minWidth: 70,
    name: 'I bruk av',
    iconName: '',
  },
  {
    fieldName: 'engine',
    isResizable: true,
    key: '9',
    maxWidth: 90,
    minWidth: 90,
    name: 'Engine',
    iconName: '',
  },
  {
    fieldName: 'jdbcUrl',
    isResizable: true,
    key: '10',
    maxWidth: 280,
    minWidth: 280,
    name: 'JDBC url',
    iconName: '',
    className: 'jdbcurl-col',
  },
];
