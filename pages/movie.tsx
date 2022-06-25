import React, { useEffect, useState } from 'react'
import BasicPage from '../components/BasicPage'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import MovieForm from '../components/MovieForm';

const Movie = () => {

  return (
    <BasicPage title='Send Solana to your friends!'>
      <WalletMultiButton/>
      <MovieForm/>
    </BasicPage>
  )
}

export default Movie