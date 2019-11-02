import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { IApplicationDeploymentFilters } from 'models/UserSettings';
import DeploymentFilterService, {
  IFilter
} from 'services/DeploymentFilterService';
import { ApplicationDeploymentSelectorContainer } from './DetailsView/ApplicationDeploymentSelector';
import { MatrixView } from './MatrixView/MatrixView';
import { DeploymentViewContainerState } from './DeploymentViewContainer';

interface IDeploymentViewProps {
  affiliation: string;
  matchPath: string;
  matchUrl: string;
  updateUrlWithQuery: (query: string) => void;
}

type Props = IDeploymentViewProps & DeploymentViewContainerState;

interface IDeploymentViewState {
  filter: IFilter;
  allFilters: IApplicationDeploymentFilters[];
  filterPathUrl: string;
  showSemanticVersion: boolean;
  quickFilter: string;
}

export class DeploymentView extends React.Component<
  Props,
  IDeploymentViewState
> {
  public state: IDeploymentViewState = {
    filter: {
      applications: [],
      environments: []
    },
    allFilters: [],
    filterPathUrl: '',
    showSemanticVersion: false,
    quickFilter: ''
  };

  private deploymentFilterService = new DeploymentFilterService();

  public fetchApplicationDeployments = async (affiliation: string) => {
    const { fetchApplicationDeployments } = this.props;
    await fetchApplicationDeployments([affiliation]);
  };

  public fetchApplicationDeploymentFilters = (paramsExists: any) => {
    const { affiliation, userSettings } = this.props;
    if (userSettings) {
      this.setState({
        allFilters: userSettings.applicationDeploymentFilters
      });

      const filter = userSettings.applicationDeploymentFilters.find(
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
    const { affiliation, refreshAffiliations } = this.props;
    await refreshAffiliations([affiliation]);
    await this.fetchApplicationDeployments(affiliation);
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
            },
            quickFilter: ''
          });
        } else {
          this.setState({
            filter: {
              applications: [],
              environments: []
            },
            quickFilter: ''
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

  public componentDidUpdate(prevProps: Props, prevState: IDeploymentViewState) {
    const paramsExists = this.deploymentFilterService.isParamsDefined();
    this.clearFilterOnAffiliationChange(prevProps.affiliation);
    this.updateQueryOnNewParams(prevState.filter);
    if (prevProps.userSettings !== this.props.userSettings) {
      this.fetchApplicationDeploymentFilters(paramsExists);
    }
  }

  public async componentDidMount() {
    const { affiliation, getUserSettings } = this.props;
    await getUserSettings();
    this.fetchApplicationDeployments(affiliation);
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
    const { affiliation, updateUserSettings } = this.props;
    const { allFilters } = this.state;
    const updatedFilters = this.deploymentFilterService.getOtherNonDefaultFilters(
      allFilters,
      affiliation,
      { name: filterName, applications: [], environments: [], default: false }
    );
    if (filterName) {
      await updateUserSettings({
        applicationDeploymentFilters: updatedFilters
      });
    }
  };

  public updateFilter = async (filter: IFilter) => {
    const { affiliation, updateUserSettings, updateUrlWithQuery } = this.props;
    const { allFilters } = this.state;
    const updatedFilters = this.deploymentFilterService.getOtherNonDefaultFilters(
      allFilters,
      affiliation,
      filter
    );
    if (filter.quickFilter) {
      this.setState({
        filter
      });
    } else {
      if (filter.name) {
        updatedFilters.push({
          affiliation,
          name: filter.name,
          default: !!filter.default,
          applications: filter.applications,
          environments: filter.environments
        });
        await updateUserSettings({
          applicationDeploymentFilters: updatedFilters
        });
        this.setState({
          filter,
          quickFilter: ''
        });
      } else {
        this.setState({
          filter,
          quickFilter: ''
        });
      }
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

  public updateQuickFilter = (filter: string) => {
    const { applicationsConnection } = this.props;
    this.setState({
      quickFilter: filter
    });

    const allApplicationDeploymentsResult = applicationsConnection.getApplicationDeployments();

    const filtered = allApplicationDeploymentsResult.filter(
      deployment =>
        deployment.name.includes(filter) ||
        deployment.environment.includes(filter)
    );
    this.updateFilter({
      quickFilter: true,
      applications: filtered.map(f => f.name),
      environments: filtered.map(f => f.environment)
    });
  };

  public toggleShowSemanticVersion = () => {
    this.setState(state => ({
      showSemanticVersion: !state.showSemanticVersion
    }));
  };

  public render() {
    const {
      matchPath,
      affiliation,
      isRefreshingAffiliations,
      applicationsConnection
    } = this.props;
    const {
      filterPathUrl,
      filter,
      allFilters,
      showSemanticVersion: showExactVersion,
      quickFilter
    } = this.state;

    const allApplicationDeploymentsResult = applicationsConnection.getApplicationDeployments();

    const filteredDeployments = this.deploymentFilterService.filterDeployments(
      filter,
      allApplicationDeploymentsResult
    );

    const time =
      allApplicationDeploymentsResult.length > 0
        ? allApplicationDeploymentsResult[0].time
        : '';
    return (
      <Switch>
        <Route exact={true} path={matchPath}>
          <MatrixView
            time={time}
            deployments={filteredDeployments}
            isRefreshing={isRefreshingAffiliations}
            refreshApplicationDeployments={this.refreshApplicationDeployments}
            affiliation={affiliation}
            updateFilter={this.updateFilter}
            deleteFilter={this.deleteFilter}
            allDeployments={allApplicationDeploymentsResult}
            filters={filter}
            allFilters={allFilters}
            showSemanticVersion={showExactVersion}
            toggleShowSemanticVersion={this.toggleShowSemanticVersion}
            quickFilter={quickFilter}
            updateQuickFilter={this.updateQuickFilter}
          />
        </Route>
        <Route path={`${matchPath}/:applicationDeploymentId`}>
          <ApplicationDeploymentSelectorContainer
            filterPathUrl={filterPathUrl}
            affiliation={affiliation}
          />
        </Route>
      </Switch>
    );
  }
}
