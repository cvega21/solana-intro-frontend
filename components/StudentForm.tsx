import React, { useEffect, useState } from 'react'
import BasicPage from '../components/BasicPage'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import SendButton from '../components/SendButton';
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Movie, StudentIntro } from '../classes';
import * as Web3 from '@solana/web3.js'

const STUDENT_PROGRAM_ID = 'HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf'

export const StudentForm = () => {
  const [name, setName] = useState('');
  const [intro, setIntro] = useState('');
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [link, setLink] = useState('');

  const handleChange = (set: React.Dispatch<React.SetStateAction<any>>, e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    set(e.target.value);
  }

  const handleSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    const studentIntro = new StudentIntro(name, intro);
    handleTransactionSubmit(studentIntro);
  }

  const handleTransactionSubmit = async (studentIntro: StudentIntro) => {
    if (!connection || !publicKey) return

    const buffer = studentIntro.serialize();
    const transaction = new Web3.Transaction();

    const [pda] = await Web3.PublicKey.findProgramAddress(
      [publicKey.toBuffer()],
      new Web3.PublicKey(STUDENT_PROGRAM_ID)
    )

    const instruction = new Web3.TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: false,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true
        },
        {
          pubkey: Web3.SystemProgram.programId,
          isSigner: false,
          isWritable: false
        }
      ],
      data: buffer,
      programId: new Web3.PublicKey(STUDENT_PROGRAM_ID)
    })
  
    transaction.add(instruction)

    try {
      sendTransaction(transaction, connection).then(txSig => {
        setLink(txSig);
      });
    } catch (e) {
      console.error(e);
    }

  }

  return (
    <>
      <form 
        className='flex flex-col text-xl'
        id='sendSol'
      >
        <label>name</label>
        <input
          onChange={e => handleChange(setName, e)}
          placeholder={'name'}
          value={name}
          className='text-right'
          />
        <label>intro</label>
        <textarea 
          onChange={e => handleChange(setIntro, e)}
          placeholder={'intro'}
          value={intro}
          className='text-right'
        />
      </form>
      {publicKey &&
        <button
          type='submit'
          form='sendSol'
          value='submit'
          className=' bg-indigo-500 rounded-xl px-4 mt-4 text-lg font-light'
          onClick={handleSubmit}
        >
          send
        </button>
      }
      {link &&
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
}