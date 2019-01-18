import { NextFunction, Request, Response } from 'express';
import { DocumentNode } from 'graphql';
import GraphQLClient from './GraphQLClient';

interface IRequest extends Request {
  graphqlClient: GraphQLClient;
}

export const graphqlClientMiddleware = (url: string) => (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const auth = req.header('Authorization');
  req.graphqlClient = new GraphQLClient({
    url,
    headers: {
      Authorization: auth || ''
    }
  });
  next();
};

export function queryCreator<T, R>(
  query: DocumentNode,
  transform: (data: T) => R,
  mapParamsToVariables?: (params: any) => any
) {
  return async (req: IRequest, res: Response) => {
    // tslint:disable-next-line:no-console
    console.log(req.params);
    const result = await req.graphqlClient.query<T>({
      query,
      variables: mapParamsToVariables
        ? mapParamsToVariables(req.params)
        : req.params
    });

    if (!result) {
      res.sendStatus(500).send('Internal server error');
    } else {
      res.send(transform(result.data));
    }
  };
}
