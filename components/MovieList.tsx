import { FC, useEffect, useState } from 'react'
import { Movie } from '../classes/Movie'
import * as web3 from '@solana/web3.js'

const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN'

export const MovieList: FC = () => {
	const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
	const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    connection.getProgramAccounts(new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)).then(async (accounts) => {
        const movies: Movie[] = accounts.reduce((accum: Movie[], { pubkey, account }) => {
            const movie = Movie.deserialize(account.data)
            if (!movie) {
                return accum
            }

            return [...accum, movie]
        }, [])
        setMovies(movies)
    })
}, [])

return (
		<div>
			{
				movies.map((movie, i) => 
          <div key={i}>
            <h1>{movie.title}</h1>
            <h2>{movie.rating}</h2>
            <p>{movie.description}</p>
          </div>
          )
			}
		</div>
	)
}