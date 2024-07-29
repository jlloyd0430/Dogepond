export async function getMyDogeWalletAddress() {
  if (typeof window.myDoge === 'undefined') {
    throw new Error('MyDoge Wallet is not installed');
  }
  try {
    const accounts = await window.myDoge.connect();
    if (accounts.length !== 1) {
      throw new Error(`Invalid number of accounts detected (${accounts.length})`);
    }
    return accounts[0].address;
  } catch (err) {
    throw new Error('User did not grant access to MyDoge Wallet');
  }
}

export async function sendDogeFromMyDoge(amount, address) {
  const txid = await window.myDoge.requestTransaction({ recipientAddress: address, dogeAmount: amount });
  return txid;
}
