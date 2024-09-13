import { TonConnectUI } from '@tonconnect/ui';

let tonConnectUIInstance: TonConnectUI | null = null;

export const getTonConnectUIInstance = () => {
  if (!tonConnectUIInstance) {
    tonConnectUIInstance = new TonConnectUI({
      manifestUrl: 'https://jsample.vercel.app/tonconnect-manifest.json',
      buttonRootId: 'ton-connect-button',
    });
  }
  return tonConnectUIInstance;
};