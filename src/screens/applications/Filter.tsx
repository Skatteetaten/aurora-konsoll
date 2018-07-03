import Grid from 'aurora-frontend-react-komponenter/Grid';
import * as React from 'react';
import { IApplicationResult } from 'services/AuroraApiClient';
import MulitDropdown, { MultiDropdownOptions } from './filter/MultiDropdown';

interface IFilterProps {
  applications: IApplicationResult[];
  handleSelectedApplications: (apps: IApplicationResult[]) => void;
}

interface IFilterState {
  selectedNamespaces: string[];
  selectedApplications: string[];
}

class Filter extends React.Component<IFilterProps, IFilterState> {
  public state: IFilterState = {
    selectedApplications: [],
    selectedNamespaces: []
  };

  public filterApplications = (
    list: string[],
    field: string,
    applications: IApplicationResult[]
  ) => {
    if (list.length === 0) {
      return applications;
    }
    return applications.filter(app => list.indexOf(app[field]) !== -1);
  };

  public filterAll = () => {
    const { selectedApplications, selectedNamespaces } = this.state;
    const { applications, handleSelectedApplications } = this.props;

    const apps = this.filterApplications(
      selectedNamespaces,
      'environment',
      applications
    );
    const result = this.filterApplications(selectedApplications, 'name', apps);

    handleSelectedApplications(result);
  };

  public updateSelectedList = (
    current: string[],
    data: MultiDropdownOptions
  ) => {
    if (data.selected) {
      return [...current, data.text];
    }
    return current.filter(name => name !== data.text);
  };

  public handleSelectedNamespaces = (data: MultiDropdownOptions) => {
    this.setState(state => {
      const selected = this.updateSelectedList(state.selectedNamespaces, data);
      return {
        selectedNamespaces: selected
      };
    });
  };

  public handleClearSelectedNamespaces = () => {
    this.setState(() => ({
      selectedNamespaces: []
    }));
  };

  public handleSelectedApplications = (data: MultiDropdownOptions) => {
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

  public handleClearSelectedApplications = () => {
    this.setState(() => ({
      selectedApplications: []
    }));
  };

  public componentDidMount() {
    this.filterAll();
  }

  public componentDidUpdate(prevProps: IFilterProps, prevState: IFilterState) {
    if (
      prevState.selectedNamespaces !== this.state.selectedNamespaces ||
      prevState.selectedApplications !== this.state.selectedApplications
    ) {
      this.filterAll();
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
              handleClearSelectedKeys={this.handleClearSelectedNamespaces}
              onChanged={this.handleSelectedNamespaces}
              selectedKeys={this.state.selectedNamespaces}
            />
          </Grid.Col>
          <Grid.Col lg={4}>
            <MulitDropdown
              placeHolder="Velg applikasjoner"
              options={applications.map(app => app.name.toLowerCase())}
              handleClearSelectedKeys={this.handleClearSelectedApplications}
              onChanged={this.handleSelectedApplications}
              selectedKeys={this.state.selectedApplications}
            />
          </Grid.Col>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Filter;
