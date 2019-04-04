import gql from 'graphql-tag';
import { IWebsealViewState } from 'models/Webseal';

export interface IWebsealAffiliationQuery {
  affiliations: {
    edges: IWebsealStateEdge[];
  };
}
export interface IWebsealStateEdge {
  node: { websealStates: IWebsealViewState[] };
}

export const WEBSEAL_STATES_QUERY = gql`
  query getWebsealStates($affiliation: String!) {
    affiliations(name: $affiliation) {
      edges {
        node {
          websealStates {
            name
            namespace
            routeName
            acl {
              aclName
              anyOther
              open
              roles
            }
            junctions {
              activeWorkerThreads
              allowWindowsStyleURLs
              authenticationHTTPheader
              basicAuthenticationMode
              booleanRuleHeader
              caseInsensitiveURLs
              delegationSupport
              formsBasedSSO
              hostname
              id
              insertWebSEALSessionCookies
              insertWebSphereLTPACookies
              junctionHardLimit
              junctionSoftLimit
              mutuallyAuthenticated
              operationalState
              port
              queryContents
              queryContentsURL
              remoteAddressHTTPHeader
              requestEncoding
              server1
              serverDN
              serverState
              statefulJunction
              tfimjunctionSSO
              type
              virtualHostJunctionLabel
              virtualHostname
              localIPAddress
              currentRequests
              totalRequests
            }
          }
        }
      }
    }
  }
`;
