import ApolloClient from 'apollo-boost';

import { IScanQuery, IScanStatusQuery, NETDEBUG_QUERY } from './query';

export interface INetdebugResult {
  status: string;
  open: IScanStatus[];
  failed: IScanStatus[];
}
export interface IScanStatus {
  status: string;
  message?: string;
  clusterNodeIp?: number;
}

export class NetdebugClient {
  private client: ApolloClient<{}>;

  constructor(client: ApolloClient<{}>) {
    this.client = client;
  }

  public async findNetdebugStatus(
    host: string,
    port: string
  ): Promise<INetdebugResult> {
    const result = await this.client.query<IScanQuery>({
      query: NETDEBUG_QUERY,
      variables: {
        host,
        port
      }
    });
    return this.showNetdebugStatus(result.data);
  }

  private showNetdebugStatus(item: IScanQuery): INetdebugResult {
    return {
      failed: this.normalizeScanStatus(item.scan.failed),
      open: this.normalizeScanStatus(item.scan.open),
      status: item.scan.status
    };
  }

  private normalizeScanStatus(scanStatus?: IScanStatusQuery): IScanStatus[] {
    if (!scanStatus) {
      return [];
    }

    return scanStatus.edges.map(edge => {
      const { clusterNode, message, status } = edge.node;
      return {
        clusterNodeIp: clusterNode && clusterNode.ip,
        message,
        status
      };
    });
  }
}
