import * as dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

const buffer = execSync('oc whoami -t');

const token = buffer.toString().trimEnd();
const expiresIn = Date.now() + 84000;

console.log(
  `http://localhost:3000?access_token=${token}&expires_in=${expiresIn}`
);

require('./api/server');
