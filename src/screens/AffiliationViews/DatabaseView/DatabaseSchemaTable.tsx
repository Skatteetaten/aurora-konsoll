import React from 'react';
import SortableDetailsList from 'components/SortableDetailsList';
import {
  CheckboxVisibility,
  SelectionMode,
  Selection,
  IColumn,
} from 'office-ui-fabric-react/lib-commonjs';

import { IDatabaseSchema } from 'models/schemas';
import { getLocalDate } from 'utils/date';

declare global {
  interface Window {
    debug: any;
  }
}
interface IDatabaseSchemaTableProps {
  filter: string;
  schemas: IDatabaseSchema[];
  multiSelect: boolean;
  selection: Selection;
  shouldResetSort: boolean;
  onResetSort: () => void;
}

export function DatabaseSchemaTable({
  filter,
  schemas,
  multiSelect,
  selection,
  onResetSort,
  shouldResetSort,
}: IDatabaseSchemaTableProps) {
  const filterDatabaseSchemaView = (filter: string) => (
    view: IDatabaseSchemaView
  ) =>
    view.createdBy.includes(filter) ||
    view.application.includes(filter) ||
    view.environment.includes(filter) ||
    view.discriminator.includes(filter) ||
    view.createdDate.includes(filter) ||
    (!view.lastUsedDate || view.lastUsedDate === null
      ? false
      : view.lastUsedDate.includes(filter)) ||
    view.sizeInMb.toString().includes(filter) ||
    view.type.includes(filter) ||
    view.jdbcUrl.includes(filter) ||
    view.id.includes(filter);

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
  engine: string;
  jdbcUrl: string;
}

const toViewSchemas = (
  databaseSchemas: IDatabaseSchema[]
): IDatabaseSchemaView[] => {
  let viewItems: IDatabaseSchemaView[] = [];

  if (databaseSchemas && databaseSchemas.length > 0) {
    viewItems = databaseSchemas.map((i) => toViewSchema(i));
  }
  return viewItems;
};

const toViewSchema = (i: IDatabaseSchema): IDatabaseSchemaView => {
  const getJdbcUrlText = (prefix: string) =>
    i.jdbcUrl.substring(i.jdbcUrl.indexOf(prefix) + prefix.length);

  const jdbcUrl = i.jdbcUrl.includes('@')
    ? getJdbcUrlText('@')
    : getJdbcUrlText('://');

  return {
    id: i.id,
    environment: i.environment,
    application: i.application,
    createdDate: getLocalDate(i.createdDate),
    lastUsedDate: i.lastUsedDate && getLocalDate(i.lastUsedDate),
    discriminator: i.discriminator,
    type: i.type,
    applicationDeploymentsUses: i.applicationDeployments.length,
    sizeInMb: i.sizeInMb,
    createdBy: i.createdBy,
    engine: i.type === 'EXTERNAL' ? '' : i.engine,
    jdbcUrl,
  };
};
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
