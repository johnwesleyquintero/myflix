import React from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="w-full fixed z-40">
      <div className="px-4 md:px-16 py-6 flex flex-row items-center transition duration-500 bg-zinc-900 bg-opacity-90">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={100}
          height={28}
          className="h-4 lg:h-7"
        />
        <div className="flex space-x-6 ml-8">
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
        <div className="ml-auto">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
