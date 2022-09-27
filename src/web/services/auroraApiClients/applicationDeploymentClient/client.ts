import { GraphQLError } from 'graphql';
import GoboClient, { IDataAndErrors } from 'web/services/GoboClient';
import {
  REFRESH_APPLICATION_DEPLOYMENT_MUTATION,
  REFRESH_APPLICATION_DEPLOYMENTS_MUTATION,
  DELETE_APPLICATION_DEPLOYMENT_MUTATION,
  UpdateAuroraConfigFileInput,
  AuroraConfigFileValidationResponse,
  UPDATE_AURORA_CONFIG_FILE,
  DEPLOY_MUTATION,
  DeployInput,
  DeployResult,
} from './mutation';
import {
  APPLICATION_DEPLOYMENT_DETAILS_QUERY,
  APPLICATIONS_QUERY,
  IApplicationDeploymentDetailsQuery,
  IApplicationsConnectionData,
  IUserAndAffiliationsData,
  USER_AFFILIATIONS_QUERY,
  IApplicationDeploymentWithDetailsData,
  APPLICATION_DEPLOYMENT_WITH_DETAILS_QUERY,
  APPLICATION_FILES_QUERY,
  AuroraConfigResponse,
} from './query';
import { changeVersionInFile } from './utils';

export class ApplicationDeploymentClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async updateAppFileRedeployAndRefreshDeployment(
    applicationDeploymentId: string,
    version: string,
    affiliation: string,
    application: string,
    environment: string,
    refName: string
  ) {
    const applicationFiles = await this.refreshAndFetchApplicationFile(
      applicationDeploymentId,
      affiliation,
      application,
      environment,
      refName
    );

    const applicationFile =
      applicationFiles.data?.auroraConfig.applicationFiles[0].files[0];

    if (applicationFile === undefined || applicationFile.type !== 'APP') {
      return {
        errors: [
          new GraphQLError(
            `Could not find application file in branch=${refName}`
          ),
        ],
        name: 'Missing application file',
      };
    }

    const changedFile = changeVersionInFile(
      applicationFile.name,
      applicationFile.contents,
      version
    );

    if (changedFile instanceof GraphQLError) {
      return {
        errors: [changedFile],
        name: 'Parsing error',
      };
    }

    const updateFileResult = await this.updateAuroraConfigFile({
      auroraConfigName: affiliation,
      auroraConfigReference: refName,
      contents: changedFile,
      existingHash: applicationFile.contentHash,
      fileName: applicationFile.name,
    });

    if (updateFileResult.data?.updateAuroraConfigFile.success) {
      const redeployResult = await this.deploy({
        applicationDeployment: [
          { application: application, environment: environment },
        ],
        auroraConfigName: affiliation,
        auroraConfigReference: refName,
      });
      if (redeployResult.data?.deploy.success) {
        return await this.refreshAndFetchApplicationDeployment(
          applicationDeploymentId
        );
      } else {
        let errors: GraphQLError[] = redeployResult.errors ?? [];

        const errorMessage =
          redeployResult.data?.deploy.applicationDeployments[0].message;

        if (errorMessage) {
          // The errorhandler expects additional properties to be in the GraphQLError object "extensions".
          const err = new GraphQLError(
            'Deployment feilet',
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            { errorMessage }
          );

          errors = [...errors, err];
        }

        return {
          name: redeployResult.name,
          errors: errors,
        };
      }
    } else {
      return {
        name: updateFileResult.name,
        errors: updateFileResult.errors,
      };
    }
  }

  public async deleteAndRefreshApplications(
    affiliation: string,
    namespace: string,
    name: string
  ): Promise<IDataAndErrors<IApplicationsConnectionData>> {
    const deleteResponse = await this.deleteApplicationDeployment(
      namespace,
      name
    );
    if (
      deleteResponse.data &&
      deleteResponse.data.deleteApplicationDeployment
    ) {
      return await this.refreshAndFetchApplications([affiliation]);
    } else {
      return {
        name: deleteResponse.name,
        errors: deleteResponse.errors,
      };
    }
  }

  public async refreshAndFetchApplicationDeployment(
    applicationDeploymentId: string
  ): Promise<IDataAndErrors<IApplicationDeploymentWithDetailsData>> {
    const refreshResult = await this.refreshApplicationDeployment(
      applicationDeploymentId
    );
    if (refreshResult.data && refreshResult.data.refreshApplicationDeployment) {
      return await this.fetchApplicationDeploymentWithDetails(
        applicationDeploymentId
      );
    } else {
      return {
        name: refreshResult.name,
        errors: refreshResult.errors,
      };
    }
  }

  public async fetchApplicationDeploymentWithDetails(
    applicationDeploymentId: string
  ): Promise<IDataAndErrors<IApplicationDeploymentWithDetailsData>> {
    return await this.client.query<IApplicationDeploymentWithDetailsData>({
      query: APPLICATION_DEPLOYMENT_WITH_DETAILS_QUERY,
      variables: {
        id: applicationDeploymentId,
      },
    });
  }

  public async refreshAndFetchApplicationFile(
    applicationDeploymentId: string,
    affiliation: string,
    application: string,
    environment: string,
    refName: string
  ): Promise<IDataAndErrors<AuroraConfigResponse>> {
    const refreshResult = await this.refreshApplicationDeployment(
      applicationDeploymentId
    );
    if (refreshResult.data && refreshResult.data.refreshApplicationDeployment) {
      return await this.fetchApplicationFiles(
        affiliation,
        {
          application: application,
          environment: environment,
        },
        refName
      );
    } else {
      return {
        name: refreshResult.name,
        errors: refreshResult.errors,
      };
    }
  }

  public async fetchApplicationFiles(
    auroraConfig: string,
    applicationDeploymentRefInput: {
      application: string;
      environment: string;
    },
    refName?: string
  ): Promise<IDataAndErrors<AuroraConfigResponse>> {
    return await this.client.query<AuroraConfigResponse>({
      query: APPLICATION_FILES_QUERY,
      variables: {
        auroraConfig,
        applicationDeploymentRefInput,
        refName,
      },
    });
  }

  public async deploy({
    applicationDeployment,
    auroraConfigName,
    auroraConfigReference,
  }: DeployInput): Promise<IDataAndErrors<DeployResult>> {
    return await this.client.mutate<DeployResult>({
      mutation: DEPLOY_MUTATION,
      variables: {
        input: {
          applicationDeployment,
          auroraConfigName,
          auroraConfigReference,
        },
      },
    });
  }

  public async refreshApplicationDeployment(
    applicationDeploymentId: string
  ): Promise<IDataAndErrors<{ refreshApplicationDeployment: boolean }>> {
    return await this.client.mutate<{
      refreshApplicationDeployment: boolean;
    }>({
      mutation: REFRESH_APPLICATION_DEPLOYMENT_MUTATION,
      variables: {
        input: {
          applicationDeploymentId,
        },
      },
    });
  }

  public async refreshAndFetchApplications(
    affiliations: string[]
  ): Promise<IDataAndErrors<IApplicationsConnectionData>> {
    const refreshResponse = await this.refreshAffiliations(affiliations);
    if (
      refreshResponse.data &&
      refreshResponse.data.refreshApplicationDeployments
    ) {
      return await this.findAllApplicationDeployments(affiliations);
    } else {
      return {
        name: refreshResponse.name,
        errors: refreshResponse.errors,
      };
    }
  }

  public async refreshAffiliations(
    affiliations: string[]
  ): Promise<IDataAndErrors<{ refreshApplicationDeployments: boolean }>> {
    return await this.client.mutate<{
      refreshApplicationDeployments: boolean;
    }>({
      mutation: REFRESH_APPLICATION_DEPLOYMENTS_MUTATION,
      variables: {
        input: {
          affiliations,
        },
      },
    });
  }

  public async findApplicationDeploymentDetails(
    id: string
  ): Promise<IDataAndErrors<IApplicationDeploymentDetailsQuery> | undefined> {
    return await this.client.query<IApplicationDeploymentDetailsQuery>({
      query: APPLICATION_DEPLOYMENT_DETAILS_QUERY,
      variables: {
        id,
      },
    });
  }

  public async findUserAndAffiliations(): Promise<
    IDataAndErrors<IUserAndAffiliationsData>
  > {
    return await this.client.query<IUserAndAffiliationsData>({
      query: USER_AFFILIATIONS_QUERY,
    });
  }

  public async findAllApplicationDeployments(
    affiliations: string[]
  ): Promise<IDataAndErrors<IApplicationsConnectionData>> {
    return await this.client.query<IApplicationsConnectionData>({
      query: APPLICATIONS_QUERY,
      variables: {
        affiliations,
      },
    });
  }

  public async deleteApplicationDeployment(
    namespace: string,
    name: string
  ): Promise<IDataAndErrors<{ deleteApplicationDeployment: boolean }>> {
    return await this.client.mutate<{ deleteApplicationDeployment: boolean }>({
      mutation: DELETE_APPLICATION_DEPLOYMENT_MUTATION,
      variables: {
        input: {
          namespace,
          name,
        },
      },
    });
  }

  public async updateAuroraConfigFile({
    auroraConfigName,
    auroraConfigReference,
    fileName,
    contents,
    existingHash,
  }: UpdateAuroraConfigFileInput) {
    return await this.client.mutate<AuroraConfigFileValidationResponse>({
      mutation: UPDATE_AURORA_CONFIG_FILE,
      variables: {
        input: {
          auroraConfigName,
          auroraConfigReference,
          fileName,
          contents,
          existingHash,
        },
      },
    });
  }
}
