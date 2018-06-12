/* tslint:disable:no-console */
import * as ClientOAuth2 from 'client-oauth2';
import * as express from 'express';

const app = express();
const { env } = process;

const CLIENT_ID = env.CLIENT_ID || 'aurora-openshift-console-dev';
const OPENSHIFT_CLUSTER = env.OPENSHIFT_CLUSTER || 'utv';

const CLUSTER_URL =
  env.CLUSTER_URL || `https://${OPENSHIFT_CLUSTER}-master.paas.skead.no:8443`;

const AUTHORIZATION_URI =
  env.AUTHORIZATION_URI || `${CLUSTER_URL}/oauth/authorize`;

const REDIRECT_HOST = env.ROUTE_URL || 'http://localhost:3000';

const REDIRECT_URI = env.REDIRECT_URI || `${REDIRECT_HOST}/accept-token`;

app.get('/api/start-login', (req, res) => {
  const openshiftToken = new ClientOAuth2({
    authorizationUri: AUTHORIZATION_URI,
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI
  });

  const uri = openshiftToken.token.getUri();
  res.redirect(uri);
});

app.listen(Number(env.HTTP_PORT || 9090), () => {
  console.log('started on port 9090');
});
