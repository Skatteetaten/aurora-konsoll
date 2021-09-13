import gql from 'graphql-tag';
import { AuroraConfigFileResource } from './query';

export interface DeployResponse {
  redeployWithVersion: {
    applicationDeploymentId: string;
  } | null;
}

export interface UpdateAuroraConfigFileInput {
  auroraConfigName: string;
  auroraConfigReference?: string;
  fileName: string;
  contents: string;
  existingHash: string;
}

export interface AuroraConfigFileValidationResponse {
  updateAuroraConfigFile: {
    message?: string;
    success: boolean;
    file?: AuroraConfigFileResource;
  };
}

export const REDEPLOY_WITH_VERSION_MUTATION = gql`
  mutation redeployWithVersion($input: ApplicationDeploymentVersionInput!) {
    redeployWithVersion(input: $input) {
      applicationDeploymentId
    }
  }
`;

export const REDEPLOY_WITH_CURRENT_VERSION_MUTATION = gql`
  mutation redeployWithCurrentVersion($input: ApplicationDeploymentIdInput!) {
    redeployWithCurrentVersion(input: $input) {
      applicationDeploymentId
    }
  }
`;

export const REFRESH_APPLICATION_DEPLOYMENT_MUTATION = gql`
  mutation refreshApplicationDeployment(
    $input: RefreshByApplicationDeploymentIdInput!
  ) {
    refreshApplicationDeployment(input: $input)
  }
`;

export const REFRESH_APPLICATION_DEPLOYMENTS_MUTATION = gql`
  mutation refreshApplicationDeployments($input: RefreshByAffiliationsInput!) {
    refreshApplicationDeployments(input: $input)
  }
`;

export const DELETE_APPLICATION_DEPLOYMENT_MUTATION = gql`
  mutation deleteApplicationDeployment(
    $input: DeleteApplicationDeploymentInput!
  ) {
    deleteApplicationDeployment(input: $input)
  }
`;

export const UPDATE_AURORA_CONFIG_FILE = gql`
  mutation updateAuroraConfigFile($input: UpdateAuroraConfigFileInput!) {
    updateAuroraConfigFile(input: $input) {
      message
      success
      file {
        contentHash
        contents
      }
    }
  }
`;
