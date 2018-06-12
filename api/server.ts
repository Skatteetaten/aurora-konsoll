import * as ClientOAuth2 from 'client-oauth2';
import * as express from 'express';

const app = express();

app.get('/api/login', async (req, res) => {
  const openshiftToken = new ClientOAuth2({
    accessTokenUri: 'https://utv-master.paas.skead.no:8443/oauth/token',
    authorizationUri: 'https://utv-master.paas.skead.no:8443/oauth/authorize',
    clientId: 'aurora-openshift-console-dev',
    clientSecret: 'token',
    redirectUri: 'http://aurora-konsoll-paas-mokey.utv.paas.skead.no/api/login',
    scopes: []
  });

  const uri = openshiftToken.token.getUri();
  const token = await openshiftToken.token.getToken(uri);
  return res.send(token);
});

app.listen(Number(process.env.HTTP_PORT || 9090), () => {
  /* tslint:disable:no-console */
  console.log('started on port 9091');
});
