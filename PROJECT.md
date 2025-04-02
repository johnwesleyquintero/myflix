![Logo](public/logo.svg)

### Introduction

This is a roadmap document on building a full-stack web application. In this project, we will create a powerful Netflix clone using some of the latest tech trends. We will be using React for the frontend, Next.js for server-side rendering, Tailwind CSS for styling, Prisma as our data abstraction layer, MongoDB for storage, NextAuth for authentication, and Vercel for deployment. Additionally, we will use TypeScript and ensure the entire website is fully responsive across all devices.

### Environment Setup

To begin, let's set up our development environment.

1. **Initialize Next.js Project:**
   - Open your terminal and run:
     ```bash
     npx create-next-app@latest myflix --typescript
     ```
   - Navigate to your project directory:
     ```bash
     cd myflix
     ```

2. **Install Tailwind CSS:**
   - Run the following command to install Tailwind CSS and its dependencies:
     ```bash
     npm install -D tailwindcss postcss autoprefixer
     ```
   - Initialize Tailwind CSS:
     ```bash
     npx tailwindcss init -p
     ```

3. **Configure Tailwind CSS:**
   - Update the `tailwind.config.js` file to include the following configuration:
     ```javascript
     /** @type {import('tailwindcss').Config} */
     module.exports = {
       content: [
         "./pages/**/*.{js,ts,jsx,tsx}",
         "./components/**/*.{js,ts,jsx,tsx}",
       ],
       theme: {
         extend: {},
       },
       plugins: [],
     }
     ```

4. **Run the Development Server:**
   - Start the Next.js development server:
     ```bash
     npm run dev
     ```
   - Open your browser and navigate to `http://localhost:3000` to see your project running.

### Authentication Screen UI

In this section, we will build the authentication screen UI.

1. **Create the Auth Screen:**
   - Open the `pages` folder and create a new file called `auth.tsx`.
   - Add the following code to set up the basic structure of the authentication screen:
     ```javascript
     import React from 'react';

     const Auth = () => {
       return (
         <div className="relative h-screen w-screen bg-black">
           <img src="/images/hero.jpg" className="absolute inset-0 -z-10 opacity-60" />
           <div className="flex justify-center items-center h-full">
             <form className="bg-black/70 p-14 rounded-md w-1/3">
               <h1 className="text-3xl font-semibold text-white mb-6">Sign In</h1>
               <div className="flex flex-col gap-4">
                 <input type="email" placeholder="Email" className="input-style" />
                 <input type="password" placeholder="Password" className="input-style" />
                 <button className="w-full bg-red-600 py-3 rounded-md text-white">Login</button>
                 <p className="text-sm text-white mt-6">
                   First time using Netflix?{' '}
                   <span className="text-red-600 hover:underline cursor-pointer">
                     Create an account
                   </span>
                 </p>
               </div>
             </form>
           </div>
         </div>
       );
     };

     export default Auth;
     ```

2. **Style the Input Fields:**
   - Add the following CSS classes to style the input fields:
     ```javascript
     <input type="email" placeholder="Email" className="bg-[#333] rounded-md p-4 text-white placeholder:text-white/50 focus:outline-none" />
     <input type="password" placeholder="Password" className="bg-[#333] rounded-md p-4 text-white placeholder:text-white/50 focus:outline-none" />
     ```

3. **Add Responsive Design:**
   - Ensure the authentication screen is responsive by adjusting the styles for different screen sizes.

### Building the Auth System with NextAuth and Prisma

In this section, we will set up authentication using NextAuth and Prisma.

1. **Install Required Packages:**
   - Run the following commands to install NextAuth and Prisma:
     ```bash
     npm install next-auth @prisma/client @next-auth/prisma-adapter
     ```

2. **Set Up Prisma:**
   - Initialize Prisma in your project:
     ```bash
     npx prisma init
     ```
   - Update the `.env` file with your database URL:
     ```env
     DATABASE_URL="your_mongodb_connection_string"
     ```

3. **Create Prisma Schema:**
   - Define your data models in the `prisma/schema.prisma` file:
     ```prisma
     datasource db {
       provider = "mongodb"
       url      = env("DATABASE_URL")
     }

     generator client {
       provider = "prisma-client-js"
     }

     model User {
       id        String   @id @default(auto()) @map("_id") @db.ObjectId
       name      String?
       email     String?  @unique
       password  String?
       image    String?
       emailVerified Date? @default(now())
       accounts Account[]
       sessions  Session[]
       favoriteIds String[] @db.ObjectId
     }

     model Account {
       id                 String   @id @default(auto()) @map("_id") @db.ObjectId
       userId             String   @db.ObjectId
       type               String
       provider           String
       providerAccountId  String
       refreshToken       String?  @db.String
       accessToken        String?  @db.String
       expiresAt          Int
       tokenType          String?
       scope              String?
       idToken            String?  @db.String
       sessionState       String?

       @@unique([provider, providerAccountId])
     }

     model Session {
       id           String   @id @default(auto()) @map("_id") @db.ObjectId
       sessionToken String   @unique
       userId       String   @db.ObjectId
       expires     Date
     }

     model VerificationToken {
       identifier String
       token      String  @unique
       expires    Date

       @@unique([identifier, token])
     }

     model Movie {
       id          String
       title       String
       description String
       videoUrl    String
       thumbnailUrl String
       genre       String
       duration    String
     }
     ```

