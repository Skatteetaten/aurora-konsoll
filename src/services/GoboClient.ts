import { GraphQLError, OperationDefinitionNode } from 'graphql';
import { DefinitionNode, DocumentNode, print } from 'graphql/language';

import { v4 as uuid } from 'uuid';

interface IVariables {
  [key: string]: any;
}

export interface IGoboResult<T> {
  name: string;
  data: T;
  errors?: GraphQLError[];
}

interface IGoboClientOptions {
  headers?: Record<string, string>;
  url: string;
}

interface IGoboQuery {
  query: DocumentNode;
  variables?: IVariables;
}

interface IGoboMutation {
  mutation: DocumentNode;
  variables?: IVariables;
}

export default class GoboClient {
  private options: IGoboClientOptions;

  constructor(options: IGoboClientOptions) {
    this.options = options;
  }

  public async query<T>({
    query,
    variables
  }: IGoboQuery): Promise<IGoboResult<T> | undefined> {
    return await this.doRequest<T>(query, variables);
  }

  public async mutate<T>({
    mutation,
    variables
  }: IGoboMutation): Promise<IGoboResult<T> | undefined> {
    return await this.doRequest<T>(mutation, variables);
  }

  private async doRequest<T>(
    document: DocumentNode,
    variables?: IVariables
  ): Promise<IGoboResult<T> | undefined> {
    const res = await fetch(this.options.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Korrelasjonsid: uuid(),
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
      return {
        data: data.data,
        errors: data.errors,
        name: this.getDocumentName(document.definitions)
      };
    } catch (e) {
      return;
      // return {
      //   data: {},
      //   name: this.getDocumentName(document.definitions)
      // };
    }
  }

  private getDocumentName(definitions: ReadonlyArray<DefinitionNode>): string {
    const names = definitions.map((def: OperationDefinitionNode) =>
      def.name ? def.name.value : ''
    );

    return names.length > 0 ? names[0] : '';
  }
}
