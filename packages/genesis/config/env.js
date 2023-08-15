const env = require('dotenv');
const path = require('path');

// grab root .env file
env.config({
  path: path.join(__dirname, '../.env'),
});

// grab local .env file if it exists
env.config({});

module.exports = { NODE_ENV, PRIVATE_KEY, WALLET, MNEMONIC, NETWORK, GAS } = process.env;
