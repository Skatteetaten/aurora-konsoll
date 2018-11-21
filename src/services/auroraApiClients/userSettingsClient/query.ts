import gql from 'graphql-tag';
import { IApplicationDeploymentFilters } from 'models/UserSettings';

export interface IUserSettingsQuery {
  userSettings: {
    applicationDeploymentFilters: IApplicationDeploymentFilters[];
  }
}

export const USERSETTINGS_QUERY = gql`
  query getUserSettingsForAllAffiliations {
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
