import * as React from 'react';

import styled from 'styled-components';

import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import { IDatabaseSchemas, IDatabaseSchemaView } from 'models/schemas';

interface IColumns {
  fieldName: string;
}

const columns = [
  {
    fieldName: 'type',
    isResizable: true,
    key: 'column1',
    maxWidth: 100,
    minWidth: 100,
    name: 'Type'
  },
  {
    fieldName: 'appDbName',
    isResizable: true,
    key: 'column2',
    maxWidth: 150,
    minWidth: 150,
    name: 'ApplikasjonsDB'
  },
  {
    fieldName: 'createdDate',
    isResizable: true,
    key: 'column3',
    maxWidth: 100,
    minWidth: 100,
    name: 'Opprettet'
  },
  {
    fieldName: 'lastUsedDate',
    isResizable: true,
    key: 'column4',
    maxWidth: 100,
    minWidth: 100,
    name: 'Sist brukt'
  },
  {
    fieldName: 'sizeInMb',
    isResizable: true,
    key: 'column5',
    maxWidth: 125,
    minWidth: 125,
    name: 'Størrelse (MB)'
  },
  {
    fieldName: 'createdBy',
    isResizable: true,
    key: 'column6',
    maxWidth: 100,
    minWidth: 100,
    name: 'Bruker'
  }
];

export interface ISchemaProps {
  onFetch: (affiliations: string[]) => void;
  items: IDatabaseSchemas;
  isLoading: boolean;
  affiliation: string;
}

interface ISchemaState {
  viewItems: IDatabaseSchemaView[];
  isSortedDescending: boolean;
}

export class Schema extends React.Component<ISchemaProps, ISchemaState> {
  public state = {
    viewItems: [],
    isSortedDescending: true
  };

  public sortByColumn = (
    ev: React.MouseEvent<HTMLElement>,
    column: IColumns
  ): void => {
    const { viewItems, isSortedDescending } = this.state;
    const key = column.fieldName! as keyof any;

    const sortDescending = !isSortedDescending;

    const getValue = (value: any) =>
      typeof value === 'string' ? (value as string).toLowerCase() : value;

    // const isDate = (date: string) => {
    //   if (isNaN(date.getTime())) {
    //     // tslint:disable-next-line:no-console
    //     console.log('testing');
    //   }
    //   return new Date(date) !== 'Invalid Date' && !isNaN(new Date(date));
    // };

    const dateValidator = /^\d{1,2}[.]\d{1,2}[.]\d{4}$/;

    const sortedItems = viewItems.slice(0).sort((a: any, b: any) => {
      const valueA = getValue(a[key]);
      const valueB = getValue(b[key]);
      if (isNaN(new Date('k77319').getTime())) {
        // tslint:disable-next-line:no-console
        console.log('testing');
      }
      if (valueA === valueB) {
        return 0;
      } else {
        return (sortDescending ? valueA < valueB : valueA > valueB) ? 1 : -1;
      }
    });

    this.setState({
      viewItems: sortedItems,
      isSortedDescending: sortDescending
    });
  };

  public componentDidMount() {
    this.handleFetchDatabaseSchemas();
  }

  public componentDidUpdate(prevProps: ISchemaProps) {
    const { affiliation } = this.props;
    if (prevProps.affiliation !== affiliation) {
      this.handleFetchDatabaseSchemas();
    }
  }
  public handleFetchDatabaseSchemas = () => {
    const { onFetch, affiliation, items } = this.props;
    onFetch([affiliation]);
    let viewItems: IDatabaseSchemaView[];
    if (items.databaseSchemas && items.databaseSchemas.length > 0) {
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
    const { isLoading } = this.props;
    const { viewItems } = this.state;
    // tslint:disable-next-line:no-console
    console.log(isLoading);

    return (
      <div>
        <StyledContainer>
          <StyledTable>
            <DetailsList
              columns={columns}
              items={viewItems}
              onColumnHeaderClick={this.sortByColumn}
            />
          </StyledTable>
        </StyledContainer>
      </div>
    );
  }
}

const StyledTable = styled.div`
  grid-area: table;
  margin: 20px 0 0 0;
`;

const StyledContainer = styled.div`
  grid-area: content;
  display: flex;
  align-items: center;
  min-width: 1000px;
`;

export default styled(Schema)`
  max-height: 100%;
  overflow-x: auto;
`;
