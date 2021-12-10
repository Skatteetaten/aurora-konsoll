import gql from 'graphql-tag';

export const UPDATE_USERSETTINGS_MUTATION = gql`
  mutation updateUserSettings($input: UserSettingsInput!) {
    updateUserSettings(input: $input)
  }
`;
