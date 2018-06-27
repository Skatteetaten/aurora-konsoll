import { default as ApolloClient } from 'apollo-boost';

import { tokenStore } from 'services/TokenStore';

import {
  IUserAffiliationsQuery,
  USER_AFFILIATIONS_QUERY
} from './auroraApiClient/queries';

export interface IAuroraApiClient {
  findUserAndAffiliations: () => Promise<IUserAffiliationResult>;
}

export default class AuroraApiClient implements IAuroraApiClient {
  private client: ApolloClient<{}>;

  constructor(graphQLUrl: string) {
    this.client = new ApolloClient({
      request: async operations => {
        const token = tokenStore.getToken();
        operations.setContext({
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        });
      },
      uri: graphQLUrl
    });
  }

  public async findUserAndAffiliations(): Promise<IUserAffiliationResult> {
    const result = await this.client.query<IUserAffiliationsQuery>({
      query: USER_AFFILIATIONS_QUERY
    });

    return {
      affiliations: result.data.affiliations.edges.map(edge => edge.node.name),
      user: result.data.currentUser.name
    };
  }
}

export interface IUserAffiliationResult {
  affiliations: string[];
  user: string;
}
