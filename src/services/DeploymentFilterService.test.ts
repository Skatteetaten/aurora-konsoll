import { IApplicationDeployment } from '../models/ApplicationDeployment';
import { ImageTagType } from '../models/ImageTagType';
import DeploymentFilterService, { IFilter } from './DeploymentFilterService';

describe('DeploymentFilterService', () => {
  const deploymentFilterService = new DeploymentFilterService();

  const deployments: IApplicationDeployment[] = [
    {
      id: 'c08af1c8e7ae92080ac86113521c19d25a437f43',
      affiliation: 'paas',
      environment: 'martin-dev',
      name: 'whoami-sub',
      repository: 'localhost/whoami',
      status: {
        code: 'HEALTHY',
        comment: ''
      },
      time: '2018-11-12T07:16:26.797Z',
      version: {
        auroraVersion: '2.3.0-b1.17.0-flange-8.181.1',
        deployTag: {
          lastModified: '',
          name: 'test',
          type: ImageTagType.AURORA_VERSION
        },
        releaseTo: undefined
      },
      permission: {
        paas: {
          admin: false,
          view: true
        }
      }
    },
    {
      id: 'f82d667296d48369ffa4e5d3718b494e90e14ee1',
      affiliation: 'paas',
      environment: 'robust-test',
      name: 'whoami',
      repository: 'localhost/robust-test',
      status: {
        code: 'HEALTHY',
        comment: ''
      },
      time: '2018-11-12T07:16:26.798Z',
      version: {
        auroraVersion: '1.3.23-b1.14.0-flange-8.152.18',
        deployTag: {
          lastModified: '',
          name: '1',
          type: ImageTagType.MAJOR
        },
        releaseTo: undefined
      },
      permission: {
        paas: {
          admin: false,
          view: true
        }
      }
    }
  ];

  const testFilters: IFilter = {
    applications: ['whoami-sub'],
    environments: ['martin-dev']
  };

  const emptyTestFilters: IFilter = {
    applications: [],
    environments: []
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
        environments: ['martin-dev']
      });
    });

    it('Given query expect to split envs and apps into separate lists', () => {
      expect(
        deploymentFilterService.toFilter(
          '?apps=whoami-sub&apps=whoami&apps=skattemelding-core-mock&envs=martin-dev'
        )
      ).toEqual({
        applications: ['whoami-sub', 'whoami', 'skattemelding-core-mock'],
        environments: ['martin-dev']
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
});
