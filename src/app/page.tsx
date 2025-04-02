import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <Image
            className="dark:invert"
            src="/logo.svg"
            alt="MyFlix logo"
            width={120}
            height={25}
          />
          <nav className="flex gap-6">
            <a href="#" className="hover:text-primary">
              Home
            </a>
            <a href="#" className="hover:text-primary">
              TV Shows
            </a>
            <a href="#" className="hover:text-primary">
              Movies
            </a>
            <a href="#" className="hover:text-primary">
              Anime
            </a>
            <a href="#" className="hover:text-primary">
              My List
            </a>
          </nav>
        </div>
      </header>

      <main className="p-8">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Featured Content</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded-lg aspect-video"
                ></div>
              ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Popular on MyFlix</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded-lg aspect-video"
                ></div>
              ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Continue Watching</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded-lg aspect-video"
                ></div>
              ))}
          </div>
        </section>
      </main>

      <footer className="p-4 border-t border-gray-800 text-center text-sm">
        <p>© 2024 MyFlix. All rights reserved.</p>
      </footer>
    </div>
  );
}
