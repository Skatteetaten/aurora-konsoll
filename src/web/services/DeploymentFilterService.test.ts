import {
  applicationDeploymentFilterFactory,
  deploymentFactory,
  filterFactory,
} from 'web/testData/testDataBuilders';

import { IApplicationDeployment } from '../models/ApplicationDeployment';
import DeploymentFilterService, { IFilter } from './DeploymentFilterService';

describe('DeploymentFilterService', () => {
  const deploymentFilterService = new DeploymentFilterService();

  const deployments: IApplicationDeployment[] = [
    deploymentFactory.build({ environment: 'martin-dev', name: 'whoami-sub' }),
    deploymentFactory.build({ environment: 'robust-test', name: 'whoami' }),
  ];

  const testFilters: IFilter = {
    applications: ['whoami-sub'],
    environments: ['martin-dev'],
  };

  const emptyTestFilters: IFilter = {
    applications: [],
    environments: [],
  };

  describe('filterDeployments', () => {
    it('Given set filters do apply filters', () => {
      const result = deploymentFilterService.filterDeployments(
        testFilters,
        deployments
      );
      expect(result).toEqual([deployments[0]]);
      expect(result).toHaveLength(1);
    });
    it('Given empty filters do not apply filters', () => {
      expect(
        deploymentFilterService.filterDeployments(emptyTestFilters, deployments)
      ).toEqual(deployments);
    });
  });

  describe('toFilter', () => {
    it('Given single inputs return two arrays', () => {
      expect(
        deploymentFilterService.toFilter('?apps=whoami-sub&envs=martin-dev')
      ).toEqual({
        applications: ['whoami-sub'],
        environments: ['martin-dev'],
      });
    });

    it('Given query expect to split envs and apps into separate lists', () => {
      expect(
        deploymentFilterService.toFilter(
          '?apps=whoami-sub&apps=whoami&apps=skattemelding-core-mock&envs=martin-dev'
        )
      ).toEqual({
        applications: ['whoami-sub', 'whoami', 'skattemelding-core-mock'],
        environments: ['martin-dev'],
      });
    });
  });

  describe('toQuery', () => {
    it('Given set filters expect query to equal', () => {
      expect(deploymentFilterService.toQuery(testFilters)).toEqual(
        '?apps=whoami-sub&envs=martin-dev'
      );
    });
  });

  describe('getOtherNonDefaultFilters', () => {
    it('Given set filters expect query to equal', () => {
      const applicationDeploymentFilters = [
        applicationDeploymentFilterFactory.build(),
        applicationDeploymentFilterFactory.build({
          name: 'auroraFilter',
        }),
      ];

      const result = deploymentFilterService.getOtherNonDefaultFilters(
        applicationDeploymentFilters,
        'paas',
        filterFactory.build()
      );
      expect(result).toHaveLength(1);
      expect(result[0].default).toBeFalsy();
    });
  });
});
