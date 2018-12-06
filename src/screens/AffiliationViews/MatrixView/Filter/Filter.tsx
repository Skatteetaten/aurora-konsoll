import * as React from 'react';
import styled from 'styled-components';

import ReactSelect from 'components/Select';

import InfoDialog from 'components/InfoDialog';

import { errorStateManager } from 'models/StateManager/ErrorStateManager';

import { IApplicationDeployment } from 'models/ApplicationDeployment';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Checkbox from 'aurora-frontend-react-komponenter/Checkbox';
import { IApplicationDeploymentFilters } from 'models/UserSettings';
import { IFilter } from 'services/DeploymentFilterService';
import FilterService from 'services/FilterService';
import FilterModeSelect, { FilterMode } from './FilterModeSelect';
import SelectionButtons from './SelectionButtons';

export enum SelectionType {
  Applications,
  Environments
}

interface ICheckboxValue {
  name: string;
  type: SelectionType;
}

interface IFilterProps {
  className?: string;
  affiliation: string;
  updateFilter: (filter: IFilter) => void;
  deleteFilter: (filterName: string) => void;
  allDeployments: IApplicationDeployment[];
  filters: IFilter;
  allFilters: IApplicationDeploymentFilters[];
}

interface IFilterState {
  applications: string[];
  environments: string[];
  selectedFilterKey?: string;
  currentFilterName?: string;
  mode: FilterMode;
}

export interface IFilterChange {
  label: string;
  value: string;
}

export class Filter extends React.Component<IFilterProps, IFilterState> {
  public state: IFilterState = {
    applications: [],
    environments: [],
    mode: FilterMode.Create,
    selectedFilterKey: undefined
  };

  private filterService = new FilterService();

  public componentDidMount() {
    const { filters } = this.props;
    this.setState({
      applications: filters.applications,
      environments: filters.environments
    });
  }

  public setExistingFilter() {
    const { affiliation, allFilters } = this.props;
    const { selectedFilterKey, environments, applications } = this.state;

    if (!selectedFilterKey) {
      const enabledFilter = this.filterService.findFilterByApplicationsAndEnvironments(
        allFilters,
        affiliation,
        applications,
        environments
      );
      if (enabledFilter) {
        this.setState({
          selectedFilterKey: enabledFilter.name
        });
      }
    }
  }

  public clearOnAffiliationChange(prevAffiliation: string) {
    const { affiliation } = this.props;
    if (prevAffiliation !== affiliation) {
      this.setState({
        applications: [],
        environments: [],
        selectedFilterKey: undefined,
        mode: FilterMode.Create
      });
    }
  }

  public componentDidUpdate(prevProps: IFilterProps) {
    this.setExistingFilter();
    this.clearOnAffiliationChange(prevProps.affiliation);
  }

  public updateFilterState = (value: ICheckboxValue) => () => {
    const { applications, environments } = this.state;
    const isApplication = value.type === SelectionType.Applications;

    const values = isApplication ? applications : environments;
    if (!values.includes(value.name)) {
      if (isApplication) {
        this.setState(prevState => ({
          applications: [...prevState.applications, value.name]
        }));
      } else {
        this.setState(prevState => ({
          environments: [...prevState.environments, value.name]
        }));
      }
    } else {
      const newArray = this.filterService.removeDuplicates(values, value.name);
      if (isApplication) {
        this.setState({
          applications: newArray
        });
      } else {
        this.setState({
          environments: newArray
        });
      }
    }
  };

  public hasCurrentFilterName = () => {
    const { currentFilterName } = this.state;
    return currentFilterName && currentFilterName.length > 0;
  };

  public noFilterOptionsSelected = () => {
    const { applications, environments } = this.state;
    return applications.length === 0 && environments.length === 0;
  };

  public footerApplyButton = (close: () => void) => {
    const { updateFilter } = this.props;
    const { currentFilterName, applications, environments } = this.state;
    const applyChanges = () => {
      if (this.hasCurrentFilterName() && this.noFilterOptionsSelected()) {
        errorStateManager.addError(
          new Error('Ingen applikasjoner og miljøer valgt')
        );
      } else {
        updateFilter({
          name: currentFilterName,
          applications,
          environments
        });
        this.setState({
          selectedFilterKey: currentFilterName
        });
        close();
      }
    };
    return <ActionButton onClick={applyChanges}>Sett filter</ActionButton>;
  };

  public setCurrentFilterName = (filterName: string) => {
    this.setState({
      currentFilterName: filterName
    });
  };

