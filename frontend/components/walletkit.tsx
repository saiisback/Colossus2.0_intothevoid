// components/WalletKitProvider.tsx
'use client';

import { useEffect, useState } from 'react';
import { Core } from '@walletconnect/core';
import { WalletKit, IWalletKit } from '@reown/walletkit';

export let walletKit: IWalletKit | null = null;

export const WalletKitProvider = () => {
  useEffect(() => {
    const initializeWalletKit = async () => {
      if (!walletKit) {
        const core = new Core({
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
        });

        walletKit = await WalletKit.init({
          core,
          metadata: {
            name: 'hackathon',
            description: 'AppKit Example',
            url: 'https://reown.com/appkit',
            icons: ['https://assets.reown.com/reown-profile-pic.png'],
          },
        });
      }
    };

    initializeWalletKit();
  }, []);

  return null;
};
