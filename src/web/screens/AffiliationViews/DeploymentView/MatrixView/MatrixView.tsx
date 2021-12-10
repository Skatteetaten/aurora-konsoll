import React, { useState } from 'react';
import styled from 'styled-components';

import { IApplicationDeployment } from 'web/models/ApplicationDeployment';
import { IApplicationDeploymentFilters } from 'web/models/UserSettings';
import { IFilter } from 'web/services/DeploymentFilterService';
import { Matrix } from './Matrix';
import { ActionBar } from './ActionBar';

interface IMatrixViewProps {
  time: string;
  isRefreshing: boolean;
  refreshApplicationDeployments: () => void;
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
  isFetching: boolean;
}

export const MatrixView = ({
  showSemanticVersion,
  deployments,
  isFetching,
  ...actionBarProps
}: IMatrixViewProps) => {
  const [expandApplicationName, setExpandApplicationName] = useState(true);
  const [sortBySizeAndAlphabetical, setSortBySizeAndAlphabetical] =
    useState(true);

  return (
    <Wrapper>
      <ActionBar
        {...actionBarProps}
        showSemanticVersion={showSemanticVersion}
        expandApplicationName={expandApplicationName}
        setExpandApplicationName={setExpandApplicationName}
        sortBySizeAndAlphabetical={sortBySizeAndAlphabetical}
        setSortBySizeAndAlphabetical={setSortBySizeAndAlphabetical}
      />
      <Matrix
        isFetching={isFetching}
        deployments={deployments}
        showSemanticVersion={showSemanticVersion}
        expandApplicationName={expandApplicationName}
        sortBySizeAndAlphabetical={sortBySizeAndAlphabetical}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
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
