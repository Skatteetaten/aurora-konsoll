import * as React from 'react';

import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';
import InfoDialog from 'components/InfoDialog';

import { IApplicationDeployment } from 'models/ApplicationDeployment';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Checkbox from 'aurora-frontend-react-komponenter/Checkbox';
import { IUserSettings } from 'models/UserSettings';
import { IFilter } from 'services/DeploymentFilterService';

interface IFilterProps extends IAuroraApiComponentProps {
  affiliation: string;
  updateFilter: (applications: string[], environments: string[]) => void;
  allDeployments: IApplicationDeployment[];
  filters: IFilter;
}

interface IFilterState {
  applications: string[];
  environments: string[];
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
      this.updateFilter();
  }

  public componentDidUpdate(prevProps: IFilterProps) {
    const { affiliation } = this.props;
    if(prevProps.affiliation !== affiliation) {
      this.setState({
        applications: [],
        environments: []
      })
    }
  }

  public getUserSettings = async () => {
    const { clients, updateFilter } = this.props;
    const result = await clients.userSettingsClient.getUserSettings();
    updateFilter(
      result.applicationDeploymentFilters[0].applications,
      result.applicationDeploymentFilters[0].environments
    );
  };

  public updateUserSettings = async () => {
    const { clients } = this.props;

    const userSettings : IUserSettings = {
      applicationDeploymentFilters: [{
        name: 'testing',
        affiliation: 'aurora',
        applications: ['ao'],
        environments: ['dev']
      }]
    };
    const response = await clients.userSettingsClient.updateUserSettings(userSettings);
    // tslint:disable-next-line:no-console
    console.log(response);
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
      this.setState(() => ({
        environments: array
      }));
    }
  };

  public updateFilter = () => {
    const { updateFilter } = this.props;
    const { applications, environments } = this.state;
    const applyChanges = () => {
      updateFilter(applications, environments);
    };
    return <ActionButton onClick={applyChanges}>Sett filter</ActionButton>;
  };

  public render() {
    const { allDeployments } = this.props;
    const { applications, environments } = this.state;

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
        <ActionButton onClick={this.getUserSettings}>
          Get user settings
        </ActionButton>
        <ActionButton onClick={this.updateUserSettings}>
          Update user settings
        </ActionButton>
      </>
    );
  }
}

export default withAuroraApi(Filter);
