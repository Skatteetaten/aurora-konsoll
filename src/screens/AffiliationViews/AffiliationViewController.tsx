import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';
import * as React from 'react';
import { Route } from 'react-router';

import Spinner from 'components/Spinner';
import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { Link } from 'react-router-dom';
import DeploymentFilterService, {
  IFilters
} from 'services/DeploymentFilterService';
import {
  ApplicationDeploymentProvider,
  withApplicationDeployments
} from './ApplicationDeploymentContext';
import { default as ApplicationDeploymentSelectorBase } from './ApplicationDeploymentSelector';
import MatrixView from './MatrixView/MatrixView';

const ApplicationDeploymentSelector = withApplicationDeployments(
  ApplicationDeploymentSelectorBase
);

interface IAffiliationViewControllerProps extends IAuroraApiComponentProps {
  affiliation: string;
  matchPath: string;
  matchUrl: string;
  updateUrlWithQuery: (query: string) => void;
}

interface IAffiliationViewControllerState {
  loading: boolean;
  isRefreshing: boolean;
  deployments: IApplicationDeployment[];
  filters: IFilters;
  filterPathUrl: string;
}

class AffiliationViewController extends React.Component<
  IAffiliationViewControllerProps,
  IAffiliationViewControllerState
> {
  public deploymentFilterService = new DeploymentFilterService();
  public state: IAffiliationViewControllerState = {
    deployments: [],
    isRefreshing: false,
    loading: false,
    filters: {
      deploymentNames: [],
      environmentNames: []
    },
    filterPathUrl: ''
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
    const { clients } = this.props;
    this.setState(() => ({
      loading: true
    }));

    const deployments = await clients.applicationDeploymentClient.findAllApplicationDeployments(
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

  public componentDidUpdate(
    prevProps: IAffiliationViewControllerProps,
    prevState: IAffiliationViewControllerState
  ) {
    const { affiliation, updateUrlWithQuery } = this.props;
    if (affiliation !== prevProps.affiliation) {
      this.setState(() => ({
        filters: {
          deploymentNames: [],
          environmentNames: []
        }
      }));
      this.fetchApplicationDeployments(affiliation);
    }

    const prevQuery = this.deploymentFilterService.toQuery(prevState.filters);
    const query = this.deploymentFilterService.toQuery(this.state.filters);

    if (prevQuery !== query && query !== '') {
      updateUrlWithQuery(query);
      this.setState(() => ({
        filterPathUrl: query
      }));
    }
  }

  public componentDidMount() {
    this.fetchApplicationDeployments(this.props.affiliation);

    const newFilters = this.deploymentFilterService.toFilter(
      window.location.search
    );

    this.setState(({ filters }) => ({
      filters: {
        deploymentNames: newFilters.deploymentNames || filters.deploymentNames,
        environmentNames:
          newFilters.environmentNames || filters.environmentNames
      }
    }));
  }

  public render() {
    const { matchPath, affiliation } = this.props;
    const {
      deployments,
      loading,
      isRefreshing,
      filterPathUrl,
      filters
    } = this.state;

    if (loading && deployments.length === 0) {
      return <Spinner />;
    }
    // tslint:disable-next-line:no-console
    console.log(deployments);
    const filteredDeployments = this.deploymentFilterService.filterDeployments(
      filters,
      deployments
    );

    const time = deployments.length > 0 ? deployments[0].time : '';

    return (
      <ApplicationDeploymentProvider
        value={{
          buildDeploymentLink: this.buildDeploymentLink,
          deployments: filteredDeployments,
          refreshDeployments: this.refreshApplicationDeployments,
          fetchApplicationDeployments: () =>
            this.fetchApplicationDeployments(affiliation),
          filterPathUrl
        }}
      >
        <Route exact={true} path={`${matchPath}/deployments`}>
          {({ match }) =>
            match && (
              <MatrixView
                time={time}
                isRefreshing={isRefreshing}
                refreshApplicationDeployments={
                  this.refreshApplicationDeployments
                }
              />
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

export const AffiliationViewControllerWithApi = withAuroraApi(
  AffiliationViewController
);

export default AffiliationViewController;
