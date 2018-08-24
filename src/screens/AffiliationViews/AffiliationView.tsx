import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Route } from 'react-router';
import { IApplicationDeployment } from 'services/AuroraApiClient/types';

import { Link } from 'react-router-dom';
import {
  ApplicationDeploymentProvider,
  withApplicationDeployments
} from './ApplicationDeploymentContext';
import { default as ApplicationDeploymentSelectorBase } from './ApplicationDeploymentSelector';
import { default as MatrixBase } from './MatrixView/Matrix';

const Matrix = withApplicationDeployments(MatrixBase);
const ApplicationDeploymentSelector = withApplicationDeployments(
  ApplicationDeploymentSelectorBase
);

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

  public buildDeploymentLink = (
    deployment: IApplicationDeployment
  ): React.StatelessComponent => {
    const { match } = this.props;
    return ({ children }) => (
      <Link to={`${match.url}/deployments/${deployment.id}`}>{children}</Link>
    );
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
    const { deployments, loading } = this.state;

    if (loading) {
      return <p>Loading</p>;
    }

    return (
      <ApplicationDeploymentProvider
        value={{
          buildDeploymentLink: this.buildDeploymentLink,
          deployments
        }}
      >
        <Route
          exact={true}
          path={`${match.path}/deployments`}
          component={Matrix}
        />
        <Route
          path={`${match.path}/deployments/:applicationDeploymentId`}
          component={ApplicationDeploymentSelector}
        />
      </ApplicationDeploymentProvider>
    );
  }
}

export const AffiliationViewControllerWithApi = withAuroraApi(
  AffiliationViewController
);

export default AffiliationViewController;
