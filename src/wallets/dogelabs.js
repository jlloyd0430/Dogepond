export async function getDogeLabsWalletAddress(walletType) {
  if (typeof window.dogeLabs === 'undefined') {
    throw new Error('Doge Labs Wallet is not installed');
  }
  try {
    const accounts = await window.dogeLabs.requestAccounts();
    if (accounts.length !== 1) {
      throw new Error(`Invalid number of accounts detected (${accounts.length})`);
    }
    return accounts[0];
  } catch (err) {
    throw new Error('User did not grant access to Doge Labs');
  }
}

export async function sendDogeFromDogeLabs(amount, address) {
  const txid = await window.dogeLabs?.sendBitcoin(address, amount);
  return txid;
}
