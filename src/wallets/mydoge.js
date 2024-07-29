export async function getMyDogeWalletAddress(walletType) {
  if (typeof window.myDoge === 'undefined') {
    throw new Error('MyDoge Wallet is not installed');
  }
  try {
    const accounts = await window.myDoge.requestAccounts();
    if (accounts.length !== 1) {
      throw new Error(`Invalid number of accounts detected (${accounts.length})`);
    }
    return accounts[0];
  } catch (err) {
    throw new Error('User did not grant access to MyDoge');
  }
}

export async function sendDogeFromMyDoge(amount, address) {
  const txid = await window.myDoge?.sendBitcoin(address, amount);
  return txid;
}

export async function getWalletDataFromMyDoge(address) {
  const response = await fetch(`https://dogeturbo.ordinalswallet.com/wallet/${address}`);
  const data = await response.json();
  return data;
}
