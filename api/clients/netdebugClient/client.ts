import GraphQLClient from '../../GraphQLClient';
import { IScanQuery, IScanStatusQuery, NETDEBUG_QUERY } from './query';

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
  private client: GraphQLClient;
  private errorMessage = {
    failed: [],
    open: [],
    status: 'Noe gikk galt'
  };

  constructor(client: GraphQLClient) {
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

    if (result && result.data) {
      return this.showNetdebugStatus(result.data);
    }
    return this.errorMessage;
  }

  private showNetdebugStatus(item: IScanQuery): INetdebugResult {
    if (item && item.scan) {
      return {
        failed: this.normalizeScanStatus(item.scan.failed),
        open: this.normalizeScanStatus(item.scan.open),
        status: item.scan.status
      };
    } else {
      return this.errorMessage;
    }
  }

  private normalizeScanStatus(scanStatus?: IScanStatusQuery): IScanStatus[] {
    if (!scanStatus) {
      return [];
    }

    return scanStatus.edges.map(edge => {
      const { clusterNode, message, status, resolvedIp } = edge.node;
      return {
        clusterNodeIp: clusterNode && clusterNode.ip,
        message,
        resolvedIp,
        status
      };
    });
  }
}