4. **Push Prisma Schema to MongoDB:**
   - Run the following command to push the schema to your MongoDB database:
     ```bash
     npx prisma db push
     ```

5. **Set Up NextAuth:**
   - Create a new file `[...nextauth].ts` in the `pages/api/auth` directory and add the following code:
     ```typescript
     import NextAuth from 'next-auth';
     import Providers from 'next-auth/providers';
     import { PrismaClient } from '@prisma/client';
     import { compare } from 'bcryptjs';
     import prisma from '../../../lib/prisma';

     export default NextAuth({
       providers: [
         Providers.Credentials({
           id: 'credentials',
           name: 'Credentials',
           credentials: {
             email: { label: 'Email', type: 'text' },
             password: { label: 'Password', type: 'password' },
           },
           async authorize(credentials) {
             if (!credentials?.email || !credentials?.password) {
               throw new Error('Email and password required');
             }

             const user = await prisma.user.findUnique({
               where: { email: credentials.email },
             });

             if (!user || !user.hashedPassword) {
               throw new Error('Email does not exist');
             }

             const isCorrectPassword = await compare(credentials.password, user.hashedPassword);

             if (!isCorrectPassword) {
               throw new Error('Incorrect password');
             }

             return user;
           },
         }),
         Providers.Google({
           clientId: process.env.GOOGLE_CLIENT_ID,
           clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         }),
         Providers.GitHub({
           clientId: process.env.GITHUB_CLIENT_ID,
           clientSecret: process.env.GITHUB_CLIENT_SECRET,
         }),
       ],
       adapter: PrismaAdapter(prisma),
       session: {
         strategy: 'jwt',
       },
       jwt: {
         secret: process.env.NEXTAUTH_JWT_SECRET,
       },
       secret: process.env.NEXTAUTH_SECRET,
       pages: {
         signIn: '/auth',
       },
       debug: process.env.NODE_ENV === 'development',
     });
     ```

6. **Create Authentication API Routes:**
   - Create the following API routes for registration and login:
     - `pages/api/register.ts`:
       ```typescript
       import { NextApiRequest, NextApiResponse } from 'next';
       import bcrypt from 'bcryptjs';
       import prisma from '../../../lib/prisma';

       export default async function handler(req: NextApiRequest, res: NextApiResponse) {
         if (req.method !== 'POST') {
           return res.status(405).end();
         }

         const { email, name, password } = req.body;

         const existingUser = await prisma.user.findUnique({
           where: { email },
         });

         if (existingUser) {
           return res.status(422).json({ error: 'Email taken' });
         }

         const hashedPassword = await bcrypt.hash(password, 12);

         const user = await prisma.user.create({
           data: {
             email,
             name,
             hashedPassword,
             image: '',
             emailVerified: new Date(),
           },
         });

         return res.status(200).json(user);
       }
       ```

     - `pages/api/login.ts`:
       ```typescript
       import { NextApiRequest, NextApiResponse } from 'next';
       import { getSession } from 'next-auth/react';

       export default async function handler(req: NextApiRequest, res: NextApiResponse) {
         if (req.method !== 'POST') {
           return res.status(405).end();
         }

         const session = await getSession({ req });

         if (!session) {
           return res.status(401).json({ error: 'Unauthorized' });
         }

         return res.status(200).json(session.user);
       }
       ```

### Building the Navbar Component

In this section, we will build the navigation bar component.

