/* tslint:disable:no-console */
import axios from 'axios';
import * as express from 'express';

import { AUTHORIZATION_URI, CLIENT_ID, GRAPHQL_URL, PORT } from './config';

const app = express();
app.use(express.json());

app.post('/api/graphql', async (req, res) => {
  const result = await axios.post(GRAPHQL_URL, req.body, {
    headers: {
      Authorization: req.header('Authorization')
    }
  });

  res.send(result.data);
});

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
