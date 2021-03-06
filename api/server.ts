import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as tokenEncryption from './tokenEncryption';
import { logger } from './logger';

import {
  APPLICATION_NAME,
  AUTHORIZATION_URI,
  CLIENT_ID,
  DBH_ENABLED,
  GOBO_URL,
  PORT,
  SKAP_ENABLED,
  GAVEL_ENABLED,
} from './config';
import { managementInterfaceServer } from './ManagementInterface';

const app = express();

app.use(
  '/api/graphql',
  createProxyMiddleware({
    changeOrigin: true,
    target: GOBO_URL,
    onProxyReq(proxyReq, req) {
      const token = req.headers['authorization'];
      // The first time GOBO is called, the token may not have been encrypted yet.
      if (token) {
        const authToken = tokenEncryption.decrypt(token);
        proxyReq.setHeader('authorization', `Bearer ${authToken}`);
        req.headers.authorization = `Bearer ${authToken}`;
      }
    },
    pathRewrite: {
      '/api/graphql': '/graphql',
    },
  })
);

app.use(express.json());

app.get('/api/config', (req, res) => {
  return res.send({
    AUTHORIZATION_URI,
    CLIENT_ID,
    APPLICATION_NAME,
    DBH_ENABLED,
    SKAP_ENABLED,
    GAVEL_ENABLED,
  });
});

app.post('/api/log', (req, res) => {
  logger.log(req.body);
  return res.sendStatus(200);
});

app.get('/api/accept-token', (req, res) => {
  const accessToken = req.query.access_token;
  const expires_in = req.query.expires_in;
  const encryptedToken = tokenEncryption.encrypt(accessToken as string);
  res.send(
    `${req.protocol}://${req.get(
      'x-forwarded-host'
    )}/accept-token#access_token=${encryptedToken}&expires_in=${expires_in}`
  );
});

app.listen(PORT, () => {
  logger.info(`application server started on port ${PORT}`);
});

managementInterfaceServer.listen(8081, () => {
  logger.info(`management interface server started on port ${8081}`);
});
