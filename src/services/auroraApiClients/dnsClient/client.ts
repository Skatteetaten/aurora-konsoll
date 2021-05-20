import GoboClient, { IDataAndErrors } from 'services/GoboClient';
import { dnsEntiress, DnsRawEntry } from './query';

export interface IDnsQuery {
  dnsEntires: DnsRawEntry[];
}

export class DnsClient {
  private client: GoboClient;

  constructor(client: GoboClient) {
    this.client = client;
  }

  public async fetchDnsEntries(
    affiliation: string
  ): Promise<IDataAndErrors<IDnsQuery>> {
    await new Promise((r) => setTimeout(r, 1000));
    return { data: { dnsEntires: dnsEntiress }, name: 'test' };
  }
}
