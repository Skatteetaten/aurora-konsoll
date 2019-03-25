import * as React from 'react';
import styled from 'styled-components';

import TextField from 'aurora-frontend-react-komponenter/TextField';

import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';
import { ICertificateView } from 'models/certificates';
import CertificateService, {
  defaultSortDirections
} from 'services/CertificateService';
import { SortDirection } from 'services/DatabaseSchemaService';
import { mockData } from './mockData';
import Table from './Table';

export interface ICertificateProps extends IAuroraApiComponentProps {
  className?: string;
}

export interface ICertificateState {
  filter: string;
  viewItems: ICertificateView[];
  columnSortDirections: SortDirection[];
  selectedColumnIndex: number;
}

const certificateService = new CertificateService();

export default class Certificate extends React.Component<
  ICertificateProps,
  ICertificateState
> {
  public state = {
    filter: '',
    columnSortDirections: defaultSortDirections,
    viewItems: [],
    selectedColumnIndex: -1
  };

  public componentDidMount() {
    this.handleFetchCertificates();
  }

  public handleFetchCertificates = (): void => {
    const { updatedItems } = certificateService;
    let viewItems: ICertificateView[];

    if (updatedItems(mockData).length > 0) {
      viewItems = updatedItems(mockData);
    } else {
      viewItems = [];
    }
    this.setState({
      viewItems
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

    if (certificateService.sortNextAscending(prevSortDirection)) {
      newSortDirections[column.key] = SortDirection.ASC;
    } else if (prevSortDirection === SortDirection.ASC) {
      newSortDirections[column.key] = SortDirection.DESC;
    }

    const sortedItems = certificateService.sortItems(
      this.state.viewItems,
      prevSortDirection,
      name
    );
    this.setState({
      viewItems: sortedItems,
      columnSortDirections: newSortDirections,
      selectedColumnIndex: column.key
    });
  };

  public render() {
    const { className } = this.props;
    const {
      filter,
      columnSortDirections,
      selectedColumnIndex,
      viewItems
    } = this.state;
    return (
      <div className={className}>
        <div className="body-wrapper">
          <h2>Sertifikater</h2>
          <div className="styled-input">
            <TextField
              placeholder="Søk etter sertifikat"
              value={filter}
              onChanged={this.onFilterChange}
            />
          </div>
          <div className="certificate-grid">
            <div className="table-wrapper">
              <Table
                items={certificateService.filteredItems(filter, viewItems)}
                onColumnHeaderClick={this.sortByColumn}
                certificateService={certificateService}
                columnSortDirections={columnSortDirections}
                selectedColumnIndex={selectedColumnIndex}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  private onFilterChange = (text: string): void => {
    this.setState({
      filter: text
    });
  };
}

const StyledCertificate = styled(Certificate)`
  max-height: 100%;
  overflow-x: auto;

  .styled-input {
    width: 300px;
  }

  .body-wrapper {
    padding: 0 10px;
  }

  .table-wrapper {
    grid-area: table;
    margin: 20px 0 0 0;
    grid-area: table;
    i {
      float: right;
    }
  }

  .certificate-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    grid-template-areas:
      'content .'
      'card .'
      'table .';
  }
`;

export const CertificateWithApi = withAuroraApi(StyledCertificate);
