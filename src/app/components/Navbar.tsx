import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 p-4 fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          MyFlix
        </Link>
        
        <div className="flex space-x-6">
          <Link href="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link href="/movies" className="text-gray-300 hover:text-white">
            Movies
          </Link>
          <Link href="/tv-shows" className="text-gray-300 hover:text-white">
            TV Shows
          </Link>
        </div>
        
        <div>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}