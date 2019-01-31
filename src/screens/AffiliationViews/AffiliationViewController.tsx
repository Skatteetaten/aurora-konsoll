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
}

interface IAffiliationViewControllerState {
  loading: boolean;
  isRefreshing: boolean;
  deployments: IApplicationDeployment[];
  filter: IFilter;
  allFilters: IApplicationDeploymentFilters[];
  filterPathUrl: string;
  showExactVersion: boolean;
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
    filterPathUrl: '',
    showExactVersion: false
  };

  private deploymentFilterService = new DeploymentFilterService();

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

  public fetchApplicationDeploymentFilters = async (paramsExists: any) => {
    const { clients, affiliation } = this.props;
    const filters = await clients.userSettingsClient.getUserSettings();
    if (filters) {
      this.setState({
        allFilters: filters.applicationDeploymentFilters
      });

      const filter = filters.applicationDeploymentFilters.find(
        f => f.affiliation === affiliation && f.default === true
      );
      if (filter && !paramsExists) {
        this.setState({
          filter: {
            applications: filter.applications,
            environments: filter.environments
          }
        });
      }
    }
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

  public clearFilterOnAffiliationChange(prevAffiliation: string) {
    const { affiliation } = this.props;
    const { allFilters } = this.state;
    if (affiliation !== prevAffiliation) {
      this.fetchApplicationDeployments(affiliation).then(() => {
        const defaultFilter = this.deploymentFilterService.findDefaultFilter(
          allFilters,
          affiliation
        );
        if (defaultFilter) {
          this.setState({
            filter: {
              applications: defaultFilter.applications,
              environments: defaultFilter.environments
            }
          });
        } else {
          this.setState({
            filter: {
              applications: [],
              environments: []
            }
          });
        }
      });
    }
  }
  public updateQueryOnNewParams(prevFilter: IFilter) {
    const { updateUrlWithQuery } = this.props;
    const { filter } = this.state;
    const prevQuery = this.deploymentFilterService.toQuery(prevFilter);
    const query = this.deploymentFilterService.toQuery(filter);

    if (prevQuery !== query && query !== '') {
      updateUrlWithQuery(query);
      this.setState(() => ({
        filterPathUrl: query
      }));
    }
  }

  public componentDidUpdate(
    prevProps: IAffiliationViewControllerProps,
    prevState: IAffiliationViewControllerState
  ) {
    this.clearFilterOnAffiliationChange(prevProps.affiliation);
    this.updateQueryOnNewParams(prevState.filter);
  }

  public componentDidMount() {
    const { affiliation } = this.props;
    const paramsExists = this.deploymentFilterService.isParamsDefined(
      window.location.search
    );
    this.fetchApplicationDeployments(affiliation);
    this.fetchApplicationDeploymentFilters(paramsExists);

    const newFilters = this.deploymentFilterService.toFilter(
      window.location.search
    );
    this.setState(({ filter }) => ({
      filter: {
        applications: newFilters.applications || filter.applications,
        environments: newFilters.environments || filter.environments
      }
    }));
  }

  public deleteFilter = async (filterName: string) => {
    const { affiliation, clients } = this.props;
    const { allFilters } = this.state;
    const updatedFilters = this.deploymentFilterService.getOtherNonDefaultFilters(
      allFilters,
      affiliation,
      { name: filterName, applications: [], environments: [], default: false }
    );
    if (filterName) {
      const response = await clients.userSettingsClient.updateUserSettings({
        applicationDeploymentFilters: updatedFilters
      });
      if (response) {
        this.setState({
          allFilters: updatedFilters
        });
      } else {
        errorStateManager.addError(new Error('Feil ved sletting av filter'));
      }
    }
  };

  public updateFilter = async (filter: IFilter) => {
    const { affiliation, clients, updateUrlWithQuery } = this.props;
    const { allFilters } = this.state;
    const updatedFilters = this.deploymentFilterService.getOtherNonDefaultFilters(
      allFilters,
      affiliation,
      filter
    );
    if (filter.name) {
      updatedFilters.push({
        affiliation,
        name: filter.name,
        default: !!filter.default,
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
    } else {
      this.setState({
        filter
      });
    }
    if (filter.applications.length === 0 && filter.environments.length === 0) {
      updateUrlWithQuery(`/a/${affiliation}/deployments`);
      const currentQuery = this.deploymentFilterService.toQuery(filter);
      if (currentQuery === '') {
        this.setState({
          filterPathUrl: ''
        });
      }
    }
  };

  public toggleShowExactVersion = () => {
    this.setState(state => ({ showExactVersion: !state.showExactVersion }));
  };

  public render() {
    const { matchPath, affiliation } = this.props;
    const {
      deployments,
      loading,
      isRefreshing,
      filterPathUrl,
      filter,
      allFilters,
      showExactVersion
    } = this.state;

    if (loading && deployments.length === 0) {
      return <Spinner />;
    }

    const filteredDeployments = this.deploymentFilterService.filterDeployments(
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
                deleteFilter={this.deleteFilter}
                allDeployments={deployments}
                filters={filter}
                allFilters={allFilters}
                showExactVersion={showExactVersion}
                toggleShowExactVersion={this.toggleShowExactVersion}
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
