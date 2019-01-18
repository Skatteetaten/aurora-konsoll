import { GraphQLError, OperationDefinitionNode } from 'graphql';
import { DefinitionNode, DocumentNode, print } from 'graphql/language';

interface IVariables {
  [key: string]: any;
}

interface IGraphQLResult<T> {
  data: T;
  errors?: GraphQLError[];
}

interface IGraphQLClientOptions {
  headers?: Record<string, string>;
  url: string;
}

export interface IGraphQLQuery {
  query: DocumentNode;
  variables?: IVariables;
}

export interface IGraphQLMutation {
  mutation: DocumentNode;
  variables?: IVariables;
}

export default class GraphQLClient {
  private options: IGraphQLClientOptions;

  constructor(options: IGraphQLClientOptions) {
    this.options = options;
  }

  public async query<T>({
    query,
    variables
  }: IGraphQLQuery): Promise<IGraphQLResult<T> | undefined> {
    return await this.doRequest<T>(query, variables);
  }

  public async mutate<T>({
    mutation,
    variables
  }: IGraphQLMutation): Promise<IGraphQLResult<T> | undefined> {
    return await this.doRequest<T>(mutation, variables);
  }

  private async doRequest<T>(
    document: DocumentNode,
    variables?: IVariables
  ): Promise<IGraphQLResult<T> | undefined> {
    const res = await fetch(this.options.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        ...this.options.headers
      },
      body: JSON.stringify({
        operationName: this.getDocumentName(document.definitions),
        query: print(document),
        variables
      })
    });

    try {
      const data = await res.json();
      const errors: GraphQLError[] | undefined = data.errors;

      if (errors) {
        errors.forEach(err => {
          // tslint:disable-next-line:no-console
          console.log(err, this.getDocumentName(document.definitions));
        });
      }

      return {
        data: data.data,
        errors: data.errors
      };
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e);
      return;
    }
  }

  private getDocumentName(definitions: ReadonlyArray<DefinitionNode>): string {
    const names = definitions.map(
      (def: OperationDefinitionNode) => (def.name ? def.name.value : '')
    );

    return names.length > 0 ? names[0] : '';
  }
}
