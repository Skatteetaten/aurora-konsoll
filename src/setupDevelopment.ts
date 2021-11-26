import * as dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

const buffer = execSync('oc whoami -t');

const token = buffer.toString().trimEnd();
const expiresIn = Date.now() + 84000;

console.log(
  `
1. Log in to OpenShift
2. Click the link to store the token:
http://localhost:3000/accept-token#access_token=${token}&expires_in=${expiresIn}
`
);

require('./api/server');
