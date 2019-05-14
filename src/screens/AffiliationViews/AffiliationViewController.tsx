import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';
import * as React from 'react';
import { Route } from 'react-router';

import Spinner from 'components/Spinner';
import {
  IApplicationDeployment,
  IApplicationDeploymentDetails
} from 'models/ApplicationDeployment';
import { IErrorState } from 'models/StateManager/ErrorStateManager';
import {
  IApplicationDeploymentFilters,
  IUserSettings
} from 'models/UserSettings';
import { Link } from 'react-router-dom';
import DeploymentFilterService, {
  IFilter
} from 'services/DeploymentFilterService';
import {
  ApplicationDeploymentProvider,
  withApplicationDeployments
} from './ApplicationDeploymentContext';
import { ApplicationDeploymentSelectorConnected } from './ApplicationDeploymentSelector';
import MatrixView from './MatrixView/MatrixView';

const ApplicationDeploymentSelector = withApplicationDeployments(
  ApplicationDeploymentSelectorConnected
);

interface IAffiliationViewControllerProps extends IAuroraApiComponentProps {
  affiliation: string;
  matchPath: string;
  matchUrl: string;
  updateUrlWithQuery: (query: string) => void;
  errors: IErrorState;
  addError: (error: Error) => void;
  getNextError: () => void;
  closeError: (id: number) => void;
  refreshAffiliations: (affiliations: string[]) => void;
  findAllApplicationDeployments: (affiliations: string[]) => void;
  isFetchingAffiliations: boolean;
  allApplicationDeployments: IApplicationDeployment[];
  isFetchingAllApplicationDeployments: boolean;
  getUserSettings: () => IUserSettings;
  updateUserSettings: (userSettings: IUserSettings) => boolean;
  findApplicationDeploymentDetails: (
    id: string
  ) => IApplicationDeploymentDetails;
}

interface IAffiliationViewControllerState {
  filter: IFilter;
  allFilters: IApplicationDeploymentFilters[];
  filterPathUrl: string;
  showSemanticVersion: boolean;
}

class AffiliationViewController extends React.Component<
  IAffiliationViewControllerProps,
  IAffiliationViewControllerState
> {
  public state: IAffiliationViewControllerState = {
    filter: {
      applications: [],
      environments: []
    },
    allFilters: [],
    filterPathUrl: '',
    showSemanticVersion: false
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
    const { findAllApplicationDeployments } = this.props;
    findAllApplicationDeployments([affiliation]);
  };

  public fetchApplicationDeploymentFilters = async (paramsExists: any) => {
    const { affiliation, getUserSettings } = this.props;
    const filters = await getUserSettings();
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
    const { affiliation, refreshAffiliations } = this.props;
    refreshAffiliations([affiliation]);
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
    const { affiliation, addError, updateUserSettings } = this.props;
    const { allFilters } = this.state;
    const updatedFilters = this.deploymentFilterService.getOtherNonDefaultFilters(
      allFilters,
      affiliation,
      { name: filterName, applications: [], environments: [], default: false }
    );
    if (filterName) {
      const response = await updateUserSettings({
        applicationDeploymentFilters: updatedFilters
      });
      if (response) {
        this.setState({
          allFilters: updatedFilters
        });
      } else {
        addError(new Error('Feil ved sletting av filter'));
      }
    }
  };

  public updateFilter = async (filter: IFilter) => {
    const {
      affiliation,
      updateUserSettings,
      updateUrlWithQuery,
      addError
    } = this.props;
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
      const response = await updateUserSettings({
        applicationDeploymentFilters: updatedFilters
      });

      if (response) {
        this.setState({
          filter,
          allFilters: updatedFilters
        });
      } else {
        addError(new Error('Feil ved sletting av filter'));
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

  public toggleShowSemanticVersion = () => {
    this.setState(state => ({
      showSemanticVersion: !state.showSemanticVersion
    }));
  };

  public render() {
    const {
      matchPath,
      affiliation,
      isFetchingAllApplicationDeployments,
      allApplicationDeployments,
      findApplicationDeploymentDetails
    } = this.props;
    const {
      filterPathUrl,
      filter,
      allFilters,
      showSemanticVersion: showExactVersion
    } = this.state;

    if (
      isFetchingAllApplicationDeployments &&
      allApplicationDeployments.length === 0
    ) {
      return <Spinner />;
    }

    const filteredDeployments = this.deploymentFilterService.filterDeployments(
      filter,
      allApplicationDeployments
    );

    const time =
      allApplicationDeployments.length > 0
        ? allApplicationDeployments[0].time
        : '';

    return (
      <ApplicationDeploymentProvider
        value={{
          buildDeploymentLink: this.buildDeploymentLink,
          allDeployments: allApplicationDeployments,
          deployments: filteredDeployments,
          refreshDeployments: this.refreshApplicationDeployments,
          fetchApplicationDeployments: () =>
            this.fetchApplicationDeployments(affiliation),
          filterPathUrl,
          findApplicationDeploymentDetails
        }}
      >
        <Route exact={true} path={`${matchPath}/deployments`}>
          {({ match }) =>
            match && (
              <MatrixView
                time={time}
                isRefreshing={this.props.isFetchingAffiliations}
                refreshApplicationDeployments={
                  this.refreshApplicationDeployments
                }
                affiliation={affiliation}
                updateFilter={this.updateFilter}
                deleteFilter={this.deleteFilter}
                allDeployments={allApplicationDeployments}
                filters={filter}
                allFilters={allFilters}
                showSemanticVersion={showExactVersion}
                toggleShowSemanticVersion={this.toggleShowSemanticVersion}
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
