import * as React from 'react';
import styled from 'styled-components';

import InfoDialog from 'web/components/InfoDialog';
import ReactSelect from 'web/components/Select';

import { IApplicationDeployment } from 'web/models/ApplicationDeployment';

import { ActionButton } from '@skatteetaten/frontend-components/ActionButton';
import { CheckBox } from '@skatteetaten/frontend-components/CheckBox';
import { RadioButtonGroupProps } from '@skatteetaten/frontend-components/RadioButtonGroup/RadioButtonGroup.types';
import { IApplicationDeploymentFilters } from 'web/models/UserSettings';
import { IFilter } from 'web/services/DeploymentFilterService';
import FilterService from 'web/services/FilterService';
import FilterModeSelect, { FilterMode } from './FilterModeSelect';
import FooterText from './FooterText';
import SelectionButtons from './SelectionButtons';
import { connect } from 'react-redux';
import { addErrors } from 'web/screens/ErrorHandler/state/actions';
import { TextFieldEvent } from 'web/types/react';

export enum SelectionType {
  Applications,
  Environments,
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
  addErrors: (errors: any[]) => void;
}

interface IFilterState {
  applications: string[];
  environments: string[];
  selectedFilterKey?: string;
  currentFilterName?: string;
  mode: FilterMode;
  isDefaultCheckedForCreate: boolean;
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
    selectedFilterKey: undefined,
    isDefaultCheckedForCreate: false,
  };
  private filterService = new FilterService();

  public componentDidMount() {
    const { filters } = this.props;
    this.setState({
      applications: filters.applications,
      environments: filters.environments,
    });
  }

  public setExistingFilter() {
    const { affiliation, allFilters } = this.props;
    const { selectedFilterKey, environments, applications } = this.state;

    if (!selectedFilterKey) {
      const enabledFilter =
        this.filterService.findFilterByApplicationsAndEnvironments(
          allFilters,
          affiliation,
          applications,
          environments
        );
      if (enabledFilter) {
        this.setState({
          selectedFilterKey: enabledFilter.name,
        });
      }
    }
  }

  public clearOnAffiliationChange(prevAffiliation: string) {
    const { affiliation, updateFilter, allFilters } = this.props;
    if (prevAffiliation !== affiliation) {
      const defaultFilter = this.filterService.getDefaultFilter(
        allFilters,
        affiliation
      );
      if (defaultFilter) {
        this.setState({
          applications: defaultFilter.applications,
          environments: defaultFilter.environments,
          selectedFilterKey: defaultFilter.name,
          currentFilterName: defaultFilter.name,
          mode: FilterMode.Edit,
        });
        updateFilter({
          applications: defaultFilter.applications,
          environments: defaultFilter.environments,
        });
      } else {
        this.setState({
          applications: [],
          environments: [],
          selectedFilterKey: undefined,
          mode: FilterMode.Create,
        });
      }
    }
  }

  public componentDidUpdate(prevProps: IFilterProps) {
    const { applications, environments } = this.state;
    const { filters } = this.props;
    this.setExistingFilter();
    this.clearOnAffiliationChange(prevProps.affiliation);
    if (
      prevProps.filters !== filters &&
      applications.length === 0 &&
      environments.length === 0
    ) {
      this.setState({
        applications: this.props.filters.applications,
        environments: this.props.filters.environments,
      });
    }
  }

  public updateFilterState = (value: ICheckboxValue) => () => {
    const { applications, environments } = this.state;
    const isApplication = value.type === SelectionType.Applications;

    const values = isApplication ? applications : environments;
    if (!values.includes(value.name)) {
      if (isApplication) {
        this.setState((prevState) => ({
          applications: [...prevState.applications, value.name],
        }));
      } else {
        this.setState((prevState) => ({
          environments: [...prevState.environments, value.name],
        }));
      }
    } else {
      const newArray = this.filterService.removeElement(values, value.name);
      if (isApplication) {
        this.setState({
          applications: newArray,
        });
      } else {
        this.setState({
          environments: newArray,
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

  public applyFilter = (close: () => void) => {
    const { updateFilter, allFilters, affiliation, addErrors } = this.props;
    const {
      applications,
      environments,
      selectedFilterKey,
      mode,
      currentFilterName,
    } = this.state;
    if (this.hasCurrentFilterName() && this.noFilterOptionsSelected()) {
      addErrors([new Error('Ingen applikasjoner og miljøer valgt')]);
    } else {
      const getDefaultFilterName = this.filterService.getDefaultFilterName(
        allFilters,
        affiliation
      );
      updateFilter({
        name:
          mode === FilterMode.Create ? currentFilterName : selectedFilterKey,
        default: getDefaultFilterName === selectedFilterKey ? true : false,
        applications,
        environments,
      });
      this.setState({
        selectedFilterKey: currentFilterName,
      });
      close();
    }
  };

  public footerApplyButton = (close: () => void) => {
    const { allFilters, affiliation, className, updateFilter, addErrors } =
      this.props;
    const {
      selectedFilterKey,
      mode,
      currentFilterName,
      isDefaultCheckedForCreate,
    } = this.state;
    const applyNewFilter = () => this.applyFilter(close);
    const defaultFilter = this.filterService.getDefaultFilter(
      allFilters,
      affiliation
    );
    const findDefaultFilter = allFilters.find(
      (f) => f.name === selectedFilterKey && f.default
    );
    const currentFilter = allFilters.find(
      (filter) => filter.name === selectedFilterKey
    );
    const isCurrentFilterDefault =
      defaultFilter &&
      defaultFilter.default &&
      currentFilter &&
      defaultFilter.name === currentFilter.name;

    const isCreateMode = mode === FilterMode.Create;

    const handleDefaultValueChange = (): void => {
      if (this.hasCurrentFilterName() && this.noFilterOptionsSelected()) {
        addErrors([new Error('Ingen applikasjoner og miljøer valgt')]);
      } else {
        const isDefault = defaultFilter && findDefaultFilter;
        updateFilter({
          name: isCreateMode ? currentFilterName : selectedFilterKey,
          default: isCreateMode ? !isDefaultCheckedForCreate : !!!isDefault,
          applications:
            currentFilter && currentFilter.applications.length > 0
              ? currentFilter.applications
              : [],
          environments:
            currentFilter && currentFilter.environments.length > 0
              ? currentFilter.environments
              : [],
        });
        this.setState({
          selectedFilterKey: currentFilterName,
        });
        if (isCreateMode) {
          this.setState((prevState) => ({
            isDefaultCheckedForCreate: !prevState.isDefaultCheckedForCreate,
          }));
        }
      }
    };

    const renderCheckbox = (
      disabled: boolean,
      checked: boolean
    ): JSX.Element => (
      <CheckBox
        disabled={disabled}
        checked={checked}
        boxSide="start"
        label="Standardvalg"
        onChange={handleDefaultValueChange}
      />
    );

    return (
      <span className={className}>
        <FooterText
          filter={this.filterService.getDefaultFilterName(
            allFilters,
            affiliation
          )}
        />
        <div className="styled-footer-buttons">
          {isCreateMode
            ? renderCheckbox(!currentFilterName, isDefaultCheckedForCreate)
            : renderCheckbox(!selectedFilterKey, !!isCurrentFilterDefault)}
        </div>
        <ActionButton onClick={applyNewFilter}>Sett filter</ActionButton>
      </span>
    );
  };

  public setCurrentFilterName = (event: TextFieldEvent, newValue?: string) => {
    if (!newValue) {
      this.setState({
        isDefaultCheckedForCreate: false,
      });
    }
    this.setState({
      currentFilterName: newValue,
    });
  };

  public handleFilterChange: RadioButtonGroupProps['onChange'] = (
    ev,
    option
  ) => {
    const { allFilters, updateFilter } = this.props;
    if (option) {
      this.setState({
        selectedFilterKey: option.text,
        mode: FilterMode.Edit,
      });
      const currentFilter = allFilters.find(
        (filter) => filter.name === option.text
      );
      if (currentFilter) {
        this.setState({
          applications: currentFilter.applications,
          environments: currentFilter.environments,
          currentFilterName: currentFilter.name,
        });
        updateFilter({
          applications: currentFilter.applications,
          environments: currentFilter.environments,
        });
      }
    } else {
      this.setState({
        applications: [],
        environments: [],
        currentFilterName: undefined,
        selectedFilterKey: undefined,
      });
      updateFilter({ applications: [], environments: [] });
    }
  };

  public clearAllCheckboxes = (type: SelectionType) => {
    if (type === SelectionType.Applications) {
      this.setState({
        applications: [],
      });
    } else {
      this.setState({
        environments: [],
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
        applications: values,
      });
    } else {
      this.setState({
        environments: values,
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
        selectedFilterKey: undefined,
      });
    }
  };

  public render() {
    const { className, allFilters, affiliation, allDeployments } = this.props;
    const { applications, environments, selectedFilterKey, mode } = this.state;

    const selectionNames =
      this.filterService.createUniqueSelectionNames(allDeployments);

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
      if (m === FilterMode.Create) {
        this.setState({
          currentFilterName: '',
          isDefaultCheckedForCreate: false,
        });
      }
      this.setState({
        mode: m,
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
                  // TODO: Fix type
                  filterOptions={filterOptions as any}
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
                    <CheckBox
                      key={index}
                      boxSide={'start'}
                      label={application}
                      checked={applications.includes(application)}
                      onChange={this.updateFilterState({
                        name: application,
                        type: SelectionType.Applications,
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
                    <CheckBox
                      key={index}
                      boxSide={'start'}
                      label={environment}
                      checked={environments.includes(environment)}
                      onChange={this.updateFilterState({
                        name: environment,
                        type: SelectionType.Environments,
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
            // TODO: Fix type
            options={filterOptions as any}
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
  .styled-radio-buttons {
    white-space: nowrap;
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
  .styled-footer-buttons {
    display: inline-flex;
    padding-right: 10px;
    position: relative;
    top: 5px;

    /* 
      TODO: Fix in Designsystem
      After ugrading to Designsystem 1.6.0 the checkmark icon were placed too far down.
      This makes the icon centred again.
    */
    i {
      position: relative;
      bottom: 3px;
    }
  }
`;

export default styledFilter;

export const styledFilterConnected = connect(null, {
  addErrors: (errors: any[]) => addErrors({ errors }),
})(styledFilter);
