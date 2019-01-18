/* tslint:disable:no-console */
import * as express from 'express';
import 'isomorphic-fetch';

import {
  getAllApplicationDeployments,
  getUserAndAffiliations
} from './clients/applicationDeploymentClient/client2';

import { AUTHORIZATION_URI, CLIENT_ID, GRAPHQL_URL, PORT } from './config';
import { graphqlClientMiddleware } from './GraphQLRestMapper';

const app = express();
app.use(express.json());
app.use(graphqlClientMiddleware(GRAPHQL_URL));

app.get('/api/user', getUserAndAffiliations);
app.get('/api/:affiliation/applications', getAllApplicationDeployments);

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
