import '@/styles/globals.scss'
import type { AppProps } from 'next/app'

import { WagmiConfig, createClient, mainnet } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { arbitrum, hardhat, optimism, polygon } from '@wagmi/chains';

const chains = [mainnet, polygon, optimism, arbitrum, hardhat];


const client = createClient(
  getDefaultClient({
    appName: "confide",
    chains,
  }),
);

export default function App({ Component, pageProps }: AppProps) {  
  return <WagmiConfig client={client}>
    <ConnectKitProvider>
      <Component {...pageProps} />
    </ConnectKitProvider>
  </WagmiConfig>
}
