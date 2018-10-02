import ApolloClient, {
  ApolloQueryResult,
  FetchResult,
  MutationOptions,
  OperationVariables,
  QueryOptions
} from 'apollo-boost';
import { OperationDefinitionNode } from 'graphql';
import ErrorStateManager from 'models/StateManager/ErrorStateManager';

export default class GoboClient {
  private apolloClient: ApolloClient<{}>;
  private errorSM: ErrorStateManager;

  constructor(apolloClient: ApolloClient<{}>, errorSM: ErrorStateManager) {
    this.apolloClient = apolloClient;
    this.errorSM = errorSM;
  }

  public async query<T>(
    options: QueryOptions<OperationVariables>
  ): Promise<ApolloQueryResult<T> | undefined> {
    try {
      return await this.apolloClient.query<T>(options);
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e);
      const def = options.query.definitions[0] as OperationDefinitionNode;
      const queryName = def.name ? def.name.value : '';
      const err = new Error((e as Error).message + ' query: ' + queryName);
      this.errorSM.addError(err);
      return;
    }
  }

  public async mutate<T>(
    options: MutationOptions<OperationVariables>
  ): Promise<FetchResult<T> | undefined> {
    try {
      return await this.apolloClient.mutate<T>(options);
    } catch (e) {
      this.errorSM.addError(e);
      return;
    }
  }
}
