import React from 'react';
import styled from 'styled-components';

import Checkbox from 'aurora-frontend-react-komponenter/Checkbox';

import LoadingButton from 'components/LoadingButton';
import TimeSince from 'components/TimeSince';

import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { IApplicationDeploymentFilters } from 'models/UserSettings';
import { IFilter } from 'services/DeploymentFilterService';
import { styledFilterConnected as Filter } from './Filter/Filter';
import Matrix from './Matrix';
import TextField from 'aurora-frontend-react-komponenter/TextField';

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
  quickFilter: string;
  updateQuickFilter: (filter: string) => void;
  deployments: IApplicationDeployment[];
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
  showSemanticVersion,
  toggleShowSemanticVersion,
  quickFilter,
  updateQuickFilter,
  deployments
}: IMatrixViewProps) => {
  const [expandApplicationName, setExpandApplicationName] = React.useState(
    true
  );

  const filterChange = (
    ev: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>,
    filter?: string
  ) => {
    if (filter !== undefined) {
      updateQuickFilter(filter);
    }
  };

  return (
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
          <div style={{ marginLeft: '15px' }}>
            <TextField
              id="quick-filter"
              placeholder="Filtrer applikasjoner"
              onChange={filterChange}
              value={quickFilter}
            />
          </div>
          <Checkbox
            boxSide={'start'}
            label="Vis semantisk versjon"
            checked={showSemanticVersion}
            onChange={toggleShowSemanticVersion}
            className="versionCheckbox"
          />
          <Checkbox
            boxSide={'start'}
            label="Vis hele applikasjonsnavnet"
            checked={expandApplicationName}
            onChange={() => setExpandApplicationName(!expandApplicationName)}
            className="versionCheckbox"
          />
        </StyledFilter>
        <StyledUpdate>
          <TimeSince timeSince={time} />
          <LoadingButton
            style={{ minWidth: '141px' }}
            loading={isRefreshing}
            onClick={refreshApplicationDeployments}
            icon="Update"
          >
            Oppdater
          </LoadingButton>
        </StyledUpdate>
      </ActionBar>
      <Matrix
        deployments={deployments}
        showSemanticVersion={showSemanticVersion}
        expandApplicationName={expandApplicationName}
      />
    </div>
  );
};

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

  .ms-TextField-fieldGroup {
    border-color: #ccc !important;
    border-width: 1px;
    height: 38px;

    input::placeholder {
      color: #808080;
    }
  }
`;
