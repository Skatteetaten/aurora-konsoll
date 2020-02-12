import React, { Component } from 'react';
import SortableDetailsList from '../../../components/SortableDetailsList';
import {
  CheckboxVisibility,
  IColumn,
  Selection,
  SelectionMode
} from 'office-ui-fabric-react/lib/DetailsList';
import { IDatabaseSchema } from '../../../models/schemas';
import { getLocalDate } from '../../../utils/date';

declare global {
  interface Window {
    debug: any;
  }
}

export class DatabaseSchemaTable extends Component<
  {
    filter: string;
    schemas: IDatabaseSchema[];
    multiSelect: boolean;
    onSingleSchemaSelected: (schema: IDatabaseSchema) => void;
    onSchemaSelectionChange: (schemas: IDatabaseSchema[]) => void;
  },
  {}
> {
  public state = {};

  private columns: IColumn[] = [
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
      fieldName: 'databaseEngine',
      isResizable: true,
      key: '9',
      maxWidth: 90,
      minWidth: 90,
      name: 'Engine',
      iconName: ''
    },
    {
      fieldName: 'jdbcUrl',
      isResizable: true,
      key: '10',
      maxWidth: 280,
      minWidth: 280,
      name: 'JDBC url',
      iconName: '',
      className: 'jdbcurl-col'
    }
  ];

  private filterDatabaseSchemaView = (filter: string) => {
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

  private selection = new Selection({
    onSelectionChanged: () => {
      window.debug = { selection: this.selection };
      if (this.props.multiSelect) {
        this.onSchemaSelectionChange();
      } else {
        this.onSingleSchemaSelected();
      }
    }
  });

  public componentDidUpdate(
    prevProps: Readonly<{
      filter: string;
      schemas: IDatabaseSchema[];
      multiSelect: boolean;
    }>,
    prevState: Readonly<{}>,
    snapshot?: any
  ): void {
    if (
      this.props.multiSelect &&
      prevProps.multiSelect !== this.props.multiSelect
    ) {
      // TODO: This does not seem to work. Must fix.
      this.selection.setAllSelected(false);
    }
  }

  public render() {
    const { filter, schemas, multiSelect } = this.props;
    let viewItems = toViewSchemas(schemas || []);

    return (
      <div className="styledTable">
        <SortableDetailsList
          columns={this.columns}
          filterView={this.filterDatabaseSchemaView}
          selectionMode={SelectionMode.multiple}
          filter={filter}
          isHeaderVisible={true}
          items={viewItems}
          selection={this.selection}
          checkboxVisibility={
            multiSelect ? CheckboxVisibility.always : CheckboxVisibility.hidden
          }
        />
      </div>
    );
  }

  private onSchemaSelectionChange() {
    const selected: IDatabaseSchemaView[] = this.selection
      .getSelection()
      .map(it => it as IDatabaseSchemaView);
    const databaseSchemas = this.props.schemas || [];
    const selectedSchemas = databaseSchemas.filter(
      schema => selected.find(it => it.id === schema.id) !== undefined
    );

    this.props.onSchemaSelectionChange(selectedSchemas);
  }

  private onSingleSchemaSelected() {
    const selected: IDatabaseSchemaView = this.selection
      .getSelection()
      .map(it => it as IDatabaseSchemaView)[0];
    if (!selected) return;
    const databaseSchemas = this.props.schemas || [];
    const selectedSchema = databaseSchemas.find(
      schema => schema.id === selected.id
    );

    if (selectedSchema) this.props.onSingleSchemaSelected(selectedSchema);
  }
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
  databaseEngine: string;
  jdbcUrl: string;
}

const toViewSchemas = (
  databaseSchemas: IDatabaseSchema[]
): IDatabaseSchemaView[] => {
  let viewItems: IDatabaseSchemaView[] = [];

  if (databaseSchemas && databaseSchemas.length > 0) {
    viewItems = databaseSchemas.map(i => toViewSchema(i));
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
    databaseEngine: i.databaseEngine,
    jdbcUrl
  };
};
