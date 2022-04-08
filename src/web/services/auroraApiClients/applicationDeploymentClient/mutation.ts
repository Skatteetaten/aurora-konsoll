import gql from 'graphql-tag';
import { AuroraConfigFileResource } from './query';

export interface DeployCurrentResponse {
  redeployWithCurrentVersion: {
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

interface ApplicationDeploymentRef {
  application: string;
  environment: string;
}

export interface DeployInput {
  applicationDeployment: ApplicationDeploymentRef[];
  auroraConfigName: string;
  auroraConfigReference: string;
}

export interface DeployResult {
  deploy: {
    applicationDeployments: { applicationDeploymentId: string }[];
    success: boolean;
  };
}

export const DEPLOY_MUTATION = gql`
  mutation deploy($input: DeployApplicationDeploymentInput!) {
    deploy(input: $input) {
      applicationDeployments {
        applicationDeploymentId
      }
      success
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
