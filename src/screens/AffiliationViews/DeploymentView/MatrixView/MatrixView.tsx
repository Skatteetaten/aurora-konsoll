import React from 'react';
import styled from 'styled-components';

import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { IApplicationDeploymentFilters } from 'models/UserSettings';
import { IFilter } from 'services/DeploymentFilterService';
import Matrix from './Matrix';
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
}

export const MatrixView = ({
  showSemanticVersion,
  deployments,
  ...actionBarProps
}: IMatrixViewProps) => {
  const [expandApplicationName, setExpandApplicationName] = React.useState(
    true
  );

  return (
    <Wrapper>
      <ActionBar
        {...actionBarProps}
        showSemanticVersion={showSemanticVersion}
        expandApplicationName={expandApplicationName}
        setExpandApplicationName={setExpandApplicationName}
      />
      <Matrix
        deployments={deployments}
        showSemanticVersion={showSemanticVersion}
        expandApplicationName={expandApplicationName}
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
