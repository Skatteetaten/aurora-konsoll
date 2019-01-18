/* tslint:disable:no-console */
import * as express from 'express';
import 'isomorphic-fetch';

import { ApplicationDeploymentClient } from './clients';
import { AUTHORIZATION_URI, CLIENT_ID, GRAPHQL_URL, PORT } from './config';
import GoboClient from './GoboClient';

const app = express();
app.use(express.json());

const goboClient = new GoboClient({ url: GRAPHQL_URL });
const applicationClient = new ApplicationDeploymentClient(goboClient);

app.get('/api/applications', async (req, res) => {
  const result = await applicationClient.findAllApplicationDeployments([
    'aurora'
  ]);
  res.send(result);
});

app.get('/api/config', (req, res) => {
  return res.send({
    AUTHORIZATION_URI,
    CLIENT_ID,
    GRAPHQL_URL
  });
});

app.post('/api/log', (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`started on port ${PORT}`);
});
