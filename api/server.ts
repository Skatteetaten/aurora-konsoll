/* tslint:disable:no-console */
import * as express from 'express';
import { AUTHORIZATION_URI, CLIENT_ID, GRAPHQL_URL, PORT } from './config';

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
