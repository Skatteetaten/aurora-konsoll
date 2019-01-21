/* tslint:disable:no-console */
import * as express from 'express';
import 'isomorphic-fetch';

import { AUTHORIZATION_URI, CLIENT_ID, GRAPHQL_URL, PORT } from './config';
import { graphqlClientMiddleware } from './GraphQLRestMapper';

import { userAffiliationController } from './controllers/UserAffiliationController';

const app = express();

// Register middelwares
app.use(express.json());
app.use(graphqlClientMiddleware(GRAPHQL_URL));

// Register controllers
app.use(userAffiliationController);

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
