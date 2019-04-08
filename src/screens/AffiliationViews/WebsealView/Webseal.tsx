import * as React from 'react';
import styled from 'styled-components';

import DetailsList from 'aurora-frontend-react-komponenter/DetailsList';
import TextField from 'aurora-frontend-react-komponenter/TextField';

import Spinner from 'components/Spinner';
import { IWebsealViewState } from 'models/Webseal';
import {
  IObjectWithKey,
  Selection
} from 'office-ui-fabric-react/lib/DetailsList';
import { SortDirection } from 'services/DatabaseSchemaService';
import WebsealService, {
  defaultSortDirections,
  filterWebsealView,
  IWebsealColumns
} from 'services/WebsealService';
import WebsealDialog from './WebstealDialog';

interface IWebsealProps {
  className?: string;
  affiliation: string;
  isFetchingWebsealStates: boolean;
  websealStates: IWebsealViewState[];
  onFetch: (affiliation: string) => void;
}

interface IWebsealState {
  selectedWebsealState?: IWebsealViewState;
  filter: string;
  viewItems: IWebsealViewState[];
  selectedColumnIndex: number;
  columnSortDirections: SortDirection[];
  filteredColumns: IWebsealColumns[];
}

export const websealColumns = () => [
  {
    key: 0,
    name: 'Host',
    fieldName: 'host',
    minWidth: 500,
    maxWidth: 600,
    iconName: ''
  },
  {
    key: 1,
    name: 'Roller',
    fieldName: 'roles',
    minWidth: 800,
    maxWidth: 1000,
    iconName: ''
  }
];

class Webseal extends React.Component<IWebsealProps, IWebsealState> {
  public state: IWebsealState = {
    columnSortDirections: defaultSortDirections,
    selectedColumnIndex: -1,
    selectedWebsealState: undefined,
    filter: '',
    viewItems: [],
    filteredColumns: []
  };

  public selection = new Selection({
    onSelectionChanged: () => {
      this.onRowClicked();
    }
  });

  private websealService = new WebsealService();

  public websealStates = (): IWebsealColumns[] => {
    return this.props.websealStates.map(it => ({
      host: it.name,
      roles: it.acl.roles.join(', ')
    }));
  };

  public componentDidUpdate(prevProps: IWebsealProps) {
    const { affiliation, websealStates, onFetch } = this.props;

    if (
      prevProps.affiliation !== affiliation ||
      (prevProps.websealStates.length === 0 && websealStates.length > 0)
    ) {
      onFetch(affiliation);
    }
    if (prevProps.websealStates !== websealStates) {
      this.handleFetchWebsealStates();
    }

    if (prevProps.affiliation !== affiliation) {
      this.setState({
        filter: '',
        columnSortDirections: defaultSortDirections,
        selectedColumnIndex: -1
      });
    }
  }

  public componentDidMount() {
    const { onFetch, affiliation } = this.props;
    onFetch(affiliation);
    this.handleFetchWebsealStates();
  }

  public deselectWebsealState = () => {
    this.selection.setAllSelected(false);
    this.setState({
      selectedWebsealState: undefined
    });
  };

  public onRowClicked = () => {
    const selected: IObjectWithKey[] = this.selection.getSelection();

    let selectedWebsealState;
    if (selected.length > 0) {
      const selectedName = (selected[0] as IWebsealColumns).host;
      selectedWebsealState = this.state.viewItems.find(
        i => i.name === selectedName
      );
    }

    this.setState({
      selectedWebsealState
    });
  };

  public sortByColumn = (
    ev: React.MouseEvent<HTMLElement>,
    column: {
      key: number;
      fieldName: string;
    }
  ): void => {
    const { columnSortDirections } = this.state;
    const name = column.fieldName! as keyof any;

    const newSortDirections = defaultSortDirections;
    const prevSortDirection = columnSortDirections[column.key];

    if (this.websealService.sortNextAscending(prevSortDirection)) {
      newSortDirections[column.key] = SortDirection.ASC;
    } else if (prevSortDirection === SortDirection.ASC) {
      newSortDirections[column.key] = SortDirection.DESC;
    }
    const sortedItems = this.websealService.sortItems(
      this.websealStates(),
      prevSortDirection,
      name
    );

    this.setState({
      filteredColumns: sortedItems,
      columnSortDirections: newSortDirections,
      selectedColumnIndex: column.key
    });
  };

  public handleFetchWebsealStates = () => {
    const { websealStates } = this.props;
    const { viewItems } = this.state;

    if (JSON.stringify(viewItems) !== JSON.stringify(websealStates)) {
      this.setState({
        viewItems: websealStates
      });
      this.setState({
        filteredColumns: this.websealStates()
      });
    }
  };

  public renderDetailsList = () => {
    const { selectedColumnIndex, columnSortDirections } = this.state;
    if (!(this.websealStates().length > 0)) {
      return <p>Finner ingen WebSEAL states</p>;
    }

    return (
      <div className="webseal-grid">
        <div className="table-wrapper">
          <DetailsList
            columns={this.websealService.createColumns(
              selectedColumnIndex,
              columnSortDirections[selectedColumnIndex]
            )}
            selection={this.selection}
            onColumnHeaderClick={this.sortByColumn}
            items={this.filteredItems()}
          />
        </div>
      </div>
    );
  };

  public filteredItems = () => {
    const { filter } = this.state;
    return this.state.filteredColumns.filter(filterWebsealView(filter));
  };

  public render() {
    const { className, affiliation, isFetchingWebsealStates } = this.props;
    const { selectedWebsealState, filter } = this.state;
    return (
      <div className={className}>
        <div className="body-wrapper">
          <h2>WealSEAL states for {affiliation}</h2>
          <div className="styled-input">
            <TextField
              placeholder="Søk etter host eller rolle"
              onChanged={this.onFilterChange}
              value={filter}
            />
          </div>
          {isFetchingWebsealStates ? <Spinner /> : this.renderDetailsList()}
        </div>
        <WebsealDialog
          deselectWebsealState={this.deselectWebsealState}
          selectedWebsealState={selectedWebsealState}
        />
      </div>
    );
  }

  private onFilterChange = (text: string) => {
    this.setState({
      filter: text
    });
  };
}

export default styled(Webseal)`
  max-height: 100%;
  overflow-x: auto;

  .ms-List-cell {
    cursor: pointer;
  }

  .body-wrapper {
    padding: 0 10px;
  }

  .styled-input {
    padding-top: 10px;
    width: 300px;
  }

  .styled-action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0 20px 20px;
  }

  .table-wrapper {
    margin: 20px 0 0 0;
    grid-area: table;
    i {
      float: right;
    }
  }

  .webseal-grid {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-areas:
      'content .'
      'card .'
      'table .';
  }
`;