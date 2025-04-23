import React from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav
      className="w-full fixed z-40"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="px-4 md:px-16 py-6 flex flex-row items-center transition duration-500 bg-zinc-900 bg-opacity-90">
        <Image
          src="/logo.svg"
          alt="MyFlix Logo"
          width={100}
          height={28}
          className="h-4 lg:h-7"
          role="img"
          aria-label="Streaming service logo"
        />
        <div className="flex space-x-6 ml-8" role="menu">
          <Link
            href="/"
            className="text-gray-300 hover:text-white focus-visible"
            role="menuitem"
            tabIndex={0}
          >
            Home
          </Link>
          <Link
            href="/movies"
            className="text-gray-300 hover:text-white focus-visible"
            role="menuitem"
            tabIndex={0}
          >
            Movies
          </Link>
          <Link
            href="/tv-shows"
            className="text-gray-300 hover:text-white focus-visible"
            role="menuitem"
            tabIndex={0}
          >
            TV Shows
          </Link>
        </div>
        <div className="ml-auto">
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded focus-visible"
            aria-label="Sign in to your account"
            role="button"
          >
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
