import { IApplicationDeployment } from 'models/ApplicationDeployment';
import { IApplicationDeploymentFilters } from 'models/UserSettings';

export interface IFilter {
  name?: string;
  default?: boolean;
  applications: string[];
  environments: string[];
}

export default class DeploymentFilterService {
  public toFilter(query: string): IFilter {
    const params = new URLSearchParams(query);
    let applications: any[] = [];
    let environments: any[] = [];
    if(params.has("apps")) {
      applications = params.getAll("apps");
    }

    if(params.has("envs")) {
      environments = params.getAll("envs");
    }

    return {
      applications,
      environments
    };
  }

  public isParamsDefined(query: string) {
    const params = new URLSearchParams(query);
    return (params.has("apps") || params.has("envs"));
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

    const params = new URLSearchParams();
    applications.forEach((app) => params.append("apps", app));
    environments.forEach((env) => params.append("envs", env));

    return `?${params.toString()}`;
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
