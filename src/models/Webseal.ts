export interface IWebsealView {
  acl: { roles: string[] };
  name: string;
}

export interface IWebsealViewState {
  name: string;
  namespace: string;
  routeName: string;
  acl: IAcl;
  junctions: IJunction[];
}

export interface IAcl {
  aclName: string;
  anyOther: boolean;
  open: boolean;
  roles: string[];
}

export interface IJunction {
  activeWorkerThreads?: string;
  allowWindowsStyleURLs?: string;
  authenticationHTTPheader?: string;
  basicAuthenticationMode?: string;
  booleanRuleHeader?: string;
  caseInsensitiveURLs?: string;
  delegationSupport?: string;
  formsBasedSSO?: string;
  hostname?: string;
  id?: string;
  insertWebSEALSessionCookies?: string;
  insertWebSphereLTPACookies?: string;
  junctionHardLimit?: string;
  junctionSoftLimit?: string;
  mutuallyAuthenticated?: string;
  operationalState?: string;
  port?: string;
  queryContents?: string;
  queryContentsURL?: string;
  remoteAddressHTTPHeader?: string;
  requestEncoding?: string;
  server1?: string;
  serverDN?: string;
  serverState?: string;
  statefulJunction?: string;
  tfimjunctionSSO?: string;
  type?: string;
  virtualHostJunctionLabel?: string;
  virtualHostname?: string;
  localIPAddress?: string;
  currentRequests?: string;
  totalRequests?: string;
}
