import * as React from 'react';
import styled from 'styled-components';

import ReactSelect from 'components/Select';

import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';
import InfoDialog from 'components/InfoDialog';

import { errorStateManager } from 'models/StateManager/ErrorStateManager';

import { IApplicationDeployment } from 'models/ApplicationDeployment';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Checkbox from 'aurora-frontend-react-komponenter/Checkbox';
import RadioButtonGroup from 'aurora-frontend-react-komponenter/RadioButtonGroup';
import TextField from 'aurora-frontend-react-komponenter/TextField';
import { IApplicationDeploymentFilters } from 'models/UserSettings';
import { IFilter } from 'services/DeploymentFilterService';
import SelectionButtons from './SelectionButtons';

export enum SelectionType {
  Applications,
  Environments
}

enum FilterMode {
  Create,
  Edit
}

interface IFilterProps extends IAuroraApiComponentProps {
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

interface IFilterChange {
  label: string;
  value: string;
}

interface IModeChange {
  key: FilterMode;
  text: string;
}

export class Filter extends React.Component<IFilterProps, IFilterState> {
  public state: IFilterState = {
    applications: [],
    environments: [],
    mode: FilterMode.Create
  };

  public componentDidMount() {
    const { filters } = this.props;
    this.setState({
      applications: filters.applications,
      environments: filters.environments
    });
  }

  public componentDidUpdate(prevProps: IFilterProps) {
    const { affiliation, allFilters } = this.props;
    const { selectedFilterKey, environments, applications } = this.state;

    if (!selectedFilterKey) {
      const enabledFilter = allFilters
        .filter(f => f.affiliation === affiliation)
        .find(
          f =>
            JSON.stringify(f.environments) === JSON.stringify(environments) &&
            JSON.stringify(f.applications) === JSON.stringify(applications)
        );
      if (enabledFilter) {
        this.setState({
          selectedFilterKey: enabledFilter.name
        });
      }
    }

    if (prevProps.affiliation !== affiliation) {
      this.setState({
        applications: [],
        environments: [],
        selectedFilterKey: undefined,
        mode: FilterMode.Create
      });
    }
  }

  public removeDuplicates = (list: string[], element: string) =>
    list.filter(item => item !== element);

  public updateApplicationFilter = (element: string) => () => {
    const { applications } = this.state;
    if (!applications.includes(element)) {
      this.setState(prevState => ({
        applications: [...prevState.applications, element]
      }));
    } else {
      const newArray = this.removeDuplicates(applications, element);
      this.setState(() => ({
        applications: newArray
      }));
    }
  };

  public updateEnvironmentFilter = (element: string) => () => {
    const { environments } = this.state;
    if (!environments.includes(element)) {
      this.setState(prevState => ({
        environments: [...prevState.environments, element]
      }));
    } else {
      const newArray = this.removeDuplicates(environments, element);
      this.setState({
        environments: newArray
      });
    }
  };

  public updateFilterNames = () => {
    const { allFilters, affiliation } = this.props;
    const filterNames = allFilters
      .filter(filter => filter.affiliation === affiliation)
      .map(filter => filter.name)
      .sort();
    return filterNames.map(name => ({
      value: name,
      label: name,
      key: name,
      text: name
    }));
  };

  public updateFilter = (close: () => void) => {
    const { updateFilter } = this.props;
    const { currentFilterName, applications, environments } = this.state;
    const applyChanges = () => {
      if (
        currentFilterName &&
        currentFilterName.length > 0 &&
        applications.length === 0 &&
        environments.length === 0
      ) {
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
    const values = this.removeDuplicateValues(type);
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

  public removeDuplicateValues = (type: SelectionType) => {
    const { allDeployments } = this.props;
    return allDeployments
      .map(
        deployment =>
          type === SelectionType.Applications
            ? deployment.name
            : deployment.environment
      )
      .filter((item, index, self) => self.indexOf(item) === index)
      .sort();
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
    const { className } = this.props;
    const { applications, environments, selectedFilterKey, mode } = this.state;

    const removedDuplicateApplications = this.removeDuplicateValues(
      SelectionType.Applications
    );
    const removedDuplicateEnvironments = this.removeDuplicateValues(
      SelectionType.Environments
    );
    const handleRadioButtonChange = (e: Event, option: IFilterChange) => {
      this.handleFilterChange(option);
    };

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

    const changeMode = (e: Event, option: IModeChange) => {
      this.setState({
        mode: option.key
      });
    };

    const renderMode = () => {
      if (mode === FilterMode.Create) {
        return (
          <>
            <h3>Lag filter:</h3>
            <TextField
              style={{ width: '190px' }}
              placeholder={'Navn'}
              onChanged={this.setCurrentFilterName}
            />
          </>
        );
      } else {
        return (
          <>
            <h3>Lagrede filtre:</h3>
            <div className="saved-filters">
              <RadioButtonGroup
                boxSide={'start'}
                options={this.updateFilterNames()}
                onChange={handleRadioButtonChange}
                selectedKey={selectedFilterKey}
              />
            </div>
            <ActionButton color="red" icon="Delete" onClick={this.deleteFilter}>
              Slett filter
            </ActionButton>
          </>
        );
      }
    };
    return (
      <>
        <InfoDialog
          title="Filter meny"
          renderFooterButtons={this.updateFilter}
          renderOpenDialogButton={renderOpenButton}
        >
          <div className={className}>
            <dl>
              <div className="styled-edit">
                <RadioButtonGroup
                  boxSide={'start'}
                  defaultSelectedKey={mode}
                  onChange={changeMode}
                  options={[
                    {
                      key: FilterMode.Create,
                      text: 'Nytt',
                      iconProps: { iconName: 'AddOutline' }
                    },
                    {
                      key: FilterMode.Edit,
                      text: 'Rediger',
                      iconProps: { iconName: 'Edit' }
                    }
                  ]}
                />
                {renderMode()}
              </div>
              <dt>
                <h3>Applikasjoner:</h3>
                <SelectionButtons
                  type={SelectionType.Applications}
                  onClear={this.clearAllCheckboxes}
                  onSelect={this.selectAllCheckboxes}
                />
                <div className="apps-and-envs">
                  {removedDuplicateApplications.map((application, index) => (
                    <Checkbox
                      key={index}
                      boxSide={'start'}
                      label={application}
                      checked={applications.includes(application)}
                      onChange={this.updateApplicationFilter(application)}
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
                  {removedDuplicateEnvironments.map((environment, index) => (
                    <Checkbox
                      key={index}
                      boxSide={'start'}
                      label={environment}
                      checked={environments.includes(environment)}
                      onChange={this.updateEnvironmentFilter(environment)}
                    />
                  ))}
                </div>
              </dt>
            </dl>
          </div>
        </InfoDialog>
        <ReactSelect
          options={this.updateFilterNames()}
          placeholder={'Velg filter'}
          selectedKey={selectedFilterKey}
          handleChange={this.handleFilterChange}
          isClearable={true}
        />
      </>
    );
  }
}

const styledFilter = styled(Filter)`
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

export const FilterWithApi = withAuroraApi(styledFilter);

export default styledFilter;
