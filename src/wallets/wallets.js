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

// Function to get the address of the connected wallet
export async function getConnectedWalletAddress() {
  if (window.dogeLabs && typeof window.dogeLabs.isConnected === 'function' && window.dogeLabs.isConnected()) {
    return await getDogeLabsWalletAddress();
  } else if (window.myDoge && typeof window.myDoge.isConnected === 'function' && window.myDoge.isConnected()) {
    return await getMyDogeWalletAddress();
  } else {
    return null; // No wallet is connected
  }
}

// Function to get the default logo for a wallet provider
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

// Function to get the wallet address based on the provider and wallet type
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

// Function to sign a PSBT (Partially Signed Bitcoin Transaction)
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

// Function to send DOGE using the connected wallet
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

// Function to directly inscribe content on the blockchain
export async function directInscribe(walletProvider, contentType, payloadType, content, additionalFee, feeRate) {
  switch (walletProvider) {
    case DOGELABS_WALLET:
    case MYDOGE_WALLET:
    default:
      throw new Error(`Direct inscriptions not supported for ${walletProvider}`);
  }
}

// Function to get the balance of the connected wallet
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
