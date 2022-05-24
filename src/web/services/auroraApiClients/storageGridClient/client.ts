import GoboClient, { IDataAndErrors } from 'web/services/GoboClient';
import {
  ObjectAreas,
  StorageGridObjectArea,
  StorageGridQuery,
  STORAGEGRID_AREAS_QUERY,
  STORAGEGRID_TENANT_QUERY,
  Tenant,
} from './query';

export interface AreasAndTenant {
  activeAreas?: StorageGridObjectArea[];
  isTenantRegistered?: boolean;
}

export class StorageGridClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async getAreasAndTenant(
    affiliation: string
  ): Promise<IDataAndErrors<AreasAndTenant>> {
    const tenant = await this.getTenant(affiliation);

    const isTenantRegistered =
      tenant.data?.affiliations.edges[0].node.storageGrid.tenant.isRegistered;

    if (isTenantRegistered === true) {
      const areas = await this.getAreas(affiliation);
      const activeAreas =
        areas.data?.affiliations.edges[0].node.storageGrid.objectAreas.active;

      return {
        name: areas.name,
        data: {
          isTenantRegistered,
          activeAreas: activeAreas,
        },
        errors: areas.errors,
      };
    }

    return {
      name: tenant.name,
      data: {
        isTenantRegistered,
        activeAreas: undefined,
      },
      errors: tenant.errors,
    };
  }

  public async getAreas(
    affiliation: string
  ): Promise<IDataAndErrors<StorageGridQuery<ObjectAreas>>> {
    return await this.client.query<StorageGridQuery<ObjectAreas>>({
      query: STORAGEGRID_AREAS_QUERY,
      variables: { affiliation },
    });
  }

  public async getTenant(
    affiliation: string
  ): Promise<IDataAndErrors<StorageGridQuery<Tenant>>> {
    return await this.client.query<StorageGridQuery<Tenant>>({
      query: STORAGEGRID_TENANT_QUERY,
      variables: { affiliation },
    });
  }
}
