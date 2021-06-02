import LoadingButton from 'components/LoadingButton';
import React, { useEffect } from 'react';
import DnsTable from './DnsTable';
import styled from 'styled-components';
import Spinner from '@skatteetaten/frontend-components/Spinner';
import { CnameInfo } from 'services/auroraApiClients/dnsClient/query';

interface props {
  affiliation: string;
  className?: string;
  isFetching: boolean;
  cnameInfos?: CnameInfo[];
  onFetch: (affiliation: string) => void;
}

const DnsView = ({
  affiliation,
  className,
  onFetch,
  cnameInfos,
  isFetching,
}: props) => {
  useEffect(() => {
    onFetch(affiliation);
  }, [affiliation, onFetch]);

  return (
    <div className={className}>
      <div className="body-wrapper">
        <div className="action-bar">
          <h2>DNS entries for {affiliation}</h2>
          <LoadingButton
            style={{ minWidth: '141px' }}
            icon="Update"
            loading={isFetching}
            onClick={() => onFetch(affiliation)}
          >
            Oppdater
          </LoadingButton>
        </div>
        {isFetching ? (
          <Spinner size={Spinner.Size.large} />
        ) : (
          <DnsTable cnameInfos={cnameInfos} />
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