1. **Create the Navbar Component:**
   - Create a new file `Navbar.tsx` in the `components` directory and add the following code:
     ```typescript
     import React from 'react';
     import { useRouter } from 'next/router';
     import { BsChevronDown, BsSearch, BsBell } from 'react-icons/bs';
     import { FaGithub, FaGoogle } from 'react-icons/fa';
     import MobileMenu from './MobileMenu';
     import AccountMenu from './AccountMenu';

     const Navbar = () => {
       const router = useRouter();
       const [showMobileMenu, setShowMobileMenu] = React.useState(false);
       const [showAccountMenu, setShowAccountMenu] = React.useState(false);

       const toggleMobileMenu = () => {
         setShowMobileMenu((prev) => !prev);
       };

       const toggleAccountMenu = () => {
         setShowAccountMenu((prev) => !prev);
       };

       React.useEffect(() => {
         const handleScroll = () => {
           if (window.scrollY > 66) {
             setShowBackground(true);
           } else {
             setShowBackground(false);
           }
         };

         window.addEventListener('scroll', handleScroll);
         return () => {
           window.removeEventListener('scroll', handleScroll);
         };
       }, []);

       return (
         <nav className="w-full fixed z-40 px-4 py-6 flex justify-between items-center transition-all duration-500 bg-black bg-opacity-90">
           <img src="/images/logo.png" alt="Logo" className="h-4 lg:h-7" />
           <div className="flex items-center gap-8">
             <NavbarItem label="Home" />
             <NavbarItem label="Series" />
             <NavbarItem label="Films" />
             <NavbarItem label="New & Popular" />
             <NavbarItem label="My List" />
             <NavbarItem label="Browse by Languages" />
           </div>
           <div className="lg:hidden flex items-center gap-2 ml-8 cursor-pointer relative">
             <p className="text-white text-sm">Browse</p>
             <BsChevronDown className="text-white" />
           </div>
           <div className="flex items-center gap-4">
             <div className="text-gray-300 hover:text-gray-400 cursor-pointer transition">
               <BsSearch className="text-2xl" />
             </div>
             <div className="text-gray-300 hover:text-gray-400 cursor-pointer transition">
               <BsBell className="text-2xl" />
             </div>
             <div className="relative">
               <img src="/images/default-blue.png" alt="Profile" className="w-6 h-6 lg:w-10 lg:h-10 rounded-full" />
               <BsChevronDown className="text-white" />
             </div>
           </div>
           <MobileMenu visible={showMobileMenu} />
           <AccountMenu visible={showAccountMenu} />
         </nav>
       );
     };

     export default Navbar;
     ```

2. **Create the NavbarItem Component:**
   - Create a new file `NavbarItem.tsx` in the `components` directory and add the following code:
     ```typescript
     import React from 'react';

     interface NavbarItemProps {
       label: string;
     }

     const NavbarItem: React.FC<NavbarItemProps> = ({ label }) => {
       return (
         <div className="text-white hover:text-gray-300 cursor-pointer transition">
           {label}
         </div>
       );
     };

     export default NavbarItem;
     ```

3. **Create the MobileMenu Component:**
   - Create a new file `MobileMenu.tsx` in the `components` directory and add the following code:
     ```typescript
     import React from 'react';

     interface MobileMenuProps {
       visible?: boolean;
     }

     const MobileMenu: React.FC<MobileMenuProps> = ({ visible }) => {
       if (!visible) return null;

       return (
         <div className="bg-black w-56 absolute top-8 left-0 flex flex-col gap-4 p-4 text-white">
           <div>Home</div>
           <div>Series</div>
           <div>Films</div>
           <div>New & Popular</div>
           <div>My List</div>
           <div>Browse by Languages</div>
         </div>
       );
     };

     export default MobileMenu;
     ```

4. **Create the AccountMenu Component:**
   - Create a new file `AccountMenu.tsx` in the `components` directory and add the following code:
     ```typescript
     import React from 'react';
     import { signOut } from 'next-auth/react';

     interface AccountMenuProps {
       visible?: boolean;
     }

     const AccountMenu: React.FC<AccountMenuProps> = ({ visible }) => {
       if (!visible) return null;

       return (
         <div className="bg-black w-56 absolute top-8 right-0 flex flex-col gap-4 p-4 text-white">
           <div className="flex items-center gap-2">
             <img src="/images/default-blue.png" alt="Profile" className="w-8 rounded-full" />
             <p className="text-sm">Username</p>
           </div>
           <hr className="bg-gray-600 border-0.5 my-2" />
           <div className="text-sm cursor-pointer hover:underline" onClick={() => signOut()}>
             Sign Out
           </div>
         </div>
       );
     };

     export default AccountMenu;
     ```

5. **Integrate the Navbar Component:**
   - Update the `pages/index.tsx` file to include the Navbar component:
     ```typescript
     import React from 'react';
     import Navbar from '../components/Navbar';

     const Home = () => {
       return (
         <div>
           <Navbar />
           <h1>Welcome to Netflix Clone</h1>
         </div>
       );
     };

     export default Home;
     ```

### Building the Billboard Component

In this section, we will build the billboard component that displays a random movie.

