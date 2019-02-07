import * as React from 'react';
import styled from 'styled-components';

import Checkbox from 'aurora-frontend-react-komponenter/Checkbox';

import LoadingButton from 'components/LoadingButton';
import TimeSince from 'components/TimeSince';

import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { IApplicationDeploymentFilters } from 'models/UserSettings';
import { IFilter } from 'services/DeploymentFilterService';
import withApplicationDeployments from '../ApplicationDeploymentContext';
import Filter from './Filter/Filter';
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
  deleteFilter: (filterName: string) => void;
  showSemanticVersion: boolean;
  toggleShowSemanticVersion: () => void;
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
  allFilters,
  deleteFilter,
  showSemanticVersion: showExactVersion,
  toggleShowSemanticVersion: toggleShowExactVersion
}: IMatrixViewProps) => (
  <div className={className}>
    <ActionBar>
      <StyledFilter>
        <Filter
          affiliation={affiliation}
          updateFilter={updateFilter}
          deleteFilter={deleteFilter}
          allDeployments={allDeployments}
          filters={filters}
          allFilters={allFilters}
        />
        <Checkbox
          boxSide={'start'}
          label="Vis sematisk versjon"
          checked={showExactVersion}
          onChange={toggleShowExactVersion}
          className="versionCheckbox"
        />
      </StyledFilter>
      <StyledUpdate>
        <TimeSince timeSince={time} />
        <LoadingButton
          style={{ minWidth: '120px' }}
          loading={isRefreshing}
          onClick={refreshApplicationDeployments}
        >
          Oppdater
        </LoadingButton>
      </StyledUpdate>
    </ActionBar>
    <Matrix showSemanticVersion={showExactVersion} />
  </div>
);

const ActionBar = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  height: 40px;
`;

const StyledFilter = styled.div`
  display: flex;
  align-items: center;
  button {
    margin-right: 20px;
  }

  .versionCheckbox {
    margin-left: 30px;
  }
`;

const StyledUpdate = styled.div`
  display: flex;
  align-items: center;
`;

export default styled(MatrixView)`
  display: flex;
  flex-direction: column;
  max-height: 100%;
`;
