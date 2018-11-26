import * as React from 'react';
import styled from 'styled-components';

import LoadingButton from 'components/LoadingButton';
import TimeSince from 'components/TimeSince';

import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { IApplicationDeploymentFilters } from 'models/UserSettings';
import { IFilter } from 'services/DeploymentFilterService';
import withApplicationDeployments from '../ApplicationDeploymentContext';
import FilterWithApi from './Filter';
import { default as MatrixBase } from './Matrix';

const Matrix = withApplicationDeployments(MatrixBase);

interface IMatrixViewProps {
  time: string;
  isRefreshing: boolean;
  refreshApplicationDeployments: () => void;
  className?: string;
  affiliation: string;
  updateFilter: (filter: IFilter) => void;
  allDeployments: IApplicationDeployment[];
  filters: IFilter;
  allFilters: IApplicationDeploymentFilters[];
}

const MatrixView = ({
  className,
  isRefreshing,
  refreshApplicationDeployments,
  time,
  affiliation,
  updateFilter,
  allDeployments,
  filters,
  allFilters
}: IMatrixViewProps) => (
  <div className={className}>
    <ActionBar>
      <FilterWithApi
        affiliation={affiliation}
        updateFilter={updateFilter}
        allDeployments={allDeployments}
        filters={filters}
        allFilters={allFilters}
      />
      <TimeSince timeSince={time} />
      <LoadingButton
        style={{ minWidth: '120px' }}
        loading={isRefreshing}
        onClick={refreshApplicationDeployments}
      >
        Oppdater
      </LoadingButton>
    </ActionBar>
    <Matrix />
  </div>
);

const ActionBar = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  height: 40px;

  button {
    min-width: 120px;
  }
`;

export default styled(MatrixView)`
  display: flex;
  flex-direction: column;
  max-height: 100%;
`;