1. **Create the Billboard Component:**
   - Create a new file `Billboard.tsx` in the `components` directory and add the following code:
     ```typescript
     import React from 'react';
     import useBillboard from '../hooks/useBillboard';

     const Billboard = () => {
       const { data: movie } = useBillboard();

       if (!movie) return null;

       return (
         <div className="relative h-[56.25vw]">
           <video
             className="w-full h-full object-cover brightness-[60%] transition-opacity duration-500"
             src={movie.videoUrl}
             autoPlay
             muted
             loop
             poster={movie.thumbnailUrl}
           />
           <div className="absolute top-[30%] md:top-[40%] ml-4 md:ml-16 lg:left-0 lg:items-center lg:flex lg:h-[40vh] lg:w-screen">
             <p className="text-white text-1xl md:text-2xl lg:text-5xl font-bold shadow-xl drop-shadow-xl">
               {movie.title}
             </p>
             <p className="text-white text-[8px] md:text-lg mt-3 md:mt-8 w-[80%] md:w-[80%] lg:w-[45%] drop-shadow-xl">
               {movie.description}
             </p>
             <div className="flex flex-row items-center mt-3 md:mt-4 gap-3">
               <button className="bg-white text-white bg-opacity-30 rounded-md py-1 px-2 md:py-2 md:px-4 w-auto text-xs lg:text-lg font-semibold flex flex-row items-center hover:bg-neutral-300 transition">
                 <img src="/images/play-icon.png" alt="Play" className="mr-1" />
                 Play
               </button>
               <button className="bg-white text-white bg-opacity-30 rounded-md py-1 px-2 md:py-2 md:px-4 w-auto text-xs lg:text-lg font-semibold flex flex-row items-center hover:bg-neutral-300 transition">
                 <img src="/images/info-icon.png" alt="More Info" className="mr-1" />
                 More Info
               </button>
             </div>
           </div>
         </div>
       );
     };

     export default Billboard;
     ```

2. **Create the useBillboard Hook:**
   - Create a new file `useBillboard.ts` in the `hooks` directory and add the following code:
     ```typescript
     import useSWR from 'swr';
     import fetcher from '../lib/fetcher';

     const useBillboard = () => {
       const { data, error, isLoading } = useSWR(`/api/random`, fetcher, {
         revalidateIfStale: false,
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
       });

       return { data, error, isLoading };
     };

     export default useBillboard;
     ```

3. **Create the Random Movie API Route:**
   - Create a new file `random.ts` in the `pages/api` directory and add the following code:
     ```typescript
     import { NextApiRequest, NextApiResponse } from 'next';
     import prisma from '../../../lib/prisma';

     export default async function handler(req: NextApiRequest, res: NextApiResponse) {
       if (req.method !== 'GET') {
         return res.status(405).end();
       }

       const movieCount = await prisma.movie.count();
       const randomIndex = Math.floor(Math.random() * movieCount);
       const randomMovies = await prisma.movie.findMany({
         take: 1,
         skip: randomIndex,
       });

       return res.status(200).json(randomMovies[0]);
     }
     ```

4. **Integrate the Billboard Component:**
   - Update the `pages/index.tsx` file to include the Billboard component:
     ```typescript
     import React from 'react';
     import Navbar from '../components/Navbar';
     import Billboard from '../components/Billboard';

     const Home = () => {
       return (
         <div>
           <Navbar />
           <Billboard />
         </div>
       );
     };

     export default Home;
     ```

### Building the Movie List Component

In this section, we will build the movie list component that displays a list of trending movies.

1. **Create the MovieList Component:**
   - Create a new file `MovieList.tsx` in the `components` directory and add the following code:
     ```typescript
     import React from 'react';
     import MovieCard from './MovieCard';
     import useMovies from '../hooks/useMovies';

     interface MovieListProps {
       data: Record<string, any>[];
       title: string;
     }

     const MovieList: React.FC<MovieListProps> = ({ data, title }) => {
       if (!data || data.length === 0) return null;

       return (
         <div className="px-4 md:px-12 mt-4 space-y-8">
           <h2 className="text-white text-md md:text-xl lg:text-2xl font-semibold mb-4">{title}</h2>
           <div className="grid grid-cols-4 gap-2">
             {data.map((movie) => (
               <MovieCard key={movie.id} data={movie} />
             ))}
           </div>
         </div>
       );
     };

     export default MovieList;
     ```

2. **Create the MovieCard Component:**
   - Create a new file `MovieCard.tsx` in the `components` directory and add the following code:
     ```typescript
     import React from 'react';
     import { BsFillPlayFill } from 'react-icons/bs';
     import { AiOutlinePlus, AiOutlineCheck } from 'react-icons/ai';
     import FavoriteButton from './FavoriteButton';
     import { useRouter } from 'next/router';

     interface MovieCardProps {
       data: Record<string, any>;
     }

     const MovieCard: React.FC<MovieCardProps> = ({ data }) => {
       const router = useRouter();

       return (
         <div className="group bg-zinc-900 col-span relative h-[12vw]">
           <img
             className="cursor-pointer object-cover transition duration-200 shadow-xl rounded-md group-hover:opacity-90 sm:group-hover:opacity-0 delay-300 w-full h-[12vw]"
             src={data.thumbnailUrl}
             alt="Movie Thumbnail"
           />
           <div className="opacity-0 absolute top-0 left-0 w-full h-full bg-black/80 transition-all duration-1000 z-10 flex items-center justify-center">
             <div className="flex flex-row mt-4 gap-4 items-center">
               <div
                 className="cursor-pointer w-6 h-6 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center transition hover:bg-neutral-300"
                 onClick={() => router.push(`/watch/${data.id}`)}
               >
                 <BsFillPlayFill className="text-black w-4 lg:w-6" />
               </div>
               <FavoriteButton movieId={data.id} />
               <div
                 className="cursor-pointer ml-auto group-item w-6 h-6 lg:w-10 lg:h-10 border-white rounded-full flex items-center justify-center transition hover:border-neutral-300"
                 onClick={() => router.push(`/watch/${data.id}`)}
               >
                 <AiOutlinePlus className="text-white" />
               </div>
             </div>
             <div className="flex flex-row mt-4 gap-2 items-center">
               <p className="text-green-400 font-semibold">
                 New <span className="text-white">2023</span>
               </p>
               <p className="text-white text-[10px] lg:text-sm">{data.duration}</p>
               <p className="text-white text-[10px] lg:text-sm">{data.genre}</p>
             </div>
           </div>
         </div>
       );
     };

     export default MovieCard;
     ```

