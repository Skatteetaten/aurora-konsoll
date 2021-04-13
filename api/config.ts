import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const { env } = process;

const PORT = Number(env.HTTP_PORT || 9090);

const GOBO_URL =
  env.INTEGRATIONS_GOBO_URL || 'http://gobo.aurora.utv.paas.skead.no';

export {
  PORT,
  GOBO_URL,
};
