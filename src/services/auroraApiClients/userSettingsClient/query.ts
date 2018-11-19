import gql from 'graphql-tag';

export interface IUserSettings {
  applicationDeploymentFilters: IApplicationDeploymentFilters[];
}

export interface IApplicationDeploymentFilters {
  name: string;
  affiliation: string;
  applications: string[];
  environments: string[];
}

export const USERSETTINGS_QUERY = gql`
  query getUserSettingsForAllAffiliation {
    userSettings {
      applicationDeploymentFilters {
        name
        affiliation
        applications
        environments
      }
    }
  }
`;
