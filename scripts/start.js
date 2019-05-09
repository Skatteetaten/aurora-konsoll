const dotenv = require('dotenv');
const runAll = require('npm-run-all');

dotenv.config({ path: '.env.local' });

runAll(['start:api', 'start:web'], {
  parallel: true,
  printLabel: true,
  printName: true,
  stdout: process.stdout,
  stderr: process.stderr
});
