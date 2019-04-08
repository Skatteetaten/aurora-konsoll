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
              basicAuthenticationMode
              port
              queryContentsURL
              authenticationHTTPheader
              serverDN
              allowWindowsStyleURLs
              caseInsensitiveURLs
              insertWebSphereLTPACookies
              insertWebSEALSessionCookies
              remoteAddressHTTPHeader
              delegationSupport
              junctionSoftLimit
              requestEncoding
              formsBasedSSO
              junctionHardLimit
              id
              operationalState
              currentRequests
              localIPAddress
              statefulJunction
              serverState
              hostname
              virtualHostname
              activeWorkerThreads
              type
              tfimjunctionSSO
              queryContents
              server1
              booleanRuleHeader
              virtualHostJunctionLabel
              mutuallyAuthenticated
              totalRequests
            }
          }
        }
      }
    }
  }
`;
