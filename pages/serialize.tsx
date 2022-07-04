import React, { useEffect, useState } from 'react'
import BasicPage from '../components/BasicPage'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { MovieForm, StudentForm, MovieList } from '../components';
import { Movie } from '../classes';

const Serialize = () => {
  const [mode, setMode] = useState('movie');
  
  const handleModeChange = (e: React.BaseSyntheticEvent) => {
    e.preventDefault;
    setMode(e.target.value);
  }

  return (
    <BasicPage title='Send Solana to your friends!'>
      <WalletMultiButton/>
      <div className='my-12 text-xl'>
        <h1 className='text-4xl font-bold my-2'>choose mode</h1>
        <select 
          className='bg-black' 
          onChange={handleModeChange}
        >
          <option>movie</option>
          <option>students</option>
        </select>
      </div>
      {mode === 'movie' ? 
        <>
          <MovieForm/> 
          <MovieList/>
        </>
        : 
        mode === 'students' ? <StudentForm/> 
        : 
        <></>
      }
    </BasicPage>
  )
}

export default Serialize