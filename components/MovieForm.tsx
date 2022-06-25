import React, { useEffect, useState } from 'react'
import BasicPage from '../components/BasicPage'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import SendButton from '../components/SendButton';
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Movie } from '../classes';
import * as Web3 from '@solana/web3.js'

const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN'

const MovieForm = () => {
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0.0);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [link, setLink] = useState('');

  const handleChange = (set: React.Dispatch<React.SetStateAction<any>>, e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    set(e.target.value);
  }

  useEffect(() => {
    console.log(title, review)
  })

  const handleSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    const movie = new Movie(title, rating, review);
    handleTransactionSubmit(movie);
  }

  const handleTransactionSubmit = async (movie: Movie) => {
    if (!connection || !publicKey) return

    const buffer = movie.serialize();
    const transaction = new Web3.Transaction();

    const [pda] = await Web3.PublicKey.findProgramAddress(
      [publicKey.toBuffer(), new TextEncoder().encode(movie.title)],
      new Web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
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
      programId: new Web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
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
        className='flex flex-col'
        id='sendSol'
      >
        <label>movie title</label>
        <input
          onChange={e => handleChange(setTitle, e)}
          placeholder={'title'}
          value={title}
          className='text-right'
          />
        <label>movie review</label>
        <textarea 
          onChange={e => handleChange(setReview, e)}
          placeholder={'review'}
          value={review}
          className='text-right'
        />
        <label>rating</label>
        <input 
          onChange={e => handleChange(setRating, e)}
          placeholder={'rating'}
          value={rating}
          className='text-right'
          type='number'
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

export default MovieForm