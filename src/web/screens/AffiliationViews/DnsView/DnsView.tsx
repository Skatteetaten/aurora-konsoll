import React, { useState } from 'react';
import styled from 'styled-components';

import LoadingButton from 'web/components/LoadingButton';
import DnsTable from './Table/DnsTable';
import Spinner from '@skatteetaten/frontend-components/Spinner';
import TextField from '@skatteetaten/frontend-components/TextField';
import { IntegrationDisabledInformation } from './components/IntegrationDisabledInformation';
import { AzureData, OnPremData } from 'web/store/state/dns/reducer';

interface props {
  affiliation: string;
  className?: string;
  isFetching: boolean;
  onFetch: (affiliation: string) => void;
  items?: AzureData[] | OnPremData[];
  type: 'onPrem' | 'azure';
}

const DnsView = ({
  affiliation,
  className,
  items,
  type,
  onFetch,
  isFetching,
}: props) => {
  const [filter, setFilter] = useState('');

  const renderContent = () => {
    if (isFetching) {
      return <Spinner size={Spinner.Size.large} />;
    } else if (items) {
      return <DnsTable items={items} type={type} filter={filter} />;
    } else {
      return <IntegrationDisabledInformation type={type} />;
    }
  };

  return (
    <div className={className}>
      <div className="body-wrapper">
        <div className="action-bar">
          <TextField
            placeholder="Søk etter DNS entries"
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
        {renderContent()}
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
