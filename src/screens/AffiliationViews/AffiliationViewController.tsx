import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';
import { History } from 'history';
import * as React from 'react';
import { Route } from 'react-router';

import Spinner from 'components/Spinner';
import { IApplicationDeployment } from 'models/ApplicationDeployment';
import * as qs from 'qs';
import { Link } from 'react-router-dom';
import {
  ApplicationDeploymentProvider,
  withApplicationDeployments
} from './ApplicationDeploymentContext';
import { default as ApplicationDeploymentSelectorBase } from './ApplicationDeploymentSelector';
import MatrixView from './MatrixView/MatrixView';

const ApplicationDeploymentSelector = withApplicationDeployments(
  ApplicationDeploymentSelectorBase
);

interface IFilterOptions {
  deploymentNames: string[];
  environmentNames: string[];
}

// type FilterFunc = (filterOptions: IFilterOptions) => void;

interface IAffiliationViewControllerProps extends IAuroraApiComponentProps {
  affiliation: string;
  matchPath: string;
  matchUrl: string;
  history: History;
}

interface IAffiliationViewControllerState {
  loading: boolean;
  isRefreshing: boolean;
  deployments: IApplicationDeployment[];
  filterOptions: IFilterOptions;
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
    filterOptions: {
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

  public fetchApplicationDeployments = async (
    affiliation: string,
    prevaffiliation?: string
  ) => {
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

    if (prevaffiliation !== affiliation && prevaffiliation !== undefined) {
      this.setState(() => ({
        filterOptions: {
          deploymentNames: [],
          environmentNames: []
        }
      }));
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

  public handleFilterChange = (state = this.state) => {
    const { deploymentNames, environmentNames } = state.filterOptions;
    return qs.stringify(
      {
        apps: deploymentNames,
        envs: environmentNames
      },
      {
        addQueryPrefix: true,
        arrayFormat: 'repeat'
      }
    );
  };

  public componentDidUpdate(
    prevProps: IAffiliationViewControllerProps,
    prevState: IAffiliationViewControllerState
  ) {
    if (this.props.affiliation !== prevProps.affiliation) {
      this.fetchApplicationDeployments(
        this.props.affiliation,
        prevProps.affiliation
      );
    }
    const prevQuery = this.handleFilterChange(prevState);
    const query = this.handleFilterChange();

    if (prevQuery !== query) {
      this.props.history.push(query);
      this.setState(() => ({
        filterPathUrl: query
      }));
    }
  }

  public testData = () => {
    this.setState(() => ({
      filterOptions: {
        deploymentNames: [
          'whoami-sub',
          'whoami',
          'skattemelding-core-mock',
          'redis',
          'redisdb',
          'ao',
          'atomhopper',
          'driftsdashboard'
        ],
        environmentNames: ['aotest', 'espen-utv']
      }
    }));
  };

  public changeFilter = (apps?: string[], envs?: string[]) => {
    this.setState(({ filterOptions }) => ({
      filterOptions: {
        deploymentNames: apps || filterOptions.deploymentNames,
        environmentNames: envs || filterOptions.environmentNames
      }
    }));
  };

  public componentDidMount() {
    this.fetchApplicationDeployments(this.props.affiliation);

    const { search } = location;
    const queries = qs.parse(search, {
      ignoreQueryPrefix: true
    });

    let apps = [];
    let envs = [];
    if (typeof queries.apps === 'string') {
      apps.push(queries.apps);
    } else {
      apps = queries.apps;
    }
    if (typeof queries.envs === 'string') {
      envs.push(queries.envs);
    } else {
      envs = queries.envs;
    }

    this.changeFilter(apps, envs);
  }

  public filterDeployments(): IApplicationDeployment[] {
    const { deploymentNames, environmentNames } = this.state.filterOptions;

    const filterBy = (list: string[], toInclude: string) => {
      if (list.length === 0) {
        return true;
      }
      return list.some(value => value === toInclude);
    };

    return this.state.deployments
      .filter(dep => filterBy(deploymentNames, dep.name))
      .filter(dep => filterBy(environmentNames, dep.environment));
  }

  public render() {
    const { matchPath, affiliation } = this.props;
    const { deployments, loading } = this.state;

    if (loading && deployments.length === 0) {
      return <Spinner />;
    }

    const filteredDeployments = this.filterDeployments();

    const time = deployments.length > 0 ? deployments[0].time : '';

    return (
      <ApplicationDeploymentProvider
        value={{
          buildDeploymentLink: this.buildDeploymentLink,
          deployments: filteredDeployments,
          refreshDeployments: this.refreshApplicationDeployments,
          fetchApplicationDeployments: () =>
            this.fetchApplicationDeployments(affiliation),
          filterPathUrl: this.state.filterPathUrl
        }}
      >
        <Route exact={true} path={`${matchPath}/deployments`}>
          {({ match }) =>
            match && (
              <MatrixView
                time={time}
                isRefreshing={this.state.isRefreshing}
                refreshApplicationDeployments={
                  this.refreshApplicationDeployments
                }
                changeFilter={this.testData}
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
