/* tslint:disable:no-console */
import * as express from 'express';
import * as proxy from 'http-proxy-middleware';

import { AUTHORIZATION_URI, CLIENT_ID, GOBO_URL, PORT } from './config';

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
    CLIENT_ID
  });
});

app.post('/api/log', (req, res) => {
  console.log(req.body);
  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`started on port ${PORT}`);
});
