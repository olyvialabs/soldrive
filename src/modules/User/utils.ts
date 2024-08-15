function formatWalletAddress(wallet: string): string {
  if (wallet.length < 7) {
    return wallet;
  }

  const start = wallet.slice(0, 3);
  const end = wallet.slice(-4);
  return `${start}...${end}`;
}

export { formatWalletAddress };
