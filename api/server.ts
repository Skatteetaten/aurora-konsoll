/* tslint:disable:no-console */
import * as express from 'express';
import {
  AUTHORIZATION_URI,
  BOOBER_URL,
  CLIENT_ID,
  GRAPHQL_URL,
  PORT
} from './config';

import 'isomorphic-fetch';

const app = express();

app.get('/api/config', (req, res) => {
  return res.send({
    AUTHORIZATION_URI,
    CLIENT_ID,
    GRAPHQL_URL
  });
});

app.listen(PORT, () => {
  console.log(`started on port ${PORT}`);
});

interface ISpecQuery {
  ref: string;
}

app.post('/api/spec', async (req, res) => {
  const query = req.query as ISpecQuery;
  const result = await fetch(
    BOOBER_URL + '/v1/auroradeployspec/aurora/?aid=' + query.ref,
    {
      headers: {
        Authorization: `${req.headers.authorization}`
      }
    }
  );
  const body = await result.json();
  res.send(body.success ? body.items : []);
});
