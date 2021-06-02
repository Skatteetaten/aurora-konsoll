import cors from 'cors';
import express, { Application } from 'express';
import { Server } from 'http';
import GoboClient from 'services/GoboClient';
import { IApiClients } from 'models/AuroraApi';
import {
  ApplicationDeploymentClient,
  CertificateClient,
  DatabaseClient,
  ImageRepositoryClient,
  NetdebugClient,
  UserSettingsClient,
  WebsealClient,
} from 'services/auroraApiClients';

type ResponseMock = any;

interface IGraphQLResponseMock {
  [queryName: string]: ResponseMock;
}

export class GraphQLSeverMock {
  public port: number;
  public graphQLUrl: string;
  private server: Server;
  private responses: IGraphQLResponseMock[];

  private serverSockets = new Set<any>();

  constructor(port?: number) {
    const PORT = port || randomPort(40000, 50000);
    const ENDPOINT = '/graphql';

    const server = express();
    server.use(cors());
    server.use(express.json());

    server.post(ENDPOINT, (req, res) => {
      const { operationName } = req.body;
      const responseMock = this.responses[operationName];
      console.log(req.rawHeaders);
      res.setHeader('Connection', 'close');
      if (!responseMock) {
        res.sendStatus(404);
      } else {
        res.send(responseMock);
      }
    });

    server.on('connection', (socket) => {
      this.serverSockets.add(socket);
      socket.on('close', () => {
        this.serverSockets.delete(socket);
      });
    });

    this.responses = [];
    this.server = server.listen(PORT);
    this.port = PORT;
    this.graphQLUrl = `http://localhost:${PORT}${ENDPOINT}`;
  }

  public close(fn?: () => void) {
    for (const socket of this.serverSockets.values()) {
      socket.destroy();
    }
    this.server.close(fn);
  }

  public putResponse(queryName: string, response: any) {
    this.responses[queryName] = response;
  }
}

function randomPort(start: number, stop: number): number {
  const random = Math.random() * (stop - start) + start;
  return Math.trunc(random);
}

export function goboClientMock(url: string): GoboClient {
  return new GoboClient({ url });
}

export function getApiClientsMock(serverMock: GraphQLSeverMock): IApiClients {
  const clientMock = goboClientMock(serverMock.graphQLUrl);
  return {
    applicationDeploymentClient: new ApplicationDeploymentClient(clientMock),
    certificateClient: new CertificateClient(clientMock),
    databaseClient: new DatabaseClient(clientMock),
    imageRepositoryClient: new ImageRepositoryClient(clientMock),
    netdebugClient: new NetdebugClient(clientMock),
    userSettingsClient: new UserSettingsClient(clientMock),
    websealClient: new WebsealClient(clientMock),
  };
}
