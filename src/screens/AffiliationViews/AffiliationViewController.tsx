import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';
import * as React from 'react';
import { Route } from 'react-router';

import Spinner from 'components/Spinner';
import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { Link } from 'react-router-dom';
import DeploymentFilterService, {
  IFilter
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
  deploymentFilterService: DeploymentFilterService;
}

interface IAffiliationViewControllerState {
  loading: boolean;
  isRefreshing: boolean;
  deployments: IApplicationDeployment[];
  filters: IFilter;
  filterPathUrl: string;
}

class AffiliationViewController extends React.Component<
  IAffiliationViewControllerProps,
  IAffiliationViewControllerState
> {
  public state: IAffiliationViewControllerState = {
    deployments: [],
    isRefreshing: false,
    loading: false,
    filters: {
      applications: [],
      environments: []
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
    const {
      affiliation,
      updateUrlWithQuery,
      deploymentFilterService
    } = this.props;
    if (affiliation !== prevProps.affiliation) {
      this.setState(() => ({
        filters: {
          applications: [],
          environments: []
        }
      }));
      this.fetchApplicationDeployments(affiliation);
    }

    const prevQuery = deploymentFilterService.toQuery(prevState.filters);
    const query = deploymentFilterService.toQuery(this.state.filters);

    if (prevQuery !== query && query !== '') {
      updateUrlWithQuery(query);
      this.setState(() => ({
        filterPathUrl: query
      }));
    }
  }

  public componentDidMount() {
    const { affiliation, deploymentFilterService } = this.props;
    this.fetchApplicationDeployments(affiliation);

    const newFilters = deploymentFilterService.toFilter(window.location.search);

    this.setState(({ filters }) => ({
      filters: {
        applications: newFilters.applications || filters.applications,
        environments: newFilters.environments || filters.environments
      }
    }));
  }

  public updateFilter = (applications: string[], environments: string[]) => {
    this.setState({
      filters: {
        applications,
        environments
      }
    });
  };

  public render() {
    const { matchPath, affiliation, deploymentFilterService } = this.props;
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

    const filteredDeployments = deploymentFilterService.filterDeployments(
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
                affiliation={affiliation}
                updateFilter={this.updateFilter}
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