  public handleFilterChange = (option: IFilterChange) => {
    const { allFilters, updateFilter } = this.props;
    if (option) {
      this.setState({
        selectedFilterKey: option.label,
        mode: FilterMode.Edit
      });
      const currentFilter = allFilters.find(
        filter => filter.name === option.label
      );

      if (currentFilter) {
        this.setState({
          applications: currentFilter.applications,
          environments: currentFilter.environments,
          currentFilterName: currentFilter.name
        });
        updateFilter({
          applications: currentFilter.applications,
          environments: currentFilter.environments
        });
      }
    } else {
      this.setState({
        applications: [],
        environments: [],
        currentFilterName: undefined
      });
      updateFilter({ applications: [], environments: [] });
    }
  };

  public clearAllCheckboxes = (type: SelectionType) => {
    if (type === SelectionType.Applications) {
      this.setState({
        applications: []
      });
    } else {
      this.setState({
        environments: []
      });
    }
  };

  public selectAllCheckboxes = (type: SelectionType) => {
    const { allDeployments } = this.props;
    const values = this.filterService.removeSelectionTypeDuplicateValues(
      allDeployments,
      type
    );
    if (type === SelectionType.Applications) {
      this.setState({
        applications: values
      });
    } else {
      this.setState({
        environments: values
      });
    }
  };

  public deleteFilter = () => {
    const { deleteFilter } = this.props;
    const { selectedFilterKey } = this.state;
    if (selectedFilterKey && selectedFilterKey.length > 0) {
      deleteFilter(selectedFilterKey);
      this.setState({
        applications: [],
        environments: [],
        selectedFilterKey: undefined
      });
    }
  };

  public render() {
    const { className, allFilters, affiliation, allDeployments } = this.props;
    const { applications, environments, selectedFilterKey, mode } = this.state;

    const selectionNames = this.filterService.createUniqueSelectionNames(
      allDeployments
    );

    const renderOpenButton = (open: () => void) => (
      <ActionButton
        onClick={open}
        iconSize={ActionButton.LARGE}
        icon="Filter"
        color="black"
      >
        Filter
      </ActionButton>
    );

    const setMode = (m: FilterMode) => {
      this.setState({
        mode: m
      });
    };

    const filterOptions = this.filterService.createFilterOptions(
      allFilters,
      affiliation
    );

    return (
      <>
        <InfoDialog
          title=""
          renderFooterButtons={this.footerApplyButton}
          renderOpenDialogButton={renderOpenButton}
        >
          <div className={className}>
            <dl>
              <div className="styled-edit">
                <FilterModeSelect
                  setMode={setMode}
                  setCurrentFilterName={this.setCurrentFilterName}
                  filterOptions={filterOptions}
                  selectedFilterKey={selectedFilterKey}
                  deleteFilter={this.deleteFilter}
                  mode={mode}
                  handleFilterChange={this.handleFilterChange}
                />
              </div>
              <dt>
                <h3>Applikasjoner:</h3>
                <SelectionButtons
                  type={SelectionType.Applications}
                  onClear={this.clearAllCheckboxes}
                  onSelect={this.selectAllCheckboxes}
                />
                <div className="apps-and-envs">
                  {selectionNames.applications.map((application, index) => (
                    <Checkbox
                      key={index}
                      boxSide={'start'}
                      label={application}
                      checked={applications.includes(application)}
                      onChange={this.updateFilterState({
                        name: application,
                        type: SelectionType.Applications
                      })}
                    />
                  ))}
                </div>
              </dt>
              <dt>
                <h3>Miljøer:</h3>
                <SelectionButtons
                  type={SelectionType.Environments}
                  onClear={this.clearAllCheckboxes}
                  onSelect={this.selectAllCheckboxes}
                />
                <div className="apps-and-envs">
                  {selectionNames.environments.map((environment, index) => (
                    <Checkbox
                      key={index}
                      boxSide={'start'}
                      label={environment}
                      checked={environments.includes(environment)}
                      onChange={this.updateFilterState({
                        name: environment,
                        type: SelectionType.Environments
                      })}
                    />
                  ))}
                </div>
              </dt>
            </dl>
          </div>
        </InfoDialog>
        <div className={className}>
          <ReactSelect
            options={filterOptions}
            placeholder={'Velg filter'}
            selectedKey={selectedFilterKey}
            handleChange={this.handleFilterChange}
            isClearable={true}
            className="styled-select"
          />
        </div>
      </>
    );
  }
}

const styledFilter = styled(Filter)`
  .styled-select {
    z-index: 1000;
    width: 250px;
  }
  dl {
    display: flex;
  }
  h3 {
    padding: 0px;
    margin-top: 0;
    margin-bottom: 0;
  }
  .styled-edit {
    margin-right: 40px;
  }
  .apps-and-envs {
    max-height: 500px;
    min-width: 250px;
    width: auto;
    padding-right: 10px;
    margin-right: 40px;
    overflow: auto;
  }
  .saved-filters {
    max-height: 380px;
    padding-right: 10px;
    padding-left: 5px;
    overflow: auto;
  }
`;

export default styledFilter;
