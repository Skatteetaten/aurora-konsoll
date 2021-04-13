import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { logger } from './logger';

import {
  GOBO_URL,
  PORT,
} from './config';
import { managementInterfaceServer } from './ManagementInterface';

const app = express();

app.use(
  '/api/graphql',
  createProxyMiddleware({
    changeOrigin: true,
    target: GOBO_URL,
    pathRewrite: {
      '/api/graphql': '/graphql',
    },
  })
);

app.use(express.json());

app.post('/api/log', (req, res) => {
  logger.log(req.body);
  return res.sendStatus(200);
});

app.listen(PORT, () => {
  logger.info(`application server started on port ${PORT}`);
});

managementInterfaceServer.listen(8092, () => {
  logger.info(`management interface server started on port ${8092}`);
});
