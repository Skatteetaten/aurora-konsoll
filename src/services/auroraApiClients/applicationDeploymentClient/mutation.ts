import gql from 'graphql-tag';

export const REDEPLOY_WITH_VERSION_MUTATION = gql`
  mutation redeployWithVersion($input: ApplicationDeploymentVersionInput) {
    redeployWithVersion(input: $input)
  }
`;
