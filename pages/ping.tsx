import React from 'react'
import styles from '../styles/Home.module.css'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Head from 'next/head'
import WalletContextProvider from '../context/WalletContextProvider'
import PingButton from '../components/PingButton';
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

const Ping = () => {
  
  return (
    <div className={styles.App}>
      <Head>
        <title>Soldev Course Project</title>
      </Head>
      <WalletContextProvider>
        <div className={styles.AppHeader}>
          <WalletMultiButton/>
          <PingButton/>
        </div>
      </WalletContextProvider>
    </div>
  )
}

export default Ping