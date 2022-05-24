const { env } = process;

const SERVER_PORT = Number(env.NODEJS_PORT || 9090);
const MANAGEMENT_PORT = Number(env.MANAGEMENT_PORT || 8081);

const GOBO_URL =
  env.INTEGRATIONS_GOBO_URL || 'http://gobo.aurora.utv.paas.skead.no';

const APPLICATION_NAME = env.APPLICATION_NAME || 'konsoll';

const DBH_ENABLED = !!env.INTEGRATIONS_DBH_URL;

const SKAP_ENABLED = !!env.INTEGRATIONS_SKAP_URL;

const GAVEL_ENABLED = !!env.INTEGRATIONS_GAVEL_URL;

const STORAGEGRID_ENABLED = !!env.STORAGEGRID_ENABLED;

const STORAGEGRID_INFORMATION_URL = env.STORAGEGRID_INFORMATION_URL;

const STORYTELLER_ENABLED = !!env.INTEGRATIONS_STORYTELLER_URL;

export {
  SERVER_PORT,
  MANAGEMENT_PORT,
  GOBO_URL,
  APPLICATION_NAME,
  DBH_ENABLED,
  SKAP_ENABLED,
  GAVEL_ENABLED,
  STORAGEGRID_ENABLED,
  STORAGEGRID_INFORMATION_URL,
  STORYTELLER_ENABLED,
};
