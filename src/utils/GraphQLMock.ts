import ApolloClient, { InMemoryCache } from 'apollo-boost';
import * as cors from 'cors';
import * as express from 'express';
import { Server } from 'http';

type ResponseMock = any;

interface IGraphQLResponseMock {
  [queryName: string]: ResponseMock;
}

export function graphqlClientMock(uri: string): ApolloClient<{}> {
  const client = new ApolloClient({
    cache: new InMemoryCache({
      addTypename: false
    }),

    uri
  });
  client.defaultOptions = {
    query: {
      fetchPolicy: 'network-only'
    }
  };
  return client;
}

export class GraphQLSeverMock {
  public port: number;
  public graphQLUrl: string;
  private server: Server;
  private responses: IGraphQLResponseMock[];

  constructor(port?: number) {
    const PORT = port || 48481;
    const ENDPOINT = '/graphql';

    const server = express();
    server.use(cors());
    server.use(express.json());

    server.post(ENDPOINT, (req, res) => {
      const { operationName } = req.body;
      const responseMock = this.responses[operationName];

      if (!responseMock) {
        res.sendStatus(404);
      } else {
        res.send(responseMock);
      }
    });

    this.responses = [];
    this.server = server.listen(PORT);
    this.port = PORT;
    this.graphQLUrl = `http://localhost:${PORT}${ENDPOINT}`;
  }

  public close() {
    this.server.close();
  }

  public putResponse(queryName: string, response: any) {
    this.responses[queryName] = response;
  }
}
