import * as React from 'react';

import { IAuroraApiComponentProps, withAuroraApi } from 'components/AuroraApi';
import InfoDialog from 'components/InfoDialog';

import { IApplicationDeployment } from 'models/ApplicationDeployment';

import ActionButton from 'aurora-frontend-react-komponenter/ActionButton';
import Checkbox from 'aurora-frontend-react-komponenter/Checkbox';

interface IFilterProps extends IAuroraApiComponentProps {
  affiliation: string;
  updateFilter: (applications: string[], environments: string[]) => void;
  allDeployments: IApplicationDeployment[];
  filteredDeployments: IApplicationDeployment[];
}

interface IFilterState {
  applications: string[];
  environments: string[];
}

class Filter extends React.Component<IFilterProps, IFilterState> {
  public state: IFilterState = {
    applications: [],
    environments: []
  };

  // this is what you have to do, to get the getUserSettings under to work for testing in paas:
  // echo '[{"name":"paasfilter", "affiliation":"paas", "applications": ["wallboard"], "environments": ["martin-dev"]}]' | http PATCH http://k82814-boober.aurora.utv.paas.skead.no/v1/users/annotations/applicationDeploymentFilters Authorization:"Bearer ..." Content-Type:"application/json"

  public getUserSettings = async () => {
    const { clients, updateFilter } = this.props;
    const result = await clients.userSettingsClient.getUserSettings();
    updateFilter(
      result.userSettings.applicationDeploymentFilters[0].applications,
      result.userSettings.applicationDeploymentFilters[0].environments
    );
  };

  // NEXT STEPS:
  // Clear filter on exit from dialog and affiliation change, see point in "TO BE DISCUSSED"
  // make mutation in services to be able to creat/delete/update filter
  // design it (make two separate columns to fill apps and envs)
  // dropdown to choose filters

  // TO BE DISCUSSED:
  // * Clear filter when exit dialogBox without clicking SET FILTER? (can be handled in the infoDialog componenet).
  // Or handle when affiliation is changed in the controller
  // maybe CLEAR FILTER after applying it
  // has to be handled in the infoDialog componenet
  // * Should checkboxes always be checked if chosen in the URL params(make a function to clear).
  // Or should they always be empty (make a function to fill with URL params)

  public updateApplicationFilter(element: string) {
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
  }

  public updateEnvironmentFilter(element: string) {
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
  }

  public checkFilterTypeToSet = (element: any, type: string) => () => {
    switch (type) {
      case 'application': {
        this.updateApplicationFilter(element);
        break;
      }
      case 'environment': {
        this.updateEnvironmentFilter(element);
        break;
      }
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

    const removedDuplicateApplications = allDeployments
      .map(deployment => deployment.name)
      .filter((item, index, self) => self.indexOf(item) === index);
    const removedDuplicateEnvironments = allDeployments
      .map(deployment => deployment.environment)
      .filter((item, index, self) => self.indexOf(item) === index);

    // tslint:disable-next-line:no-console
    console.log(this.state.applications);
    // tslint:disable-next-line:no-console
    console.log(this.state.environments);

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
                onChange={this.checkFilterTypeToSet(application, 'application')}
              />
            ))}
            environments:
            {removedDuplicateEnvironments.map((environment, index) => (
              <Checkbox
                key={index}
                boxSide={'start'}
                label={environment}
                onChange={this.checkFilterTypeToSet(environment, 'environment')}
              />
            ))}
          </>
        </InfoDialog>
        <ActionButton onClick={this.getUserSettings}>
          Get user settings
        </ActionButton>
      </>
    );
  }
}

export const FilterWithApi = withAuroraApi(Filter);
