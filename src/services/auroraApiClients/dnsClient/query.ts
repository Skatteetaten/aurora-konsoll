export interface DnsRawEntry {
  status: string;
  clusterId: string;
  appName: string;
  namespace: string;
  routeName: string;
  message: string;
  entry: {
    cname: string;
    host: string;
    ttl: number;
  };
}

export const dnsEntiress: DnsRawEntry[] = [];
