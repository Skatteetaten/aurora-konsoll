import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';
import * as React from 'react';
import { Route } from 'react-router';

import LoadingButton from 'components/LoadingButton';
import Spinner from 'components/Spinner';
import TimeSince from 'components/TimeSince';
import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
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

interface IAffiliationViewControllerProps extends IAuroraApiComponentProps {
  affiliation: string;
  matchPath: string;
  matchUrl: string;
}

interface IAffiliationViewControllerState {
  loading: boolean;
  isRefreshing: boolean;
  deployments: IApplicationDeployment[];
}

class AffiliationViewController extends React.Component<
  IAffiliationViewControllerProps,
  IAffiliationViewControllerState
> {
  public state: IAffiliationViewControllerState = {
    deployments: [],
    isRefreshing: false,
    loading: false
  };

  public buildDeploymentLink = (
    deployment: IApplicationDeployment
  ): React.StatelessComponent => {
    const { matchUrl } = this.props;
    return ({ children }) => (
      <Link to={`${matchUrl}/deployments/${deployment.id}/info`}>
        {children}
      </Link>
    );
  };

  public fetchApplicationDeployments = async (affiliation: string) => {
    this.setState(() => ({
      loading: true
    }));

    const deployments = await this.props.clients.applicationDeploymentClient.findAllApplicationDeployments(
      [affiliation]
    );

    this.setState(() => ({
      deployments,
      loading: false
    }));
  };

  public refreshApplicationDeployments = async () => {
    const { affiliation, clients } = this.props;
    this.setState({
      isRefreshing: true
    });
    await clients.applicationDeploymentClient.refreshAffiliations([
      affiliation
    ]);
    await this.fetchApplicationDeployments(affiliation);
    this.setState({
      isRefreshing: false
    });
  };

  public componentDidUpdate(prevProps: IAffiliationViewControllerProps) {
    if (this.props.affiliation !== prevProps.affiliation) {
      this.fetchApplicationDeployments(this.props.affiliation);
    }
  }

  public componentDidMount() {
    this.fetchApplicationDeployments(this.props.affiliation);
  }

  public render() {
    const { matchPath, affiliation } = this.props;
    const { deployments, loading } = this.state;

    if (loading && deployments.length === 0) {
      return <Spinner />;
    }

    const time = deployments.length > 0 ? deployments[0].time : '';

    return (
      <ApplicationDeploymentProvider
        value={{
          buildDeploymentLink: this.buildDeploymentLink,
          deployments,
          refreshDeployents: this.refreshApplicationDeployments,
          fetchApplicationDeployments: () =>
            this.fetchApplicationDeployments(affiliation)
        }}
      >
        <Route exact={true} path={`${matchPath}/deployments`}>
          {({ match }) =>
            match && (
              <>
                <ActionBar>
                  <TimeSince timeSince={time} />
                  <LoadingButton
                    style={{ minWidth: '120px' }}
                    loading={this.state.isRefreshing}
                    onClick={this.refreshApplicationDeployments}
                  >
                    Oppdater
                  </LoadingButton>
                </ActionBar>
                <Matrix />
              </>
            )
          }
        </Route>
        <Route
          path={`${matchPath}/deployments/:applicationDeploymentId`}
          component={ApplicationDeploymentSelector}
        />
      </ApplicationDeploymentProvider>
    );
  }
}

const ActionBar = styled.div`
  display: flex;
  padding: 15px 10px;
  align-items: center;
  justify-content: flex-end;

  button {
    min-width: 120px;
  }
`;

export const AffiliationViewControllerWithApi = withAuroraApi(
  AffiliationViewController
);

export default AffiliationViewController;
