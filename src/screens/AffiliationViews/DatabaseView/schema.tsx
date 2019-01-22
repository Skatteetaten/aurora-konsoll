import * as React from 'react';

import styled from 'styled-components';

import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import Spinner from 'components/Spinner';
import { IDatabaseSchemas, IDatabaseSchemaView } from 'models/schemas';

interface IColumns {
  key: number;
  fieldName: string;
}

enum SortDirection {
  ASC,
  DESC,
  NONE
}

const columns = (index: number, sortDirection: SortDirection) => {
  const cols = [
    {
      fieldName: 'type',
      isResizable: true,
      key: 0,
      maxWidth: 100,
      minWidth: 100,
      name: 'Type',
      iconName: ''
    },
    {
      fieldName: 'appDbName',
      isResizable: true,
      key: 1,
      maxWidth: 150,
      minWidth: 150,
      name: 'ApplikasjonsDB',
      iconName: ''
    },
    {
      fieldName: 'createdDate',
      isResizable: true,
      key: 2,
      maxWidth: 100,
      minWidth: 100,
      name: 'Opprettet',
      iconName: ''
    },
    {
      fieldName: 'lastUsedDate',
      isResizable: true,
      key: 3,
      maxWidth: 100,
      minWidth: 100,
      name: 'Sist brukt',
      iconName: ''
    },
    {
      fieldName: 'sizeInMb',
      isResizable: true,
      key: 4,
      maxWidth: 125,
      minWidth: 125,
      name: 'Størrelse (MB)',
      iconName: ''
    },
    {
      fieldName: 'createdBy',
      isResizable: true,
      key: 5,
      maxWidth: 100,
      minWidth: 100,
      name: 'Bruker',
      iconName: ''
    }
  ];
  if (index > -1) {
    const currentCol = cols[index];
    if (
      sortDirection === SortDirection.NONE ||
      sortDirection === SortDirection.DESC
    ) {
      currentCol.iconName = 'Down';
    } else if (sortDirection === SortDirection.ASC) {
      currentCol.iconName = 'Up';
    }
  }
  return cols;
};

export interface ISchemaProps {
  onFetch: (affiliations: string[]) => void;
  items: IDatabaseSchemas;
  isLoading: boolean;
  affiliation: string;
  className?: string;
}

interface ISchemaState {
  viewItems: IDatabaseSchemaView[];
  columnSortDirections: SortDirection[];
  selectedColumnIndex: number;
}

const defaultSortDirections = new Array<SortDirection>(6).fill(
  SortDirection.NONE
);

export class Schema extends React.Component<ISchemaProps, ISchemaState> {
  public state = {
    viewItems: [],
    columnSortDirections: defaultSortDirections,
    selectedColumnIndex: -1
  };

  public sortByColumn = (
    ev: React.MouseEvent<HTMLElement>,
    column: IColumns
  ): void => {
    const { viewItems, columnSortDirections } = this.state;
    const name = column.fieldName! as keyof any;

    const newSortDirections = defaultSortDirections;
    const prevSortDirection = columnSortDirections[column.key];

    if (
      prevSortDirection === SortDirection.NONE ||
      prevSortDirection === SortDirection.DESC
    ) {
      newSortDirections[column.key] = SortDirection.ASC;
    } else if (prevSortDirection === SortDirection.ASC) {
      newSortDirections[column.key] = SortDirection.DESC;
    }

    const getValue = (value: any) =>
      typeof value === 'string' ? (value as string).toLowerCase() : value;
    const dateValidator = /^\d{1,2}[.]\d{1,2}[.]\d{4}$/;

    const isDate = (value: any) => {
      return (
        typeof value === 'string' && (value as string).match(dateValidator)
      );
    };

    const createDate = (value: string | null) => {
      if (value === null) {
        return new Date(0);
      } else {
        const values = value.split('.');
        return new Date(
          Number(values[2]),
          Number(values[1]) - 1,
          Number(values[0])
        );
      }
    };

    const sortAscending =
      prevSortDirection === SortDirection.NONE ||
      prevSortDirection === SortDirection.DESC;

    const sortedItems = viewItems.slice(0).sort((a: any, b: any) => {
      const valueA = getValue(a[name]);
      const valueB = getValue(b[name]);
      if (valueA === valueB) {
        return 0;
      } else if (isDate(valueA) || isDate(valueB)) {
        const dateA = createDate(valueA).getTime();
        const dateB = createDate(valueB).getTime();
        return sortAscending ? dateB - dateA : dateA - dateB;
      } else {
        return (sortAscending ? valueA < valueB : valueA > valueB) ? 1 : -1;
      }
    });

    this.setState({
      viewItems: sortedItems,
      columnSortDirections: newSortDirections,
      selectedColumnIndex: column.key
    });
  };

  public componentDidMount() {
    this.handleFetchDatabaseSchemas();
  }

  public componentDidUpdate(prevProps: ISchemaProps) {
    const { affiliation, items } = this.props;
    if (
      prevProps.affiliation !== affiliation ||
      (prevProps.items.databaseSchemas.length === 0 &&
        items.databaseSchemas.length > 0)
    ) {
      this.handleFetchDatabaseSchemas();
      this.setState({
        columnSortDirections: defaultSortDirections,
        selectedColumnIndex: -1
      });
    }
  }
  public handleFetchDatabaseSchemas = () => {
    const { onFetch, affiliation, items } = this.props;
    onFetch([affiliation]);
    let viewItems: IDatabaseSchemaView[];
    if (items.databaseSchemas.length > 0) {
      viewItems = items.databaseSchemas.map(i => {
        return {
          createdDate: new Date(i.createdDate).toLocaleDateString('nb-NO'),
          lastUsedDate:
            i.lastUsedDate &&
            new Date(i.lastUsedDate).toLocaleDateString('nb-NO'),
          appDbName: i.appDbName,
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
    const { isLoading, className } = this.props;
    const { viewItems, selectedColumnIndex, columnSortDirections } = this.state;

    if (isLoading) {
      return <Spinner />;
    }

    return (
      <div className={className}>
        <div className="styledContainer">
          <div className="styledTable">
            <DetailsList
              columns={columns(
                selectedColumnIndex,
                columnSortDirections[selectedColumnIndex]
              )}
              items={viewItems}
              onColumnHeaderClick={this.sortByColumn}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default styled(Schema)`
  max-height: 100%;
  overflow-x: auto;

  .styledTable {
    grid-area: table;
    margin: 20px auto 0 auto;
    i {
      float: right;
    }
  }

  .styledContainer {
    grid-area: content;
    display: flex;
  }
`;
