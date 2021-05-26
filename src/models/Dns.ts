export interface DnsEntry {
  appName: string;
  namespace: string;
  cname: string;
  routeName: string;
  ttl: number;
  status: string;
  message: string;
}
