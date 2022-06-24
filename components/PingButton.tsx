import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import * as web3 from '@solana/web3.js'
import { FC, useState } from 'react'
import styles from '../styles/PingButton.module.css'
import { PROGRAM_ADDRESS, PROGRAM_DATA_ADDRESS, logDevSolExplorerLink } from '../utils'
// import * as web3 from '@solana/web3.js'

const PingButton = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [link, setLink] = useState('');

  const handleClick = () => {
    if (!connection || !publicKey) return
    const programId = new web3.PublicKey(PROGRAM_ADDRESS)
    const programDataId = new web3.PublicKey(PROGRAM_DATA_ADDRESS);
    const transaction = new web3.Transaction();
    const instruction = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: programDataId,
          isSigner: false,
          isWritable: true
        },
      ],
      programId
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
          className='bg-black px-4 py-2 rounded-xl text-lg mt-12 hover:bg-gray-800 transition-all duration-250'
          onClick={handleClick} 
        >
          ping program
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

export default PingButton