3. **Create the useMovies Hook:**
   - Create a new file `useMovies.ts` in the `hooks` directory and add the following code:
     ```typescript
     import useSWR from 'swr';
     import fetcher from '../lib/fetcher';

     const useMovies = () => {
       const { data, error, isLoading } = useSWR('/api/movies', fetcher, {
         revalidateIfStale: false,
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
       });

       return { data, error, isLoading };
     };

     export default useMovies;
     ```

4. **Create the Movies API Route:**
   - Create a new file `index.ts` in the `pages/api/movies` directory and add the following code:
     ```typescript
     import { NextApiRequest, NextApiResponse } from 'next';
     import prisma from '../../../lib/prisma';

     export default async function handler(req: NextApiRequest, res: NextApiResponse) {
       if (req.method !== 'GET') {
         return res.status(405).end();
       }

       const movies = await prisma.movie.findMany();

       return res.status(200).json(movies);
     }
     ```

5. **Integrate the MovieList Component:**
   - Update the `pages/index.tsx` file to include the MovieList component:
     ```typescript
     import React from 'react';
     import Navbar from '../components/Navbar';
     import Billboard from '../components/Billboard';
     import MovieList from '../components/MovieList';
     import useMovies from '../hooks/useMovies';

     const Home = () => {
       const { data: movies = [] } = useMovies();

       return (
         <div>
           <Navbar />
           <Billboard />
           <div className="pb-40">
             <MovieList title="Trending Now" data={movies} />
           </div>
         </div>
       );
     };

     export default Home;
     ```

### Implementing Favorites and My List Functionality

In this section, we will implement the favorites and my list functionality.

1. **Create the FavoriteButton Component:**
   - Create a new file `FavoriteButton.tsx` in the `components` directory and add the following code:
     ```typescript
     import React from 'react';
     import axios from 'axios';
     import { useCallback } from 'react';
     import { AiOutlinePlus, AiOutlineCheck } from 'react-icons/ai';
     import useCurrentUser from '../hooks/useCurrentUser';
     import useFavorites from '../hooks/useFavorites';

     interface FavoriteButtonProps {
       movieId: string;
     }

     const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {
       const { mutate: mutateFavorites } = useFavorites();
       const { data: currentUser } = useCurrentUser();

       const isFavorite = useCallback(() => {
         const list = currentUser?.favoriteIds || [];
         return list.includes(movieId);
       }, [currentUser, movieId]);

       const toggleFavorites = useCallback(
         async (e) => {
           e.stopPropagation();
           let response;

           if (isFavorite()) {
             response = await axios.delete('/api/favorite', { data: { movieId } });
           } else {
             response = await axios.post('/api/favorite', { movieId });
           }

           const updatedFavoriteIds = response.data.favoriteIds;

           mutateFavorites({
             favoriteIds: updatedFavoriteIds,
           });
         },
         [movieId, isFavorite, mutateFavorites]
       );

       const Icon = isFavorite() ? AiOutlineCheck : AiOutlinePlus;

       return (
         <div
           onClick={toggleFavorites}
           className="cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10 border-white rounded-full flex items-center justify-center transition hover:border-neutral-300"
         >
           <Icon className="text-white" size={25} />
         </div>
       );
     };

     export default FavoriteButton;
     ```

2. **Create the useFavorites Hook:**
   - Create a new file `useFavorites.ts` in the `hooks` directory and add the following code:
     ```typescript
     import useSWR from 'swr';
     import fetcher from '../lib/fetcher';

     const useFavorites = () => {
       const { data, error, isLoading, mutate } = useSWR('/api/favorites', fetcher, {
         revalidateIfStale: false,
         revalidateOnFocus: false,
         revalidateOnReconnect: false,
       });

       return { data, error, isLoading, mutate };
     };

     export default useFavorites;
     ```

