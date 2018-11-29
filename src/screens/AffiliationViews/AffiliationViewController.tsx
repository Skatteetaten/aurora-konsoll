import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';
import * as React from 'react';
import { Route } from 'react-router';

import Spinner from 'components/Spinner';
import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { errorStateManager } from 'models/StateManager/ErrorStateManager';
import { IApplicationDeploymentFilters } from 'models/UserSettings';
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
  filter: IFilter;
  allFilters: IApplicationDeploymentFilters[];
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
    filter: {
      applications: [],
      environments: []
    },
    allFilters: [],
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

  public fetchApplicationDeploymentFilters = async () => {
    const { clients } = this.props;
    const filters = await clients.userSettingsClient.getUserSettings();
    this.setState({
      allFilters: filters.applicationDeploymentFilters
    });
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
      this.fetchApplicationDeployments(affiliation).then(() => {
        this.setState({
          filter: {
            applications: [],
            environments: []
          }
        });
      });
    }

    const prevQuery = deploymentFilterService.toQuery(prevState.filter);
    const query = deploymentFilterService.toQuery(this.state.filter);

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
    this.fetchApplicationDeploymentFilters();

    const newFilters = deploymentFilterService.toFilter(window.location.search);
    this.setState(({ filter }) => ({
      filter: {
        applications: newFilters.applications || filter.applications,
        environments: newFilters.environments || filter.environments
      }
    }));
  }

  public updateFilter = async (filter: IFilter) => {
    const { affiliation, clients, updateUrlWithQuery } = this.props;
    const { allFilters } = this.state;
    const updatedFilters = allFilters.filter(f => f.name !== filter.name);

    if (filter.name) {
      updatedFilters.push({
        affiliation,
        name: filter.name,
        applications: filter.applications,
        environments: filter.environments
      });
      const response = await clients.userSettingsClient.updateUserSettings({
        applicationDeploymentFilters: updatedFilters
      });

      if (response) {
        this.setState({
          filter,
          allFilters: updatedFilters
        });
      } else {
        errorStateManager.addError(new Error('Feil ved lagring av filter'));
      }
    }

    if (filter.applications.length === 0 && filter.environments.length === 0) {
      updateUrlWithQuery('/');
    }

    this.setState({
      filter
    });
  };

  public render() {
    const { matchPath, affiliation, deploymentFilterService } = this.props;
    const {
      deployments,
      loading,
      isRefreshing,
      filterPathUrl,
      filter,
      allFilters
    } = this.state;

    if (loading && deployments.length === 0) {
      return <Spinner />;
    }

    const filteredDeployments = deploymentFilterService.filterDeployments(
      filter,
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
                allDeployments={deployments}
                filters={filter}
                allFilters={allFilters}
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
