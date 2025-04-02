import MovieCard from "./MovieCard";

type MovieListProps = {
  title: string;
  movies: {
    id: string;
    title: string;
    imageUrl: string;
  }[];
};

export default function MovieList({ title, movies }: MovieListProps) {
  return (
    <div className="px-4 md:px-12 mt-4 space-y-8">
      <h2 className="text-white text-xl md:text-2xl font-semibold">{title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
