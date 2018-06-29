import Dropdown, {
  IDropdownOption
} from 'aurora-frontend-react-komponenter/Dropdown';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import * as React from 'react';
import { IApplicationResult } from 'services/AuroraApiClient';

interface IFilterProps {
  applications: IApplicationResult[];
  handleSelectedApplications: (apps: IApplicationResult[]) => void;
}

interface IFilterState {
  selectedNamespaces: string[];
  selectedApplications: string[];
}

type MultiDropdownOptions = IDropdownOption & { selected: boolean };

class Filter extends React.Component<IFilterProps, IFilterState> {
  public state: IFilterState = {
    selectedApplications: [],
    selectedNamespaces: []
  };

  public componentDidMount() {
    this.props.handleSelectedApplications(this.props.applications);
  }

  public filterApplications = (list: string[], field: string) => {
    if (list.length === 0) {
      this.props.handleSelectedApplications(this.props.applications);
      return;
    }
    const result = this.props.applications.filter(
      app => list.indexOf(app[field]) !== -1
    );
    this.props.handleSelectedApplications(result);
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

  public handleSelected = (field: string) => (data: MultiDropdownOptions) => {
    switch (field) {
      case 'namespace': {
        this.setState(state => {
          const selectedNamespaces = this.updateSelectedList(
            state.selectedNamespaces,
            data
          );
          this.filterApplications(selectedNamespaces, 'namespace');
          return {
            selectedNamespaces
          };
        });
        break;
      }
      case 'name': {
        this.setState(state => {
          const selectedApplications = this.updateSelectedList(
            state.selectedApplications,
            data
          );
          this.filterApplications(selectedApplications, 'name');
          return {
            selectedApplications
          };
        });
        break;
      }
    }
  };

  public render() {
    const { applications } = this.props;
    return (
      <Grid>
        <Grid.Row>
          <Grid.Col lg={3}>
            <Dropdown
              placeHolder="Velg miljøer"
              options={toDropdownOptions(applications, 'namespace')}
              multiSelect={true}
              onChanged={this.handleSelected('namespace')}
              selectedKeys={this.state.selectedNamespaces}
            />
          </Grid.Col>
          <Grid.Col lg={3}>
            <Dropdown
              placeHolder="Velg applikasjoner"
              options={toDropdownOptions(applications, 'name')}
              multiSelect={true}
              onChanged={this.handleSelected('name')}
              selectedKeys={this.state.selectedApplications}
            />
          </Grid.Col>
        </Grid.Row>
      </Grid>
    );
  }
}

function toDropdownOptions(
  applications: IApplicationResult[],
  field: string
): IDropdownOption[] {
  return applications
    .map(app => app[field].toLowerCase())
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort()
    .reduce(
      (acc: IDropdownOption[], name) => [
        ...acc,
        {
          key: name,
          text: name
        }
      ],
      []
    );
}
export default Filter;
