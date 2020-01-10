import React from 'react';
import styled from 'styled-components';
import Checkbox from '@skatteetaten/frontend-components/CheckBox';
import TextField from '@skatteetaten/frontend-components/TextField';

import LoadingButton from 'components/LoadingButton';
import TimeSince from 'components/TimeSince';

import { styledFilterConnected as Filter } from './components/Filter/Filter';
import { IFilter } from 'services/DeploymentFilterService';
import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { IApplicationDeploymentFilters } from 'models/UserSettings';
import { TextFieldEvent } from 'types/react';

interface IActionBarProps {
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
  expandApplicationName: boolean;
  setExpandApplicationName: (expand: boolean) => void;
}

export const ActionBar: React.FC<IActionBarProps> = ({
  affiliation,
  updateQuickFilter,
  updateFilter,
  deleteFilter,
  allDeployments,
  filters,
  allFilters,
  quickFilter,
  showSemanticVersion,
  toggleShowSemanticVersion,
  isRefreshing,
  time,
  refreshApplicationDeployments,
  expandApplicationName,
  setExpandApplicationName
}) => {
  const filterChange = (ev: TextFieldEvent, filter?: string) => {
    if (filter !== undefined) {
      updateQuickFilter(filter);
    }
  };

  return (
    <Wrapper>
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
    </Wrapper>
  );
};

const Wrapper = styled.div`
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
