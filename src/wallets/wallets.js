import { getDogeLabsWalletAddress, sendDogeFromDogeLabs } from "./dogelabs";
import { getMyDogeWalletAddress, sendDogeFromMyDoge, getWalletDataFromMyDoge } from "./mydoge";

export const DOGELABS_WALLET = 'dogeLabs';
export const MYDOGE_WALLET = 'myDoge';

export const PAYMENT_TYPE = 'payment';
export const DOGINALS_TYPE = 'doginals';

export const PAYLOAD_TYPES = {
  text: 'PLAIN_TEXT',
  base64: 'BASE_64'
};

export function defaultLogo(walletProvider) {
  switch (walletProvider) {
    case DOGELABS_WALLET:
      return "https://drc-20.org/logo.svg";
    case MYDOGE_WALLET:
      return "https://example.com/mydoge-logo.svg"; // Replace with MyDoge Wallet logo URL
    default:
      return undefined;
  }
}

export async function getWalletAddress(walletProvider, walletType) {
  switch (walletProvider) {
    case DOGELABS_WALLET:
      return await getDogeLabsWalletAddress(walletType);
    case MYDOGE_WALLET:
      return await getMyDogeWalletAddress(walletType);
    default:
      return '';
  }
}

export async function signPsbt(walletProvider, psbtHex) {
  switch (walletProvider) {
    case DOGELABS_WALLET:
      return await window.dogeLabs?.signPsbt(psbtHex);
    case MYDOGE_WALLET:
      return await window.myDoge?.signPsbt(psbtHex);
    default:
      throw new Error(`PSBTs not supported for ${walletProvider}`);
  }
}

export async function sendDoge(walletProvider, address, dogeAmount, originator) {
  switch (walletProvider) {
    case DOGELABS_WALLET:
      return await sendDogeFromDogeLabs(dogeAmount, address, originator);
    case MYDOGE_WALLET:
      return await sendDogeFromMyDoge(dogeAmount, address);
    default:
      throw new Error(`Sending DOGE not supported for ${walletProvider}`);
  }
}

export async function directInscribe(walletProvider, contentType, payloadType, content, additionalFee, feeRate) {
  switch (walletProvider) {
    case DOGELABS_WALLET:
    case MYDOGE_WALLET:
    default:
      throw new Error(`Direct inscriptions not supported for ${walletProvider}`);
  }
}

export async function getWalletData(address, walletProvider) {
  switch (walletProvider) {
    case DOGELABS_WALLET:
      // Assuming similar data fetching logic is available for DogeLabs
      const response = await fetch(`https://dogeturbo.ordinalswallet.com/wallet/${address}`);
      const data = await response.json();
      return data;
    case MYDOGE_WALLET:
      return await getWalletDataFromMyDoge(address);
    default:
      throw new Error(`Fetching wallet data not supported for ${walletProvider}`);
  }
}

export async function getWalletBalance(walletProvider) {
  switch (walletProvider) {
    case DOGELABS_WALLET:
      return await window.dogeLabs?.getBalance();
    case MYDOGE_WALLET:
      return await window.myDoge?.getBalance();
    default:
      throw new Error(`Getting balance not supported for ${walletProvider}`);
  }
}
