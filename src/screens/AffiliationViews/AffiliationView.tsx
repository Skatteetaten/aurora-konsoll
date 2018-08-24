import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';
import * as React from 'react';
import { Route } from 'react-router';
import { IApplicationDeployment } from 'services/AuroraApiClient/types';
import { ApplicationDeploymentProvider } from './ApplicationDeploymentContext';
import Matrix from './MatrixView/Matrix';

import { RouteComponentProps } from 'react-router';

export type AffiliationRouteProps = RouteComponentProps<{
  affiliation: string;
}>;

type AffiliationViewControllerProps = IAuroraApiComponentProps &
  AffiliationRouteProps;

interface IAffiliationViewControllerState {
  loading: boolean;
  deployments: IApplicationDeployment[];
}

class AffiliationViewController extends React.Component<
  AffiliationViewControllerProps,
  IAffiliationViewControllerState
> {
  public state: IAffiliationViewControllerState = {
    deployments: [],
    loading: false
  };

  public fetchApplicationDeployments = async (affiliation: string) => {
    this.setState(() => ({
      loading: true
    }));

    const deployments = await this.props.clients.apiClient.findAllApplicationDeployments(
      [affiliation]
    );

    this.setState(() => ({
      deployments,
      loading: false
    }));
  };

  public componentDidMount() {
    const { match } = this.props;
    this.fetchApplicationDeployments(match.params.affiliation);
  }

  public render() {
    const { match } = this.props;
    const { deployments } = this.state;
    return (
      <ApplicationDeploymentProvider value={{ deployments }}>
        <Route path={`${match.path}/deployments`} component={Matrix} />
      </ApplicationDeploymentProvider>
    );
  }
}

export const AffiliationViewControllerWithApi = withAuroraApi(
  AffiliationViewController
);

export default AffiliationViewController;
