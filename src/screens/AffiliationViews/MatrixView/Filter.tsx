import * as React from 'react';

import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';
import InfoDialog from 'components/InfoDialog';

import { IApplicationDeployment } from 'models/ApplicationDeployment';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Checkbox from 'aurora-frontend-react-komponenter/Checkbox';
import Dropdown, {
  IDropdownOption
} from 'aurora-frontend-react-komponenter/Dropdown';
import TextField from 'aurora-frontend-react-komponenter/TextField';
import { IApplicationDeploymentFilters } from 'models/UserSettings';
import { IFilter } from 'services/DeploymentFilterService';

interface IFilterProps extends IAuroraApiComponentProps {
  affiliation: string;
  updateFilter: (filter: IFilter) => void;
  allDeployments: IApplicationDeployment[];
  filters: IFilter;
  allFilters: IApplicationDeploymentFilters[];
}

interface IFilterState {
  applications: string[];
  environments: string[];
  selectedFilterKey?: string;
  currentFilterName?: string;
}

export class Filter extends React.Component<IFilterProps, IFilterState> {
  public state: IFilterState = {
    applications: [],
    environments: []
  };

  public componentDidMount() {
    const { filters } = this.props;
    this.setState({
      applications: filters.applications,
      environments: filters.environments
    });
  }

  public componentDidUpdate(prevProps: IFilterProps) {
    const { affiliation } = this.props;

    if (prevProps.affiliation !== affiliation) {
      this.setState({
        applications: [],
        environments: [],
        selectedFilterKey: undefined
      });
    }
  }

  public updateApplicationFilter = (element: string) => () => {
    const { applications } = this.state;
    if (!applications.includes(element)) {
      this.setState(prevState => ({
        applications: [...prevState.applications, element]
      }));
    } else {
      const array = this.state.applications.filter(item => {
        return item !== element;
      });
      this.setState(() => ({
        applications: array
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
      const array = this.state.environments.filter(item => {
        return item !== element;
      });
      this.setState({
        environments: array
      });
    }
  };

  public updateFilterNames = () => {
    const { allFilters, affiliation } = this.props;

    const filterNames = allFilters
      .filter(filter => filter.affiliation === affiliation)
      .map(filter => filter.name);
    const keyAndFilterNames = filterNames.map(name => ({
      text: name,
      key: name
    }));

    return keyAndFilterNames;
  };

  public updateFilter = (close: () => void) => {
    const { updateFilter } = this.props;
    const { currentFilterName, applications, environments } = this.state;
    const applyChanges = () => {
      updateFilter({
        name: currentFilterName,
        applications,
        environments
      });
      this.setState({
        selectedFilterKey: currentFilterName
      });
      close();
    };
    return <ActionButton onClick={applyChanges}>Sett filter</ActionButton>;
  };

  public setCurrentFilterName = (filterName: string) => {
    this.setState({
      currentFilterName: filterName
    });
  };

  public handleFilterChange = (option: IDropdownOption) => {
    const { allFilters, updateFilter } = this.props;
    this.setState({
      selectedFilterKey: option.key
    });
    const currentFilter = allFilters.find(filter => filter.name === option.key);

    if (currentFilter) {
      updateFilter({
        applications: currentFilter.applications,
        environments: currentFilter.environments
      });
    }
  };

  public render() {
    const { allDeployments } = this.props;
    const { applications, environments, selectedFilterKey } = this.state;

    const removedDuplicateApplications = allDeployments
      .map(deployment => deployment.name)
      .filter((item, index, self) => self.indexOf(item) === index);
    const removedDuplicateEnvironments = allDeployments
      .map(deployment => deployment.environment)
      .filter((item, index, self) => self.indexOf(item) === index);
    return (
      <>
        <InfoDialog title="Velg filter" renderFooterButtons={this.updateFilter}>
          <>
            <TextField
              placeHolder={'Filter navn'}
              value={selectedFilterKey}
              onChanged={this.setCurrentFilterName}
            />
            applications:
            {removedDuplicateApplications.map((application, index) => (
              <Checkbox
                key={index}
                boxSide={'start'}
                label={application}
                checked={applications.includes(application)}
                onChange={this.updateApplicationFilter(application)}
              />
            ))}
            environments:
            {removedDuplicateEnvironments.map((environment, index) => (
              <Checkbox
                key={index}
                boxSide={'start'}
                label={environment}
                checked={environments.includes(environment)}
                onChange={this.updateEnvironmentFilter(environment)}
              />
            ))}
          </>
        </InfoDialog>
        <Dropdown
          style={{ width: '150px' }}
          placeHolder={'Sett Filter'}
          options={this.updateFilterNames()}
          onChanged={this.handleFilterChange}
          selectedKey={selectedFilterKey}
        />
      </>
    );
  }
}

export default withAuroraApi(Filter);
