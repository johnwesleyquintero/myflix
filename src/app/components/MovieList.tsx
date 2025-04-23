import MovieCard from './MovieCard';
import { Skeleton } from '../ui/skeleton';

type MovieListProps = {
  title: string;
  movies: {
    id: string;
    title: string;
    imageUrl: string;
  }[];
  isLoading?: boolean;
};

export default function MovieList({
  title,
  movies,
  isLoading,
}: MovieListProps) {
  return (
    <div
      className="px-4 md:px-12 mt-4 space-y-8"
      role="region"
      aria-label={`${title} movies`}
    >
      <h2 className="text-white text-xl md:text-2xl font-semibold">{title}</h2>

      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        role="list"
        aria-label="Movie list"
      >
        {isLoading
          ? Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={`skeleton-${i}`}
                  className="h-64 w-full rounded-lg"
                />
              ))
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </div>
  );
}
