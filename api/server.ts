import express from 'express';
import proxy from 'http-proxy-middleware';

import {
  APPLICATION_NAME,
  AUTHORIZATION_URI,
  CLIENT_ID,
  DBH_ENABLED,
  GOBO_URL,
  DOCKER_REGISTRY_FRONTEND_URL,
  PORT,
  SKAP_ENABLED
} from './config';

const app = express();
app.use(
  '/api/graphql',
  proxy({
    changeOrigin: true,
    target: GOBO_URL,
    pathRewrite: {
      '/api/graphql': '/graphql'
    }
  })
);

app.use(express.json());

app.get('/api/config', (req, res) => {
  return res.send({
    AUTHORIZATION_URI,
    CLIENT_ID,
    APPLICATION_NAME,
    DBH_ENABLED,
    SKAP_ENABLED
  });
});

app.get('/api/docker-registry/*', (req, res) => {
  res.redirect(`${DOCKER_REGISTRY_FRONTEND_URL}/tag/${req.params[0]}`);
});

app.post('/api/log', (req, res) => {
  console.log(req.body);
  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`started on port ${PORT}`);
});
