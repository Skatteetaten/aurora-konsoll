import cors from 'cors';
import express from 'express';
import { Server } from 'http';
import GoboClient from 'services/GoboClient';

type ResponseMock = any;

interface IGraphQLResponseMock {
  [queryName: string]: ResponseMock;
}

export function goboClientMock(url: string): GoboClient {
  return new GoboClient({
    url
  });
}

export class GraphQLSeverMock {
  public port: number;
  public graphQLUrl: string;
  private server: Server;
  private responses: IGraphQLResponseMock[];

  constructor(port?: number) {
    const PORT = port || randomPort(40000, 50000);
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

function randomPort(start: number, stop: number): number {
  const random = Math.random() * (stop - start) + start;
  return Math.trunc(random);
}
