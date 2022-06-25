import React, { FC, ReactNode } from 'react'
import styles from '../styles/Home.module.css'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Head from 'next/head'
import WalletContextProvider from '../context/WalletContextProvider'
import PingButton from '../components/PingButton';
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

interface IBasicPage {
  children: ReactNode
  title: string
}

const BasicPage = ({ children, title }: IBasicPage) => {

  return (
    <div className={styles.App}>
      <Head>
        <title>{title}</title>
      </Head>
      <WalletContextProvider>
        <div className={styles.AppHeader}>
          {children}
        </div>
      </WalletContextProvider>
    </div>
  )
}

export default BasicPage