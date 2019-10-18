import * as React from 'react';
import { Route } from 'react-router';

import Spinner from 'components/Spinner';
import { IApplicationDeployment } from 'models/ApplicationDeployment';
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

interface IAffiliationViewControllerProps {
  affiliation: string;
  matchPath: string;
  matchUrl: string;
  updateUrlWithQuery: (query: string) => void;
  refreshAffiliations: (affiliations: string[]) => void;
  findAllApplicationDeployments: (affiliations: string[]) => void;
  isFetchingAffiliations: boolean;
  allApplicationDeployments: IApplicationDeployment[];
  isFetchingAllApplicationDeployments: boolean;
  getUserSettings: () => void;
  userSettings: IUserSettings;
  updateUserSettings: (userSettings: IUserSettings) => void;
}

interface IAffiliationViewControllerState {
  filter: IFilter;
  allFilters: IApplicationDeploymentFilters[];
  filterPathUrl: string;
  showSemanticVersion: boolean;
}

export class AffiliationViewController extends React.Component<
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
      <Link to={`${matchUrl}/${deployment.id}/info`}>{children}</Link>
    );
  };

  public fetchApplicationDeployments = async (affiliation: string) => {
    const { findAllApplicationDeployments } = this.props;
    await findAllApplicationDeployments([affiliation]);
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
        filter
      });
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
      isFetchingAffiliations
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
          filterPathUrl,
          affiliation,
          refreshApplicationDeployments: this.refreshApplicationDeployments
        }}
      >
        <Route exact={true} path={matchPath}>
          {({ match }) =>
            match && (
              <MatrixView
                time={time}
                isRefreshing={isFetchingAffiliations}
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
          path={`${matchPath}/:applicationDeploymentId`}
          component={ApplicationDeploymentSelector}
        />
      </ApplicationDeploymentProvider>
    );
  }
}
