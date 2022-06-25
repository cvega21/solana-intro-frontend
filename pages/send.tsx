import React, { useState } from 'react'
import BasicPage from '../components/BasicPage'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import SendButton from '../components/SendButton';

const Send = () => {
  const [amount, setAmount] = useState(0.0);
  const [receiver, setReceiver] = useState('');

  const updateSolAmount = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setAmount(e.target.value);
  }
  
  const updateWalletAddress = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setReceiver(e.target.value);
  }

  return (
    <BasicPage title='Send Solana to your friends!'>
      <WalletMultiButton/>
      <form 
        className='flex flex-col'
        id='sendSol'
      >
        <label>amount to send </label>
        <input
          onChange={updateSolAmount}
          placeholder={'0.0'}
          value={amount}
          className='text-right'
          />
        <label>wallet address</label>
        <input 
          onChange={updateWalletAddress}
          placeholder={'satoshixyz12369'}
          value={receiver}
          className='text-right'
        />
      </form>
      <SendButton amount={amount} receiver={receiver}/>
    </BasicPage>
  )
}

export default Send