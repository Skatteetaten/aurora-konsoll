import * as React from 'react';

import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';

interface IFilterProps extends IAuroraApiComponentProps {
  affiliation: string;
}

// interface IFilterState {}

class Filter extends React.Component<IFilterProps, {}> {
  public getUserSettings = async () => {
    const userSettings = await this.props.clients.userSettingsClient.getUserSettings();
    // tslint:disable-next-line:no-console
    console.log(userSettings);
  };

  public render() {
    return <button onClick={this.getUserSettings}>Get userSettings</button>;
  }
}

export const FilterWithApi = withAuroraApi(Filter);
