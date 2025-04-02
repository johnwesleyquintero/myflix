# Project Structure

```plaintext
src/
├── components/
│   ├── AccountMenu.tsx
│   ├── Billboard.tsx
│   ├── FavoriteButton.tsx
│   ├── InfoModal.tsx
│   ├── MobileMenu.tsx
│   ├── MovieCard.tsx
│   ├── MovieList.tsx
│   ├── Navbar.tsx
│   ├── NavbarItem.tsx
│   ├── PlayButton.tsx
├── hooks/
│   ├── useBillboard.ts
│   ├── useFavorites.ts
│   ├── useInfoModal.ts
│   ├── useMovie.ts
│   ├── useMovies.ts
├── lib/
│   ├── fetcher.ts
│   ├── prisma.ts
│   ├── serverAuth.ts
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth].ts
│   │   ├── favorite.ts
│   │   ├── favorites.ts
│   │   ├── login.ts
│   │   ├── movies/
│   │   │   ├── [movieId].ts
│   │   │   ├── index.ts
│   │   ├── random.ts
│   │   ├── register.ts
│   ├── auth.tsx
│   ├── index.tsx
│   ├── watch/
│   │   ├── [movieId].tsx
├── prisma/
│   ├── schema.prisma
├── public/
│   ├── images/
│   │   ├── default-blue.png
│   │   ├── hero.jpg
│   │   ├── info-icon.png
│   │   ├── logo.png
│   │   ├── play-icon.png
├── README.md
├── tailwind.config.js
├── tsconfig.json
```

### Explanation:

- **components/**: Contains reusable UI components such as `Navbar`, `Billboard`, `MovieList`, etc.
- **hooks/**: Contains custom hooks for managing state and data fetching, such as `useBillboard`, `useFavorites`, etc.
- **lib/**: Contains utility functions and configurations, such as `fetcher` for data fetching and `prisma` for database interactions.
- **pages/**: Contains the Next.js pages and API routes.
  - **api/**: Contains API routes for authentication, movie data, favorites, etc.
  - **auth.tsx**: The authentication page.
  - **index.tsx**: The main homepage.
  - **watch/**: Contains the page for watching a movie.
- **prisma/**: Contains Prisma schema and configuration files.
- **public/**: Contains static assets like images.
- **README.md**: The main documentation file for the project.
- **tailwind.config.js**: Configuration file for Tailwind CSS.
- **tsconfig.json**: TypeScript configuration file.

This structure organizes the project into logical directories, making it easier to manage and navigate the codebase.
