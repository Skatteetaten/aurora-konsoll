/* tslint:disable:no-console */
import * as ClientOAuth2 from 'client-oauth2';
import * as express from 'express';

const app = express();

const CLIENT_ID = process.env.CLIENT_ID || 'aurora-openshift-console-dev';
const OPENSHIFT_CLUSTER = process.env.OPENSHIFT_CLUSTER || 'utv';

const CLUSTER_URL =
  process.env.CLUSTER_URL ||
  `https://${OPENSHIFT_CLUSTER}-master.paas.skead.no:8443`;

const AUTHORIZATION_URI =
  process.env.AUTHORIZATION_URI || `${CLUSTER_URL}/oauth/authorize`;

const REDIRECT_URI =
  process.env.ROUTE_URL || 'http://localhost:3000/accept-token';

app.get('/api/start-login', (req, res) => {
  const openshiftToken = new ClientOAuth2({
    authorizationUri: AUTHORIZATION_URI,
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI
  });

  const uri = openshiftToken.token.getUri();
  res.redirect(uri);
});

app.listen(Number(process.env.HTTP_PORT || 9090), () => {
  console.log('started on port 9090');
});
