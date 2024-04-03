import { NETWORK_KEY_BY_RPC_URL, NETWORK_KEY_BY_RPC_URL_DYNAMIC } from './networks';
const main = async () => {
  console.log(NETWORK_KEY_BY_RPC_URL_DYNAMIC);
  console.log(NETWORK_KEY_BY_RPC_URL);
};

main().catch(console.error);
