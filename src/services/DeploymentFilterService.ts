import { IApplicationDeployment } from 'models/ApplicationDeployment';
import * as qs from 'qs';

export interface IFilters {
  deploymentNames: string[];
  environmentNames: string[];
}

export default class DeploymentFilterService {
  public toFilter(query: string): IFilters {
    const queries = qs.parse(query, {
      ignoreQueryPrefix: true
    });

    let deploymentNames = [];
    let environmentNames = [];
    if (typeof queries.apps === 'string') {
      deploymentNames.push(queries.apps);
    } else {
      deploymentNames = queries.apps;
    }
    if (typeof queries.envs === 'string') {
      environmentNames.push(queries.envs);
    } else {
      environmentNames = queries.envs;
    }

    return {
      deploymentNames,
      environmentNames
    };
  }
  public filterDeployments(
    filters: IFilters,
    deployments: IApplicationDeployment[]
  ): IApplicationDeployment[] {
    const { deploymentNames, environmentNames } = filters;

    const filterBy = (list: string[], toInclude: string) => {
      if (list.length === 0) {
        return true;
      }
      return list.some(value => value === toInclude);
    };

    return deployments
      .filter(dep => filterBy(deploymentNames, dep.name))
      .filter(dep => filterBy(environmentNames, dep.environment));
  }

  public toQuery(filters: IFilters): string {
    const { deploymentNames, environmentNames } = filters;
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
  }
}
