import * as React from 'react';

import styled from 'styled-components';

import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import TextField from 'aurora-frontend-react-komponenter/TextField';
import Spinner from 'components/Spinner';
import {
  IObjectWithKey,
  Selection
} from 'office-ui-fabric-react/lib/DetailsList';

import {
  IDatabaseSchema,
  IDatabaseSchemaInput,
  IDatabaseSchemas,
  IDatabaseSchemaView
} from 'models/schemas';
import DatabaseSchemaService, {
  defaultSortDirections,
  filterDatabaseSchemaView,
  SortDirection
} from 'services/DatabaseSchemaService';
import DatabaseSchemaDialog from './DatabaseSchemaDialog';

export interface ISchemaProps {
  onFetch: (affiliations: string[]) => void;
  onUpdate: (databaseSchema: IDatabaseSchemaInput) => void;
  items: IDatabaseSchemas;
  isFetching: boolean;
  isUpdating: boolean;
  updateResponse: boolean;
  affiliation: string;
  className?: string;
}

interface ISchemaState {
  viewItems: IDatabaseSchemaView[];
  columnSortDirections: SortDirection[];
  selectedColumnIndex: number;
  filter: string;
  selectedSchema?: IDatabaseSchema;
}

export class Schema extends React.Component<ISchemaProps, ISchemaState> {
  public state = {
    viewItems: [],
    columnSortDirections: defaultSortDirections,
    selectedColumnIndex: -1,
    filter: '',
    selectedSchema: undefined
  };

  private databaseSchemaService = new DatabaseSchemaService();

  private selection = new Selection({
    onSelectionChanged: () => this.onRowClicked()
  });

  public sortByColumn = (
    ev: React.MouseEvent<HTMLElement>,
    column: {
      key: number;
      fieldName: string;
    }
  ): void => {
    const { viewItems, columnSortDirections } = this.state;
    const name = column.fieldName! as keyof any;

    const newSortDirections = defaultSortDirections;
    const prevSortDirection = columnSortDirections[column.key];

    if (this.databaseSchemaService.sortNextAscending(prevSortDirection)) {
      newSortDirections[column.key] = SortDirection.ASC;
    } else if (prevSortDirection === SortDirection.ASC) {
      newSortDirections[column.key] = SortDirection.DESC;
    }
    const sortedItems = this.databaseSchemaService.sortItems(
      viewItems,
      prevSortDirection,
      name
    );

    this.setState({
      viewItems: sortedItems,
      columnSortDirections: newSortDirections,
      selectedColumnIndex: column.key
    });
  };

  public componentDidMount() {
    const { affiliation, onFetch } = this.props;
    this.handleFetchDatabaseSchemas();
    onFetch([affiliation]);
  }

  public componentDidUpdate(prevProps: ISchemaProps) {
    const { affiliation, items, onFetch } = this.props;

    if (prevProps.items !== items) {
      this.handleFetchDatabaseSchemas();
    }
    if (
      prevProps.affiliation !== affiliation ||
      (prevProps.items.databaseSchemas.length === 0 &&
        items.databaseSchemas.length > 0)
    ) {
      onFetch([affiliation]);
      this.setState({
        columnSortDirections: defaultSortDirections,
        selectedColumnIndex: -1
      });
    }
  }
  public handleFetchDatabaseSchemas = () => {
    const { items } = this.props;
    let viewItems: IDatabaseSchemaView[];

    const dateOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    if (items.databaseSchemas.length > 0) {
      viewItems = items.databaseSchemas.map(i => {
        return {
          id: i.id,
          environment: i.environment,
          application: i.application,
          createdDate: new Date(i.createdDate).toLocaleDateString(
            'nb-NO',
            dateOptions
          ),
          lastUsedDate:
            i.lastUsedDate &&
            new Date(i.lastUsedDate).toLocaleDateString('nb-NO', dateOptions),
          discriminator: i.discriminator,
          type: i.type,
          sizeInMb: i.sizeInMb,
          createdBy: i.createdBy
        };
      });
    } else {
      viewItems = [];
    }
    this.setState({
      viewItems
    });
  };

  public render() {
    const { isFetching, className } = this.props;
    const {
      viewItems,
      selectedColumnIndex,
      columnSortDirections,
      filter,
      selectedSchema
    } = this.state;

    if (isFetching) {
      return <Spinner />;
    }
    const filteredItems = viewItems.filter(filterDatabaseSchemaView(filter));

    return (
      <div className={className}>
        <div className="styledInput">
          <TextField
            placeholder="Søk etter skjema"
            onChanged={this.onFilterChange}
          />
        </div>
        <div className="styledTable">
          <DetailsList
            columns={this.databaseSchemaService.createColumns(
              selectedColumnIndex,
              columnSortDirections[selectedColumnIndex]
            )}
            items={filteredItems}
            onColumnHeaderClick={this.sortByColumn}
            selection={this.selection}
          />
        </div>

        <DatabaseSchemaDialog
          schema={selectedSchema}
          clearSelectedSchema={this.clearSelectedSchema}
        />
      </div>
    );
  }

  private onFilterChange = (text: string) => {
    this.setState({
      filter: text
    });
  };

  private onRowClicked = () => {
    const { items } = this.props;
    const selected: IObjectWithKey[] = this.selection.getSelection();
    let selectedSchema;
    if (selected.length > 0) {
      const selectedId = (selected[0] as IDatabaseSchema).id;
      selectedSchema = items.databaseSchemas.find(
        (i: IDatabaseSchema) => i.id === selectedId
      );
    }
    this.setState({
      selectedSchema
    });
  };
  private clearSelectedSchema = () => {
    this.selection.setAllSelected(false);
    this.setState({
      selectedSchema: undefined
    });
  };
}

export default styled(Schema)`
  height: 100%;
  overflow-x: auto;

  .styledInput {
    margin: 20px;
    width: 300px;
  }

  .styledTable {
    margin-left: 20px;
    display: flex;
    grid-area: table;
    i {
      float: right;
    }
  }
`;
