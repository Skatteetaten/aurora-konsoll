import { IApplicationDeployment } from 'models/ApplicationDeployment';
import * as qs from 'qs';

export interface IFilter {
  name?: string;
  applications: string[];
  environments: string[];
}

export default class DeploymentFilterService {
  public toFilter(query: string): IFilter {
    const queries = qs.parse(query, {
      ignoreQueryPrefix: true
    });

    let applications = [];
    let environments = [];
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
}
