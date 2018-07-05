import * as React from 'react';

import { IAuroraApiComponentProps } from 'components/AuroraApi';
import withAuroraApi from 'components/auroraApi/withAuroraApi';

class Home extends React.Component<IAuroraApiComponentProps> {
  public async componentDidMount() {
    const { clients } = this.props;
    if (!clients) {
      return;
    }

    const result = await clients.apiClient.findUserAndAffiliations();
    // tslint:disable-next-line:no-console
    console.log(result);
  }
  public render() {
    return <h1>Hello</h1>;
  }
}

export default withAuroraApi(Home);
