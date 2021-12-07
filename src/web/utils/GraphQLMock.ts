import cors from 'cors';
import express from 'express';
import { Server } from 'http';
import GoboClient from 'web/services/GoboClient';
import { IApiClients } from 'web/models/AuroraApi';
import {
  ApplicationDeploymentClient,
  CertificateClient,
  DatabaseClient,
  ImageRepositoryClient,
  NetdebugClient,
  UserSettingsClient,
  WebsealClient,
} from 'web/services/auroraApiClients';
import { Socket } from 'net';
import { DnsClient } from 'web/services/auroraApiClients/dnsClient/client';

type ResponseMock = any;

interface IGraphQLResponseMock {
  [queryName: string]: ResponseMock;
}

export class GraphQLSeverMock {
  public port: number;
  public graphQLUrl: string;
  private server: Server;
  private responses: IGraphQLResponseMock[];
  private serverSockets = new Set<Socket>();

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

    // Keeps track of open connections that must be closed after test is done.
    this.server.on('connection', (socket) => {
      this.serverSockets.add(socket);
      socket.on('close', () => {
        this.serverSockets.delete(socket);
      });
    });
  }

  /**
   * Closes all connections and the server.
   */
  public close(done: jest.DoneCallback) {
    this.server.close(() => {
      done();
    });
    for (const socket of this.serverSockets.values()) {
      socket.destroy();
    }
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
    dnsClient: new DnsClient(clientMock),
  };
}
