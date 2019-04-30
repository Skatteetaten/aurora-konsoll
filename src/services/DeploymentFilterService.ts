import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { IApplicationDeploymentFilters } from 'models/UserSettings';
import qs from 'qs';

export interface IFilter {
  name?: string;
  default?: boolean;
  applications: string[];
  environments: string[];
}

export default class DeploymentFilterService {
  public toFilter(query: string): IFilter {
    const queries = qs.parse(query, {
      ignoreQueryPrefix: true
    });

    let applications: any[] = [];
    let environments: any[] = [];
    if (typeof queries.apps === 'string') {
      applications.push(queries.apps);
    } else {
      applications = queries.apps;
    }
    if (typeof queries.envs === 'string') {
      environments.push(queries.envs);
    } else {
      environments = queries.envs;
    }

    return {
      applications,
      environments
    };
  }

  public isParamsDefined(query: string) {
    const queries = qs.parse(query, {
      ignoreQueryPrefix: true
    });
    return queries.apps || queries.envs;
  }

  public filterDeployments(
    filters: IFilter,
    deployments: IApplicationDeployment[]
  ): IApplicationDeployment[] {
    const { applications, environments } = filters;

    const filterBy = (list: string[], toInclude: string) => {
      if (list.length === 0) {
        return true;
      }
      return list.some(value => value === toInclude);
    };

    return deployments
      .filter(dep => filterBy(applications, dep.name))
      .filter(dep => filterBy(environments, dep.environment));
  }

  public toQuery(filters: IFilter): string {
    const { applications, environments } = filters;
    return qs.stringify(
      {
        apps: applications,
        envs: environments
      },
      {
        addQueryPrefix: true,
        arrayFormat: 'repeat'
      }
    );
  }

  public findDefaultFilter(
    allFilters: IApplicationDeploymentFilters[],
    affiliation: string
  ) {
    return allFilters.find(f => f.affiliation === affiliation && f.default);
  }

  public getOtherNonDefaultFilters = (
    allFilters: IApplicationDeploymentFilters[],
    affiliation: string,
    filter: IFilter
  ) => {
    let otherFilters = allFilters.filter(
      f => f.affiliation !== affiliation || f.name !== filter.name
    );

    if (filter.default) {
      otherFilters = otherFilters.map(f => {
        if (f.affiliation === affiliation) {
          f.default = false;
        }
        return f;
      });
    }
    return otherFilters;
  };
}
