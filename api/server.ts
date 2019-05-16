import express from 'express';
import proxy from 'http-proxy-middleware';

import {
  APPLICATION_NAME,
  AUTHORIZATION_URI,
  CLIENT_ID,
  DBH_ENABLED,
  GOBO_URL,
  DOCKER_REGISTRY_FRONTEND_URL,
  PORT,
  SKAP_ENABLED
} from './config';

const crypto = require('crypto'), 
      algorithm = 'aes-256-ctr',
      password = 'whatEverWorks';

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
    CLIENT_ID,
    APPLICATION_NAME,
    DBH_ENABLED,
    SKAP_ENABLED
  });
});

app.get('/api/docker-registry/*', (req, res) => {
  res.redirect(`${DOCKER_REGISTRY_FRONTEND_URL}/tag/${req.params[0]}`);
});

app.post('/api/log', (req, res) => {
  console.log(req.body);
  return res.sendStatus(200);
});

app.get('/api/accept-token', (req, res) => {
  const accessToken = res.location.arguments.access_token;
  const expires_in = res.location.arguments.expires_in;
  console.log(accessToken);
  console.log(encrypt(accessToken));
  
  res.redirect('/accept-token?expires_in=' + expires_in +'&access_token=' + encrypt(accessToken));
});

app.listen(PORT, () => {
  console.log(`started on port ${PORT}`);
});

function encrypt(text){
  var cipher = crypto.createCipher(algorithm, password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm, password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

