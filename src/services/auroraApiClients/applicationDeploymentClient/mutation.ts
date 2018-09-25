import gql from 'graphql-tag';

export const REDEPLOY_WITH_VERSION_MUTATION = gql`
  mutation redeployWithVersion($input: ApplicationDeploymentVersionInput) {
    redeployWithVersion(input: $input)
  }
`;

export const REFRESH_APPLICATION_DEPLOYMENT_MUTATION = gql`
  mutation refreshApplicationDeployment(
    $input: ApplicationDeploymentRefreshInput
  ) {
    refreshApplicationDeployment(input: $input)
  }
`;
