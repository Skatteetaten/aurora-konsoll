import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { logger } from './logger';

import {
  SERVER_PORT,
  MANAGEMENT_PORT,
  GOBO_URL,
  APPLICATION_NAME,
  DBH_ENABLED,
  GAVEL_ENABLED,
  SKAP_ENABLED,
  STORYTELLER_ENABLED,
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
    onProxyReq(proxyReq, req) {
      // TODO: This should be fixed. This is only for local development.
      // Gobo client does not send bearer because the token is encrypted and
      // will be added after decryption in aurora-konsoll-spa application.
      if (!req.headers.authorization?.startsWith('Bearer')) {
        proxyReq.setHeader(
          'Authorization',
          `Bearer ${req.headers.authorization}`
        );
      }
    },
  })
);

app.get('/api/konsoll/config', (req, res) => {
  return res.send({
    APPLICATION_NAME,
    DBH_ENABLED,
    SKAP_ENABLED,
    GAVEL_ENABLED,
    STORYTELLER_ENABLED,
  });
});

app.use(express.json());

app.post('/api/log', (req, res) => {
  logger.log(req.body);
  return res.sendStatus(200);
});

app.listen(SERVER_PORT, () => {
  logger.info(`application server started on port ${SERVER_PORT}`);
});

managementInterfaceServer.listen(MANAGEMENT_PORT, () => {
  logger.info(`management interface server started on port ${MANAGEMENT_PORT}`);
});
