import GoboClient, { IDataAndErrors } from 'services/GoboClient';
import { IScanQuery, NETDEBUG_QUERY } from './query';

export interface INetdebugResult {
  status: string;
  open: IScanStatus[];
  failed: IScanStatus[];
}
export interface IScanStatus {
  status: string;
  message?: string;
  resolvedIp?: string;
  clusterNodeIp?: number;
}

export class NetdebugClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async findNetdebugStatus(
    host: string,
    port: string
  ): Promise<IDataAndErrors<IScanQuery>> {
    return await this.client.query<IScanQuery>({
      query: NETDEBUG_QUERY,
      variables: {
        host,
        port,
      },
    });
  }
}
