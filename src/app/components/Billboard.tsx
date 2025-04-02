import Image from "next/image";

export default function Billboard() {
  return (
    <div className="relative h-[56.25vw] w-full">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/10 to-transparent z-10" />

      <div className="absolute bottom-10 left-10 z-20 w-1/2">
        <h1 className="text-white text-4xl font-bold mb-4">Featured Title</h1>
        <p className="text-gray-300 text-lg mb-6">
          Watch the latest episodes and movies from your favorite shows.
        </p>
        <div className="flex space-x-4">
          <button className="bg-white text-black px-6 py-2 rounded flex items-center hover:bg-opacity-80">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Play
          </button>
          <button className="bg-gray-600 bg-opacity-70 text-white px-6 py-2 rounded hover:bg-opacity-50">
            More Info
          </button>
        </div>
      </div>

      <Image
        src="/placeholder.jpg"
        alt="Featured Content"
        fill
        className="object-cover"
      />
    </div>
  );
}
