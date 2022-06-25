import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import React, { useState } from 'react'
import * as Web3 from '@solana/web3.js'

interface ISendButton {
  amount: number
  receiver: string
}

const SendButton = ({ amount, receiver}: ISendButton) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [link, setLink] = useState('');

  const handleClick = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!connection || !publicKey) return
    const receiverPubKey = new Web3.PublicKey(receiver);
    const transaction = new Web3.Transaction();
    const instruction = Web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: receiverPubKey,
      lamports: Web3.LAMPORTS_PER_SOL*amount,
    })

    transaction.add(instruction);

    sendTransaction(transaction, connection).then(txSig => {
      setLink(txSig);
    })
  }

  if (publicKey) {
    return (
      <>
      <button
        type='submit'
        form='sendSol'
        value='submit'
        className=' bg-indigo-500 rounded-xl px-4 mt-4 text-lg font-light'
        onClick={handleClick}
      >
        send
      </button>
        {
          link &&
          <a 
            href={`https://explorer.solana.com/tx/${link}?cluster=devnet`}
            className='text-sm mt-4 w-1/2 p-1 break-all bg-green-800 rounded-lg'
            target='_blank'
            rel='noreferrer'
          >
            Click here to view your transaction on the Solana Explorer!
          </a>
        }
      </>
    )
  } else {
    return null
  }
}

export default SendButton