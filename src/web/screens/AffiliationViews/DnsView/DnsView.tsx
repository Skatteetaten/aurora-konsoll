import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import LoadingButton from 'web/components/LoadingButton';
import DnsTable from './Table/DnsTable';
import { Azure, OnPrem } from 'web/services/auroraApiClients/dnsClient/query';
import Spinner from '@skatteetaten/frontend-components/Spinner';
import TextField from '@skatteetaten/frontend-components/TextField';

export type cnameTypes =
  | { items: OnPrem[]; type: 'onPrem' }
  | { items: Azure[]; type: 'azure' };

interface props {
  affiliation: string;
  className?: string;
  isFetching: boolean;
  onFetch: (affiliation: string) => void;
  cnames: cnameTypes;
}

const DnsView = ({
  affiliation,
  className,
  cnames,
  onFetch,
  isFetching,
}: props) => {
  const [filter, setFilter] = useState('');
  return (
    <div className={className}>
      <div className="body-wrapper">
        <div className="action-bar">
          <TextField
            placeholder="Søk etter CName"
            onChange={(_, val) => setFilter(val || '')}
            value={filter}
            style={{ width: '300px' }}
          />
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
          <DnsTable cnames={cnames} filter={filter} />
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
