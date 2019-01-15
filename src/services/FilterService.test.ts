import FilterService from './FilterService';

import { SelectionType } from 'screens/AffiliationViews/MatrixView/Filter/Filter';
import { applicationDeploymentFilterFactory, deploymentFactory } from 'testData/testDataBuilders';

describe('FilterService', () => {
  const filterService = new FilterService();

  it('Find filter by applications and environments', () => {
    const deployment1 = applicationDeploymentFilterFactory.build({
      applications: ['app1'],
      environments: ['env1']
    });
    const deployment2 = applicationDeploymentFilterFactory.build({
      applications: ['app2'],
      environments: ['env1']
    });
    const deployment3 = applicationDeploymentFilterFactory.build({
      applications: ['app1'],
      environments: ['env2']
    });

    const filter = filterService.findFilterByApplicationsAndEnvironments(
      [deployment1, deployment2, deployment3],
      'paas',
      ['app1'],
      ['env1']
    );
    expect(filter).toEqual(deployment1);
  });

  it('remove element from list', () => {
    const values = filterService.removeElement(['app1', 'app2'], 'app1');
    expect(values).toHaveLength(1);
    expect(values[0]).toEqual('app2');
  });

  it('create filter options', () => {
    const deployment1 = applicationDeploymentFilterFactory.build();
    const deployment2 = applicationDeploymentFilterFactory.build({
      affiliation: 'aurora',
      name: 'aos'
    });
    const filterOptions = filterService.createFilterOptions(
      [deployment1, deployment2],
      'aurora'
    );
    expect(filterOptions).toHaveLength(1);
    expect(filterOptions[0].key).toEqual('aos');
  });

  it('remove selection type duplicate values', () => {
    const deployments = deploymentFactory.buildList(3);
    const noDuplicates = filterService.removeSelectionTypeDuplicateValues(deployments, SelectionType.Applications);
    expect(noDuplicates).toHaveLength(1);
  });

  it('get default filter name', () => {
    const defaultFilter = applicationDeploymentFilterFactory.build();
    const notDefaultFilter = applicationDeploymentFilterFactory.build({ default: false});

    const filterName = filterService.getDefaultFilterName([defaultFilter, notDefaultFilter], 'paas');
    expect(filterName).toEqual(defaultFilter.name);
  });

  it('get default filter', () => {
    const defaultFilter = applicationDeploymentFilterFactory.build();
    const notDefaultFilter = applicationDeploymentFilterFactory.build({ default: false});

    const filterName = filterService.getDefaultFilter([defaultFilter, notDefaultFilter], 'paas');
    expect(filterName).toEqual(defaultFilter);  
  })
});
