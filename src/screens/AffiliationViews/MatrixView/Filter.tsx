import * as React from 'react';

import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';

interface IFilterProps extends IAuroraApiComponentProps {
  affiliation: string;
  updateFilter: (applications: string[], environments: string[]) => void;
}

interface IFilterState {
  applications: string[];
  environments: string[];
}

class Filter extends React.Component<IFilterProps, IFilterState> {
  public getUserSettings = async () => {
    const { clients, updateFilter } = this.props;
    const result = await clients.userSettingsClient.getUserSettings();
    updateFilter(
      result.userSettings.applicationDeploymentFilters[0].applications,
      result.userSettings.applicationDeploymentFilters[0].environments
    );
  };

  public render() {
    return <button onClick={this.getUserSettings}>Get userSettings</button>;
  }
}

export const FilterWithApi = withAuroraApi(Filter);
