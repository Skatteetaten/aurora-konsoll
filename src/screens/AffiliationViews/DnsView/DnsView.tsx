import LoadingButton from 'components/LoadingButton';
import * as React from 'react';
import DnsTable from './DnsTable';
import styled from 'styled-components';
import { DnsRawEntry } from 'services/auroraApiClients/dnsClient/query';
import Spinner from '@skatteetaten/frontend-components/Spinner';

interface props {
  affiliation: string;
  className?: string;
  loading: boolean;
  dnsEntries: DnsRawEntry[];
  onFetch: (affiliation: string) => void;
}

const DnsView = ({
  affiliation,
  className,
  onFetch,
  dnsEntries,
  loading,
}: props) => {
  React.useEffect(() => {
    onFetch('');
  }, [affiliation, onFetch]);

  return (
    <div className={className}>
      <div className="body-wrapper">
        <div className="action-bar">
          <h2>DNS entires for {affiliation}</h2>
          <LoadingButton
            style={{ minWidth: '141px' }}
            icon="Update"
            loading={loading}
            onClick={() => onFetch('aurora')}
          >
            Oppdater
          </LoadingButton>
        </div>
        {loading ? (
          <Spinner size={Spinner.Size.large} />
        ) : (
          <DnsTable dnsEntries={dnsEntries} />
        )}
      </div>
    </div>
  );
};

export default styled(DnsView)`
  max-height: 100%;

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
`;