3. **Create the Favorites API Route:**
   - Create a new file `favorites.ts` in the `pages/api` directory and add the following code:
     ```typescript
     import { NextApiRequest, NextApiResponse } from 'next';
     import prisma from '../../../lib/prisma';
     import serverAuth from '../../../lib/serverAuth';

     export default async function handler(req: NextApiRequest, res: NextApiResponse) {
       if (req.method !== 'GET') {
         return res.status(405).end();
       }

       try {
         const { currentUser } = await serverAuth(req);

         const favoritedMovies = await prisma.movie.findMany({
           where: {
             id: {
               in: currentUser.favoriteIds,
             },
           },
         });

         return res.status(200).json(favoritedMovies);
       } catch (error) {
         console.log(error);
         return res.status(400).end();
       }
     }
     ```

4. **Create the Favorite API Route:**
   - Create a new file `favorite.ts` in the `pages/api` directory and add the following code:
     ```typescript
     import { NextApiRequest, NextApiResponse } from 'next';
     import prisma from '../../../lib/prisma';
     import serverAuth from '../../../lib/serverAuth';

     export default async function handler(req: NextApiRequest, res: NextApiResponse) {
       if (req.method === 'POST') {
         try {
           const { currentUser } = await serverAuth(req);
           const { movieId } = req.body;

           const existingMovie = await prisma.movie.findUnique({
             where: { id: movieId },
           });

           if (!existingMovie) {
             throw new Error('Invalid ID');
           }

           const user = await prisma.user.update({
             where: { email: currentUser.email },
             data: {
               favoriteIds: {
                 push: movieId,
               },
             },
           });

           return res.status(200).json(user);
         } catch (error) {
           console.log(error);
           return res.status(400).end();
         }
       } else if (req.method === 'DELETE') {
         try {
           const { currentUser } = await serverAuth(req);
           const { movieId } = req.body;

           const existingMovie = await prisma.movie.findUnique({
             where: { id: movieId },
           });

           if (!existingMovie) {
             throw new Error('Invalid ID');
           }

           const updatedFavoriteIds = currentUser.favoriteIds.filter((id) => id !== movieId);

           const user = await prisma.user.update({
             where: { email: currentUser.email },
             data: {
               favoriteIds: updatedFavoriteIds,
             },
           });

           return res.status(200).json(user);
         } catch (error) {
           console.log(error);
           return res.status(400).end();
         }
       } else {
         return res.status(405).end();
       }
     }
     ```

5. **Integrate the Favorites Functionality:**
   - Update the `pages/index.tsx` file to include the favorites movie list:
     ```typescript
     import React from 'react';
     import Navbar from '../components/Navbar';
     import Billboard from '../components/Billboard';
     import MovieList from '../components/MovieList';
     import useMovies from '../hooks/useMovies';
     import useFavorites from '../hooks/useFavorites';

     const Home = () => {
       const { data: movies = [] } = useMovies();
       const { data: favorites = [] } = useFavorites();

       return (
         <div>
           <Navbar />
           <Billboard />
           <div className="pb-40">
             <MovieList title="Trending Now" data={movies} />
             <MovieList title="My List" data={favorites} />
           </div>
         </div>
       );
     };

     export default Home;
     ```

### Building the InfoModal Component

In this section, we will build the info modal component that displays detailed information about a movie.

1. **Create the InfoModal Component:**
   - Create a new file `InfoModal.tsx` in the `components` directory and add the following code:
     ```typescript
     import React, { useCallback, useEffect, useState } from 'react';
     import { AiOutlineClose } from 'react-icons/ai';
     import PlayButton from './PlayButton';
     import FavoriteButton from './FavoriteButton';
     import useInfoModal from '../hooks/useInfoModal';
     import useMovie from '../hooks/useMovie';

     interface InfoModalProps {
       visible?: boolean;
       onClose: () => void;
     }

     const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose }) => {
       const [isVisible, setIsVisible] = useState(!!visible);
       const { movieId, closeModal } = useInfoModal();
       const { data } = useMovie(movieId);

       const handleClose = useCallback(() => {
         setIsVisible(false);
         setTimeout(() => {
           onClose();
         }, 300);
       }, [onClose]);

       useEffect(() => {
         setIsVisible(visible);
       }, [visible]);

       if (!isVisible) return null;

       return (
         <div className="z-50 transition-all duration-300 bg-black bg-opacity-80 flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0">
           <div className="relative w-auto mx-auto max-w-3xl rounded-md overflow-hidden">
             <div className={`${isVisible ? 'scale-100' : 'scale-0'} transform duration-300 relative h-[56.25vw] transition-transform w-[56.25vw] md:w-[45vw] lg:w-[60vw]`}>
               <video
                 className="w-full h-full object-cover transition-opacity duration-500"
                 src={data?.videoUrl}
                 poster={data?.thumbnailUrl}
                 autoPlay
                 muted
                 loop
               />
               <div className="absolute bottom-[10%] -mb-4 ml-4 md:ml-16 lg:left-0 lg:items-center lg:flex lg:h-[40vh] lg:w-screen">
                 <div className="space-y-3">
                   <PlayButton movieId={data?.id} />
                   <FavoriteButton movieId={data?.id} />
                 </div>
                 <div className="flex flex-col gap-2 mt-3">
                   <p className="text-green-400 font-semibold text-lg">
                     {data?.title}
                   </p>
                   <p className="text-white text-lg">{data?.duration}</p>
                   <p className="text-white text-lg">{data?.genre}</p>
                   <p className="text-white text-lg">{data?.description}</p>
                 </div>
               </div>
             </div>
             <div className="absolute top-4 right-4 lg:top-4 lg:right-4 cursor-pointer" onClick={handleClose}>
               <AiOutlineClose className="text-white" size={20} />
             </div>
           </div>
         </div>
       );
     };

     export default InfoModal;
     ```

