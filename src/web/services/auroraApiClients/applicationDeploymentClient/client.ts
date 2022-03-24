import GoboClient, { IDataAndErrors } from 'web/services/GoboClient';
import {
  REDEPLOY_WITH_CURRENT_VERSION_MUTATION,
  REFRESH_APPLICATION_DEPLOYMENT_MUTATION,
  REFRESH_APPLICATION_DEPLOYMENTS_MUTATION,
  DELETE_APPLICATION_DEPLOYMENT_MUTATION,
  UpdateAuroraConfigFileInput,
  AuroraConfigFileValidationResponse,
  UPDATE_AURORA_CONFIG_FILE,
  DeployCurrentResponse,
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
  AuroraConfigFileResource,
  APPLICATION_DEPLOYMENT_FILES,
  IApplicationDeploymentWithFiles,
} from './query';
import { changeVersionInFile } from './utils';

export class ApplicationDeploymentClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async updateAuroraConfigRedeployAndRefreshDeployment(
    applicationDeploymentId: string,
    affiliation: string,
    version: string
  ) {
    const applicationDeployment = await this.refreshAndFetchAuroraConfigFiles(
      applicationDeploymentId
    );

    const auroraConfigFiles =
      applicationDeployment.data?.applicationDeployment.files;

    if (auroraConfigFiles === undefined) {
      return {
        errors: [
          new Error(`Could not find aurora config files for application`),
        ],
        name: 'Missing Aurora config files for application',
      };
    }

    const applicationFile: AuroraConfigFileResource | undefined =
      auroraConfigFiles.find((it) => it.type === 'APP');

    if (!applicationFile) {
      return {
        errors: [new Error(`An application must have an application file`)],
        name: 'Missing application file',
      };
    }

    const changedFile = changeVersionInFile(
      applicationFile.name,
      applicationFile.contents,
      version
    );

    if (changedFile instanceof Error) {
      return {
        errors: [changedFile],
        name: 'Parsing error',
      };
    }

    const auroraConfigReference =
      applicationDeployment.data?.applicationDeployment.details
        .applicationDeploymentCommand?.auroraConfig.gitReference ?? 'master';

    const updateFileResult = await this.updateAuroraConfigFile({
      auroraConfigName: affiliation,
      auroraConfigReference,
      contents: changedFile,
      existingHash: applicationFile.contentHash,
      fileName: applicationFile.name,
    });

    if (updateFileResult.data?.updateAuroraConfigFile.success) {
      const redeployResult = await this.redeployWithCurrentVersion(
        applicationDeploymentId
      );
      if (
        redeployResult.data?.redeployWithCurrentVersion?.applicationDeploymentId
      ) {
        return await this.refreshAndFetchApplicationDeployment(
          applicationDeploymentId
        );
      } else {
        return {
          name: redeployResult.name,
          errors: redeployResult.errors,
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

  public async refreshAndFetchAuroraConfigFiles(
    applicationDeploymentId: string
  ): Promise<IDataAndErrors<IApplicationDeploymentWithFiles>> {
    const refreshResult = await this.refreshApplicationDeployment(
      applicationDeploymentId
    );
    if (refreshResult.data && refreshResult.data.refreshApplicationDeployment) {
      return await this.fetchAuroraConfigFiles(applicationDeploymentId);
    } else {
      return {
        name: refreshResult.name,
        errors: refreshResult.errors,
      };
    }
  }

  public async fetchAuroraConfigFiles(
    applicationDeploymentId: string
  ): Promise<IDataAndErrors<IApplicationDeploymentWithFiles>> {
    return await this.client.query<IApplicationDeploymentWithFiles>({
      query: APPLICATION_DEPLOYMENT_FILES,
      variables: {
        id: applicationDeploymentId,
      },
    });
  }

  public async redeployWithCurrentVersion(
    applicationDeploymentId: string
  ): Promise<IDataAndErrors<DeployCurrentResponse>> {
    return await this.client.mutate<DeployCurrentResponse>({
      mutation: REDEPLOY_WITH_CURRENT_VERSION_MUTATION,
      variables: {
        input: {
          applicationDeploymentId,
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
