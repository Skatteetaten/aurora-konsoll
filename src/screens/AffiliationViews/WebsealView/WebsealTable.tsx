import * as React from 'react';
import styled from 'styled-components';

import TextField from 'aurora-frontend-react-komponenter/TextField';

import LoadingButton from 'components/LoadingButton';
import SortableDetailsList from 'components/SortableDetailsList';
import Spinner from 'components/Spinner';
import { SortDirection } from 'models/SortDirection';
import { IWebsealState } from 'models/Webseal';
import {
  IObjectWithKey,
  Selection
} from 'office-ui-fabric-react/lib/DetailsList';
import {
  defaultSortDirections,
  filterWebsealView,
  IWebsealTableColumns,
  websealTableColumns
} from 'services/WebsealService';
import WebsealDialog from './WebstealDialog';

interface IWebsealTableProps {
  className?: string;
  affiliation: string;
  isFetchingWebsealStates: boolean;
  websealStates: IWebsealState[];
  onFetch: (affiliation: string) => void;
}

interface IWebsealTableState {
  selectedWebsealState?: IWebsealState;
  filter: string;
  viewItems: IWebsealState[];
  selectedColumnIndex: number;
  columnSortDirections: SortDirection[];
  filteredColumns: IWebsealTableColumns[];
}

class Webseal extends React.Component<IWebsealTableProps, IWebsealTableState> {
  public state: IWebsealTableState = {
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

  public websealStates = (): IWebsealTableColumns[] => {
    return this.props.websealStates.map(it => ({
      host: it.name,
      roles: it.acl.roles.join(', ')
    }));
  };

  public componentDidUpdate(prevProps: IWebsealTableProps) {
    const { affiliation, websealStates } = this.props;

    if (prevProps.affiliation !== affiliation) {
      this.refreshWebsealStates();
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
    this.refreshWebsealStates();
    this.handleFetchWebsealStates();
  }

  public refreshWebsealStates = () => {
    const { onFetch, affiliation } = this.props;
    onFetch(affiliation);
  };

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
      const selectedName = (selected[0] as IWebsealTableColumns).host;
      selectedWebsealState = this.state.viewItems.find(
        i => i.name === selectedName
      );
    }

    this.setState({
      selectedWebsealState
    });
  };

  public handleFetchWebsealStates = () => {
    const { websealStates } = this.props;
    const { viewItems } = this.state;

    if (JSON.stringify(viewItems) !== JSON.stringify(websealStates)) {
      this.setState({
        viewItems: websealStates,
        filteredColumns: this.websealStates()
      });
    }
  };

  public renderDetailsList = () => {
    const { filter, filteredColumns } = this.state;
    if (!(this.websealStates().length > 0)) {
      return <p>Finner ingen WebSEAL states</p>;
    }

    return (
      <div className="webseal-grid">
        <div className="table-wrapper">
          <SortableDetailsList
            columns={websealTableColumns}
            columnLength={websealTableColumns().length}
            viewItems={filteredColumns}
            selection={this.selection}
            defaultSortDirections={defaultSortDirections}
            filterView={filterWebsealView}
            filter={filter}
            isHeaderVisible={true}
          />
        </div>
      </div>
    );
  };

  public render() {
    const { className, affiliation, isFetchingWebsealStates } = this.props;
    const { selectedWebsealState, filter } = this.state;
    return (
      <div className={className}>
        <div className="body-wrapper">
          <div className="action-bar">
            <h2>WealSEAL states for {affiliation}</h2>
            <LoadingButton
              style={{ minWidth: '141px' }}
              loading={isFetchingWebsealStates}
              onClick={this.refreshWebsealStates}
              icon="Update"
            >
              Oppdater
            </LoadingButton>
          </div>
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

  .action-bar {
    display: flex;
    justify-content: space-between;
    margin: 20px 0 20px 0;
    h2 {
      margin: 0;
    }
  }

  .styled-input {
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
