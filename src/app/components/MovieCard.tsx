import React from 'react';
import { BsFillPlayFill } from 'react-icons/bs';
import { AiOutlinePlus } from 'react-icons/ai';
import FavoriteButton from './FavoriteButton';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface MovieCardProps {
  movie: {
    id: string;
    title: string;
    imageUrl: string;
    duration?: string;
    genre?: string;
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const router = useRouter();

  return (
    <div className="group bg-zinc-900 col-span relative h-[12vw]">
      <Image
        className="cursor-pointer object-cover transition duration shadow-xl rounded-md group-hover:opacity-90 sm:group-hover:opacity-0 delay-300 w-full h-[12vw]"
        src={movie.imageUrl || '/default-fallback.svg'}
        alt="Movie thumbnail"
        fill
      />
      <div className="opacity-0 absolute top-0 transition duration-200 z-10 invisible sm:visible delay-300 w-full scale-0 group-hover:scale-110 group-hover:-translate-y-[6vw] group-hover:translate-x-[2vw] group-hover:opacity-100">
        <Image
          className="cursor-pointer object-cover transition duration shadow-xl rounded-t-md w-full h-[12vw]"
          src={movie.imageUrl || '/default-fallback.svg'}
          alt="Movie thumbnail"
          fill
        />
        <div className="z-10 bg-zinc-800 p-2 lg:p-4 absolute w-full transition shadow-md rounded-b-md">
          <div className="flex flex-row items-center gap-3">
            <div
              className="cursor-pointer w-6 h-6 lg:w-10 lg:h-10 bg-white rounded-full flex justify-center items-center transition hover:bg-neutral-300"
              onClick={() => router.push(`/watch/${movie?.id}`)}
              role="button"
              aria-label="Play movie"
            >
              <BsFillPlayFill size={30} />
            </div>
            <FavoriteButton movieId={movie?.id} aria-label="Add to favorites" />
            <div
              className="cursor-pointer ml-auto group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300"
              role="button"
              aria-label="Add to list"
            >
              <AiOutlinePlus
                className="text-white group-hover/item:text-neutral-300"
                size={30}
              />
            </div>
          </div>
          <p className="text-green-400 font-semibold mt-4">
            New <span className="text-white">2023</span>
          </p>
          <div className="flex flex-row mt-4 gap-2 items-center">
            <p className="text-white text-[10px] lg:text-sm">
              {movie.duration}
            </p>
          </div>
          <div className="flex flex-row mt-4 gap-2 items-center">
            <p className="text-white text-[10px] lg:text-sm">{movie.genre}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
