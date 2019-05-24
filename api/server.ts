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
  SKAP_ENABLED,
  TOKEN_ENCRYPTION_FRASE
} from './config';

const crypto = require('crypto'), 
      algorithm = 'aes-256-ctr',
      password = TOKEN_ENCRYPTION_FRASE;

const app = express();

app.use(
  '/api/graphql',
  proxy({
    changeOrigin: true,
    target: GOBO_URL,    
    onProxyReq(proxyReq, req, res) {
      const token = req.headers['authorization'];
      // The first time GOBO is called, the token may not have been encrypted yet.
      if (token) {
        if (isEncrypted(token)) {
          const authToken = decrypt(token);
          proxyReq.setHeader('authorization', 'Bearer ' + authToken);
          req.headers.authorization = 'Bearer ' + authToken;
        } else {
          proxyReq.setHeader('authorization', 'Bearer ' + token);
          req.headers.authorization = 'Bearer ' + token;
        }        
      }
    },  
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
  const accessToken = req.query.access_token; 
  const expires_in = req.query.expires_in;  
  const encryptedToken = encrypt(accessToken);
  res.send(`${req.protocol}://${req.get('x-forwarded-host')}/accept-token#access_token=${encryptedToken}&expires_in=${expires_in}`);
});

app.listen(PORT, () => {
  console.log(`started on port ${PORT}`);
});

function isEncrypted(value) {
  const result = decrypt(value);
  if (result !== value) {
    return true;
  } else {
    return false;
  }
}

function encrypt(text){
  var cipher = crypto.createCipher(algorithm, password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  try {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
  } catch (err) {
    return text
  }
}

