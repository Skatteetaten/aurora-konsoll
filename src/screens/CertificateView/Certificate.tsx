import * as React from 'react';
import styled from 'styled-components';

import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';
import Table from './Table';

export interface ICertificateProps extends IAuroraApiComponentProps {
  className?: string;
}

export default class Certificate extends React.Component<
  ICertificateProps,
  {}
> {
  public state = {};

  public render() {
    const { className } = this.props;
    return (
      <div className={className}>
        <div className="body-wrapper">
          <h2>Sertifikater</h2>
          <div className="certificate-grid">
            <div className="table-wrapper">
              <Table />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const StyledCertificate = styled(Certificate)`
  max-height: 100%;
  overflow-x: auto;

  .body-wrapper {
    padding: 0 10px;
  }

  .table-wrapper {
    grid-area: table;
    margin: 20px 0 0 0;
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
