export interface IWebsealView {
  acl: { roles: string[] };
  name: string;
}

export interface IWebsealState {
  name: string;
  namespace: string;
  routeName: string;
  acl: IAcl;
  junctions: string[];
}

export interface IAcl {
  aclName: string;
  anyOther: boolean;
  open: boolean;
  roles: string[];
}
