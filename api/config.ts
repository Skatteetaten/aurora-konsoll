const { env } = process;

const OPENSHIFT_CLUSTER = env.OPENSHIFT_CLUSTER || 'utv';

const CLUSTER_URL =
  env.CLUSTER_URL || `https://${OPENSHIFT_CLUSTER}-master.paas.skead.no:8443`;

const AUTHORIZATION_URI =
  env.AUTHORIZATION_URI || `${CLUSTER_URL}/oauth/authorize`;

const PORT = Number(env.HTTP_PORT || 9090);

const CLIENT_ID = env.CLIENT_ID || 'aurora-openshift-console-dev';

const GOBO_URL =
  env.INTEGRATIONS_GOBO_URL || 'http://gobo.aurora.utv.paas.skead.no';

const APPLICATION_NAME = env.APPLICATION_NAME || 'konsoll';

const DBH_ENABLED = !!env.INTEGRATIONS_DBH_URL;

const SKAP_ENABLED = !!env.INTEGRATIONS_SKAP_URL;

// Must be 256 bits (32 characters)
const TOKEN_ENCRYPTION_FRASE =
  env.TOKEN_ENCRYPTION_FRASE || 'UdONoTMessW1TH0leGunnarS0lSkjaer';

const STORYTELLER_URL = env.STORYTELLER_URL || 'https://frontend-aurora.utv.paas.skead.no';

export {
  CLIENT_ID,
  APPLICATION_NAME,
  AUTHORIZATION_URI,
  PORT,
  GOBO_URL,
  DBH_ENABLED,
  SKAP_ENABLED,
  TOKEN_ENCRYPTION_FRASE,
  STORYTELLER_URL
};
