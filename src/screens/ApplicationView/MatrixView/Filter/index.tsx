import Grid from 'aurora-frontend-react-komponenter/Grid';
import * as React from 'react';
import { IApplication } from 'services/AuroraApiClient/types';
import MulitDropdown, { MultiDropdownOptions } from './MultiDropdown';

interface IFilterProps {
  applications: IApplication[];
  handleSelectedApplications: (apps: IApplication[]) => void;
}

interface IFilterState {
  selectedEnvironments: string[];
  selectedApplications: string[];
}

class Filter extends React.Component<IFilterProps, IFilterState> {
  public state: IFilterState = {
    selectedApplications: [],
    selectedEnvironments: []
  };

  public updateSelectedApplications = () => {
    const { selectedApplications, selectedEnvironments } = this.state;
    const { applications, handleSelectedApplications } = this.props;

    const filteredEnvironments = this.filterApplications(
      selectedEnvironments,
      'environment',
      applications
    );

    const result = this.filterApplications(
      selectedApplications,
      'name',
      filteredEnvironments
    );

    handleSelectedApplications(result);
  };

  public handleSelectedEnvironment = (data: MultiDropdownOptions) => {
    this.setState(state => {
      const selected = this.updateSelectedList(
        state.selectedEnvironments,
        data
      );
      return {
        selectedEnvironments: selected
      };
    });
  };

  public clearSelectedEnvironments = () => {
    this.setState(() => ({
      selectedEnvironments: []
    }));
  };

  public handleSelectedApplicationName = (data: MultiDropdownOptions) => {
    this.setState(state => {
      const selected = this.updateSelectedList(
        state.selectedApplications,
        data
      );
      return {
        selectedApplications: selected
      };
    });
  };

  public clearSelectedApplicationNames = () => {
    this.setState(() => ({
      selectedApplications: []
    }));
  };

  public componentDidMount() {
    this.updateSelectedApplications();
  }

  public componentDidUpdate(prevProps: IFilterProps, prevState: IFilterState) {
    if (
      prevState.selectedEnvironments !== this.state.selectedEnvironments ||
      prevState.selectedApplications !== this.state.selectedApplications
    ) {
      this.updateSelectedApplications();
    }
  }

  public render() {
    const { applications } = this.props;
    return (
      <Grid>
        <Grid.Row>
          <Grid.Col lg={4}>
            <MulitDropdown
              placeHolder="Velg miljøer"
              options={applications.map(app => app.environment.toLowerCase())}
              handleClearSelectedKeys={this.clearSelectedEnvironments}
              onChanged={this.handleSelectedEnvironment}
              selectedKeys={this.state.selectedEnvironments}
            />
          </Grid.Col>
          <Grid.Col lg={4}>
            <MulitDropdown
              placeHolder="Velg applikasjoner"
              options={applications.map(app => app.name.toLowerCase())}
              handleClearSelectedKeys={this.clearSelectedApplicationNames}
              onChanged={this.handleSelectedApplicationName}
              selectedKeys={this.state.selectedApplications}
            />
          </Grid.Col>
        </Grid.Row>
      </Grid>
    );
  }

  private filterApplications = (
    selectedKeys: string[],
    field: string,
    applications: IApplication[]
  ) => {
    if (selectedKeys.length === 0) {
      return applications;
    }
    return applications.filter(app => selectedKeys.indexOf(app[field]) !== -1);
  };

  private updateSelectedList = (
    current: string[],
    data: MultiDropdownOptions
  ) => {
    if (data.selected) {
      return [...current, data.text];
    }
    return current.filter(name => name !== data.text);
  };
}

export default Filter;
