import * as React from 'react';
import styled from 'styled-components';

import TextField from '@skatteetaten/frontend-components/TextField';

import LoadingButton from 'components/LoadingButton';
import Spinner from 'components/Spinner';
import { ICertificateResult, ICertificateView } from 'models/certificates';
import CertificateService from 'services/CertificateService';
import Table from './Table';

interface ICertificateProps {
  className?: string;
  isFetching: boolean;
  certificates: ICertificateResult;
  onFetch: () => void;
}

interface ICertificateState {
  filter: string;
  viewItems: ICertificateView[];
}

const certificateService = new CertificateService();

class CertificateBase extends React.Component<
  ICertificateProps,
  ICertificateState
> {
  public state = {
    filter: '',
    viewItems: []
  };

  public componentDidMount() {
    this.refreshCertificates();
  }

  public componentDidUpdate(prevProps: ICertificateProps) {
    const { certificates } = this.props;
    if (prevProps.certificates !== certificates) {
      this.handleFetchCertificates();
    }
  }

  public handleFetchCertificates = (): void => {
    const { certificates } = this.props;
    const { updatedItems } = certificateService;
    let viewItems: ICertificateView[];

    if (updatedItems(certificates).length > 0) {
      viewItems = updatedItems(certificates);
    } else {
      viewItems = [];
    }
    this.setState({
      viewItems
    });
  };

  public refreshCertificates = () => {
    const { onFetch } = this.props;
    onFetch();
  };

  public render() {
    const { className, isFetching } = this.props;
    const { filter, viewItems } = this.state;
    return (
      <div className={className}>
        <div className="body-wrapper">
          <div className="action-bar">
            <h2>Sertifikater</h2>
            <LoadingButton
              style={{ minWidth: '141px' }}
              loading={isFetching}
              onClick={this.refreshCertificates}
              icon="Update"
            >
              Oppdater
            </LoadingButton>
          </div>
          <div className="styled-input">
            <TextField
              placeholder="Søk etter sertifikat"
              value={filter}
              onChange={this.onFilterChange}
            />
          </div>
          <div className="certificate-grid">
            <div className="table-wrapper">
              {isFetching ? (
                <Spinner />
              ) : (
                <Table
                  certificateService={certificateService}
                  viewItems={viewItems}
                  filter={filter}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private onFilterChange = (e: Event, text: string): void => {
    this.setState({
      filter: text
    });
  };
}

export const Certificate = styled(CertificateBase)`
  max-height: 100%;
  overflow-x: auto;

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

  .body-wrapper {
    padding: 0 10px;
  }

  .table-wrapper {
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