2. **Create the useInfoModal Hook:**
   - Create a new file `useInfoModal.ts` in the `hooks` directory and add the following code:
     ```typescript
     import create from 'zustand';

     interface ModalStore {
       movieId?: string;
       isOpen: boolean;
       openModal: (movieId: string) => void;
       closeModal: () => void;
     }

     const useInfoModal = create<ModalStore>((set) => ({
       movieId: undefined,
       isOpen: false,
       openModal: (movieId: string) => set({ movieId, isOpen: true }),
       closeModal: () => set({ movieId: undefined, isOpen: false }),
     }));

     export default useInfoModal;
     ```

3. **Integrate the InfoModal Component:**
   - Update the `pages/index.tsx` file to include the InfoModal component:
     ```typescript
     import React from 'react';
     import Navbar from '../components/Navbar';
     import Billboard from '../components/Billboard';
     import MovieList from '../components/MovieList';
     import useMovies from '../hooks/useMovies';
     import useFavorites from '../hooks/useFavorites';
     import InfoModal from '../components/InfoModal';
     import useInfoModal from '../hooks/useInfoModal';

     const Home = () => {
       const { data: movies = [] } = useMovies();
       const { data: favorites = [] } = useFavorites();
       const { isOpen, openModal, closeModal } = useInfoModal();

       return (
         <div>
           <Navbar />
           <Billboard />
           <InfoModal visible={isOpen} onClose={closeModal} />
           <div className="pb-40">
             <MovieList title="Trending Now" data={movies} />
             <MovieList title="My List" data={favorites} />
           </div>
         </div>
       );
     };

     export default Home;
     ```

4. **Update the Billboard Component:**
   - Update the `Billboard.tsx` file to trigger the info modal:
     ```typescript
     import React from 'react';
     import useBillboard from '../hooks/useBillboard';
     import useInfoModal from '../hooks/useInfoModal';

     const Billboard = () => {
       const { data: movie } = useBillboard();
       const { openModal } = useInfoModal();

       if (!movie) return null;

       const handleOpen = () => {
         openModal(movie.id);
       };

       return (
         <div className="relative h-[56.25vw]">
           <video
             className="w-full h-full object-cover brightness-[60%] transition-opacity duration-500"
             src={movie.videoUrl}
             autoPlay
             muted
             loop
             poster={movie.thumbnailUrl}
           />
           <div className="absolute top-[30%] md:top-[40%] ml-4 md:ml-16 lg:left-0 lg:items-center lg:flex lg:h-[40vh] lg:w-screen">
             <p className="text-white text-1xl md:text-2xl lg:text-5xl font-bold shadow-xl drop-shadow-xl">
               {movie.title}
             </p>
             <p className="text-white text-[8px] md:text-lg mt-3 md:mt-8 w-[80%] md:w-[80%] lg:w-[45%] drop-shadow-xl">
               {movie.description}
             </p>
             <div className="flex flex-row items-center mt-3 md:mt-4 gap-3">
               <button className="bg-white text-white bg-opacity-30 rounded-md py-1 px-2 md:py-2 md:px-4 w-auto text-xs lg:text-lg font-semibold flex flex-row items-center hover:bg-neutral-300 transition">
                 <img src="/images/play-icon.png" alt="Play" className="mr-1" />
                 Play
               </button>
               <button
                 className="bg-white text-white bg-opacity-30 rounded-md py-1 px-2 md:py-2 md:px-4 w-auto text-xs lg:text-lg font-semibold flex flex-row items-center hover:bg-neutral-300 transition"
                 onClick={handleOpen}
               >
                 <img src="/images/info-icon.png" alt="More Info" className="mr-1" />
                 More Info
               </button>
             </div>
           </div>
         </div>
       );
     };

     export default Billboard;
     ```

### Building the Play Button and Video Player

In this section, we will build the play button and video player components.

