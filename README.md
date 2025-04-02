![Logo](public/logo.svg)

***

MyFlix is a full-stack web application that allows users to browse, search, and watch movies and TV shows. It is built using React, Next.js, TypeScript, Tailwind CSS, MongoDB, Prisma, NextAuth, and Vercel.

A full-stack Netflix clone built with:

- Next.js for server-side rendering
- React for the frontend
- Tailwind CSS for styling
- Prisma as data abstraction layer
- MongoDB for storage
- NextAuth for authentication
- TypeScript for type safety

## Features

- Authentication system with NextAuth
- Responsive design across all devices
- Movie browsing interface
- User favorites system
- Modern UI with Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (see `.env.example`)
4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth
- **Deployment**: Vercel

## Implementation

| Implementation Type                      | Category          | Description                                                                 | Documentation                       |
|------------------------------------------|-------------------|-----------------------------------------------------------------------------|-------------------------------------|
| Environment setup                       | Setup             | Initial setup of the development environment.                              | docs/Environment setup.md          |
| Auth Screen UI                          | Authentication    | Design and implementation of the authentication screen UI.                 | docs/Auth Screen UI.md             |
| NextAuth, Prisma, Mongo Setup          | Authentication    | Setup of authentication and database integration.                         | docs/NextAuth, Prisma, Mongo Setup.md |
| Google and Github OAuth                | Authentication    | Implementation of OAuth for Google and Github.                            | docs/Google and Github OAuth.md    |
| Protecting routes, Profiles screen      | Authentication    | Securing routes and implementing profile management.                     | docs/Protecting routes, Profiles screen.md |
| Navbar Component                        | UI Components     | Implementation of the navigation bar component.                          | docs/Navbar Component.md           |
| Billboard Component, Random Movie Endpoint | UI Components     | Displaying a random movie on the billboard component.                    | docs/Billboard Component, Random Movie Endpoint.md |
| Movie List & Movie Card Components, Movies Endpoint, Cool hover effect | UI Components | Displaying a list of movies with hover effects and movie card components. | docs/Movie List & Movie Card Components, Movies Endpoint, Cool hover effect.md |
| Favorites / My List functionality      | Features          | Implementing the functionality to add movies to favorites or a personal list. | docs/Favorites / My List functionality.md |
| Play Button, Video Player, Single Movie Endpoint | Features   | Implementing video playback functionality for a single movie.            | docs/Play Button, Video Player, Single Movie Endpoint.md |
| Info Modal Component                   | UI Components     | Displaying additional information in a modal component.                  | docs/Info Modal Component.md       |
| Vercel Deployment                       | Deployment        | Deploying the application using Vercel.                                   | docs/Vercel Deployment.md          |

***

***This table categorizes each implementation type under broader headings like Setup, Authentication, UI Components, Features, and Deployment. You can further refine the descriptions and add relevant documentation links as needed.***


## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Deployment

The easiest way to deploy is using [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).
