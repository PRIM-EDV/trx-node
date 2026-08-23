const { execSync } = require('child_process');
const pkg = require('../package.json');

const image = `prim/trx-node:${pkg.version}`;
const latest = `prim/trx-node:latest`;

console.log(`Building Docker image: ${image}...`);
execSync(`docker build -t ${image} -t ${latest} .`, { stdio: 'inherit' });