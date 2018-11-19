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
    const userSettings = await this.props.clients.userSettingsClient.getUserSettings();
    // tslint:disable-next-line:no-console
    console.log(userSettings.applicationDeploymentFilters);

    // tslint:disable-next-line:no-debugger
    debugger;
 
    //   this.props.updateFilter(userSettings.applicationDeploymentFilters[0].applications,
  //    userSettings.applicationDeploymentFilters[0].environments)

    // tslint:disable-next-line:no-console
    console.log(userSettings);
  };

  public render() {
    return <button onClick={this.getUserSettings}>Get userSettings</button>;
  }
}

export const FilterWithApi = withAuroraApi(Filter);
