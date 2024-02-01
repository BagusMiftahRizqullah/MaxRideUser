import Config from 'react-native-config';
import {io} from 'socket.io-client';

const GOOGLE_API_KEY = Config.GOOGLE_API_KEY;
const MAP_BOX_TOKEN = Config.MAP_BOX_TOKEN;

const BASEURL = Config.BASE_URL;
const portAuth = BASEURL + '/api/v1/auth';
const portAccount = BASEURL + '/api/v1/account';
const portMerchant = BASEURL + '/api/v1/merchant';
const portTransaction = BASEURL + '/api/v1/transaction';
const portProduct = BASEURL + '/api/v1/product';
const portOrder = BASEURL + '/api/v1/order';
const portMaster = BASEURL + '/api/v1/master';
const portSocket = io.connect(Config.API_SOCKET + `/user`, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 3000,
  reconnectionAttempts: 5,
});
const portSocketChat = io.connect(Config.API_SOCKET + `/chat`, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 3000,
  reconnectionAttempts: 5,
});
const portWallet = BASEURL + '/api/v1/wallet';
const portVoucher = BASEURL + '/api/v1/voucher';

export default {
  BASEURL,
  GOOGLE_API_KEY,
  MAP_BOX_TOKEN,
  portAuth,
  portAccount,
  portMerchant,
  portTransaction,
  portProduct,
  portOrder,
  portSocket,
  portSocketChat,
  portMaster,
  portWallet,
  portVoucher,
};
