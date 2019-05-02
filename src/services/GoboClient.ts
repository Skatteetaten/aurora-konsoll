import { GraphQLError, OperationDefinitionNode } from 'graphql';
import { DefinitionNode, DocumentNode, print } from 'graphql/language';

import { v4 as uuid } from 'uuid';

import { addError } from 'models/StateManager/state/actions';
import createStoreWithApi from 'store';

interface IVariables {
  [key: string]: any;
}

interface IGoboResult<T> {
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
      const errors: GraphQLError[] | undefined = data.errors;

      if (errors) {
        errors.forEach(err => {
          this.addError(err, this.getDocumentName(document.definitions));
        });
      }

      return {
        data: data.data,
        errors: data.errors
      };
    } catch (e) {
      this.addError(e);
      return;
    }
  }

  private getDocumentName(definitions: ReadonlyArray<DefinitionNode>): string {
    const names = definitions.map((def: OperationDefinitionNode) =>
      def.name ? def.name.value : ''
    );

    return names.length > 0 ? names[0] : '';
  }

  private addError(e: Error, documentName?: string) {
    const err = !!documentName
      ? new Error(e.message + ' document: ' + documentName)
      : new Error(e.message);
    createStoreWithApi().dispatch<any>(addError(err));
  }
}
