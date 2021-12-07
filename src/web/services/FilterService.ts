import { IApplicationDeployment } from 'web/models/ApplicationDeployment';
import { IApplicationDeploymentFilters } from 'web/models/UserSettings';
import { SelectionType } from 'web/screens/AffiliationViews/DeploymentView/MatrixView/components/Filter/Filter';
import { IChoiceGroupOption } from '@fluentui/react';

export interface IUniqueSelectionNames {
  applications: string[];
  environments: string[];
}

export default class FilterService {
  public findFilterByApplicationsAndEnvironments(
    allFilters: IApplicationDeploymentFilters[],
    affiliation: string,
    applications: string[],
    environments: string[]
  ) {
    return allFilters
      .filter((f) => f.affiliation === affiliation)
      .find(
        (f) =>
          JSON.stringify(f.environments) === JSON.stringify(environments) &&
          JSON.stringify(f.applications) === JSON.stringify(applications)
      );
  }

  public removeElement = (list: string[], element: string) =>
    list.filter((item) => item !== element);

  public createFilterOptions = (
    allFilters: IApplicationDeploymentFilters[],
    affiliation: string
  ): IChoiceGroupOption[] => {
    const filterNames = allFilters
      .filter((filter) => filter.affiliation === affiliation)
      .map((filter) => filter.name)
      .sort();
    return filterNames.map((name, index) => ({
      value: name,
      label: name,
      key: name || '',
      text: name || '',
    }));
  };

  public removeSelectionTypeDuplicateValues = (
    allDeployments: IApplicationDeployment[],
    type: SelectionType
  ) => {
    return allDeployments
      .map((deployment) =>
        type === SelectionType.Applications
          ? deployment.name
          : deployment.environment
      )
      .filter((item, index, self) => self.indexOf(item) === index)
      .sort();
  };

  public createUniqueSelectionNames = (
    allDeployments: IApplicationDeployment[]
  ) => {
    return {
      applications: this.removeSelectionTypeDuplicateValues(
        allDeployments,
        SelectionType.Applications
      ),
      environments: this.removeSelectionTypeDuplicateValues(
        allDeployments,
        SelectionType.Environments
      ),
    };
  };

  public getDefaultFilterName = (
    allFilters: IApplicationDeploymentFilters[],
    affiliation: string
  ) => {
    const defaultFilter = this.getDefaultFilter(allFilters, affiliation);
    return !!defaultFilter ? defaultFilter.name : undefined;
  };

  public getDefaultFilter = (
    allFilters: IApplicationDeploymentFilters[],
    affiliation: string
  ) => allFilters.find((f) => f.affiliation === affiliation && f.default);
}