1. **Create the PlayButton Component:**
   - Create a new file `PlayButton.tsx` in the `components` directory and add the following code:
     ```typescript
     import React from 'react';
     import { BsFillPlayFill } from 'react-icons/bs';
     import { useRouter } from 'next/router';

     interface PlayButtonProps {
       movieId: string;
     }

     const PlayButton: React.FC<PlayButtonProps> = ({ movieId }) => {
       const router = useRouter();

       return (
         <button
           onClick={() => router.push(`/watch/${movieId}`)}
           className="bg-white rounded-md py-1 px-2 md:py-2 md:px-4 w-auto text-xs lg:text-lg font-semibold flex flex-row items-center hover:bg-neutral-300 transition"
         >
           <BsFillPlayFill className="text-black w-4 lg:w-6 mr-1" />
           Play
         </button>
       );
     };

     export default PlayButton;
     ```

2. **Create the Watch Page:**
   - Create a new file `[movieId].tsx` in the `pages/watch` directory and add the following code:
     ```typescript
     import React from 'react';
     import { useRouter } from 'next/router';
     import useMovie from '../../../hooks/useMovie';

     const Watch = () => {
       const router = useRouter();
       const movieId = router.query.movieId as string;

       const { data: movie } = useMovie(movieId);

       return (
         <div className="h-screen w-screen bg-black">
           <nav className="fixed w-full p-4 z-10 flex items-center gap-8 px-4 md:px-16">
             <img src="/images/logo.png" alt="Logo" className="h-6 md:h-12" />
             <p className="text-white text-xl md:text-3xl font-bold">
               <span className="font-light">Watching:</span> {movie?.title}
             </p>
             <div className="flex gap-7 items-center">
               <div className="text-gray-400 hover:text-gray-300 cursor-pointer transition">
                 <BsFillPlayFill className="text-black w-4 lg:w-6 mr-1" />
               </div>
               <div className="text-gray-400 hover:text-gray-300 cursor-pointer transition">
                 <BsFillPlayFill className="text-black w-4 lg:w-6 mr-1" />
               </div>
               <div className="text-gray-400 hover:text-gray-300 cursor-pointer transition">
                 <BsFillPlayFill className="text-black w-4 lg:w-6 mr-1" />
               </div>
             </div>
           </nav>
           <video
             className="h-full w-full"
             src={movie?.videoUrl}
             autoPlay
             controls
           ></video>
         </div>
       );
     };

     export default Watch;
     ```

3. **Create the useMovie Hook:**
   - Create a new file `useMovie.ts` in the `hooks` directory and add the following code:
     ```typescript
     import useSWR from 'swr';
     import fetcher from '../lib/fetcher';

     const useMovie = (id?: string) => {
       const { data, error, isLoading } = useSWR(
         id ? `/api/movies/${id}` : null,
         fetcher
       );

       return { data, error, isLoading };
     };

     export default useMovie;
     ```

4. **Create the Movie API Route:**
   - Create a new file `[movieId].ts` in the `pages/api/movies` directory and add the following code:
     ```typescript
     import { NextApiRequest, NextApiResponse } from 'next';
     import prisma from '../../../lib/prisma';

     export default async function handler(req: NextApiRequest, res: NextApiResponse) {
       if (req.method !== 'GET') {
         return res.status(405).end();
       }

       const movieId = req.query.movieId as string;

       if (typeof movieId !== 'string') {
         return res.status(400).json({ error: 'Invalid ID' });
       }

       if (!movieId) {
         return res.status(400).json({ error: 'ID missing' });
       }

       const movie = await prisma.movie.findUnique({
         where: { id: movieId },
       });

       if (!movie) {
         return res.status(400).json({ error: 'Invalid ID' });
       }

       return res.status(200).json(movie);
     }
     ```

### Deploying to Vercel

In this section, we will deploy the application to Vercel.

1. **Create a GitHub Repository:**
   - Create a new repository on GitHub and push your code to the repository.

2. **Set Up Vercel:**
   - Go to the Vercel dashboard and create a new project.
   - Connect your GitHub repository to Vercel.
   - Add the following environment variables in the Vercel dashboard:
     - `DATABASE_URL`: Your MongoDB connection string.
     - `NEXTAUTH_URL`: The URL of your deployed application.
     - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID.
     - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret.
     - `GITHUB_CLIENT_ID`: Your GitHub OAuth client ID.
     - `GITHUB_CLIENT_SECRET`: Your GitHub OAuth client secret.
     - `NEXTAUTH_JWT_SECRET`: A secret key for JWT.
     - `NEXTAUTH_SECRET`: A secret key for NextAuth.

3. **Deploy the Application:**
   - Click the "Deploy" button in the Vercel dashboard to deploy your application.
   - Once the deployment is complete, you will receive a URL where your application is hosted.

### Conclusion

Congratulations! You have successfully built and deployed a full-stack Netflix clone application using Next.js, React, Tailwind CSS, Prisma, MongoDB, NextAuth, and Vercel. This project covers various aspects of web development, including authentication, database management, responsive design, and deployment.