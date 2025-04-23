# Securing routes and implementing profile management.

1.  **Understand the Goal:** The user wants to convert a video tutorial transcript about protecting routes and creating a profiles screen in a Next.js application (likely using NextAuth.js and Prisma) into a structured Markdown document. This document should be suitable for tutorials, documentation, and easily convertible to PDF.

2.  **Identify Key Topics:** I'll scan the transcript for major sections or concepts. The title itself ("Protecting routes, Profiles screen") gives a big clue. As I read through, I see:

    - Protecting API routes using a server-side helper (`serverAuth`).
    - Creating a new API endpoint (`/api/current`) to fetch the logged-in user.
    - Creating a custom hook (`useCurrentUser`) with SWR for client-side data fetching.
    - Protecting client-side pages (`getServerSideProps`).
    - Handling potential MongoDB connection issues.
    - Creating the UI for the Profiles screen.
    - Fetching user data on the Profiles screen.
    - Redirecting users upon profile selection.

3.  **Structure the Document:** Based on the key topics, I'll outline the document structure using Markdown headings:

    - `# Protecting Routes and Creating the Profiles Screen` (Main Title)
    - `## Introduction` (Brief overview)
    - `## Protecting API Routes`
      - `### Creating the `serverAuth` Utility` (Code and explanation)
    - `## Creating the `/api/current` Endpoint`
      - `### Implementation` (Code and explanation)
    - `## Client-Side Data Fetching with SWR`
      - `### Creating the `fetcher` Utility` (Code and explanation)
      - `### Installing SWR` (Command)
      - `### Creating the `useCurrentUser` Hook` (Code and explanation)
    - `## Protecting Client-Side Pages`
      - `### Implementing `getServerSideProps` on the Home Page` (Code and explanation)
      - `### Adding a Logout Button` (Code snippet)
      - `### Troubleshooting: MongoDB Connection Issues` (Explanation and solution)
      - `### Fetching and Displaying User Data on the Home Page` (Code and explanation)
    - `## Creating the Profiles Screen`
      - `### Creating the Profiles Page Component` (Basic structure)
      - `### Protecting the Profiles Route` (Code and explanation)
      - `### Updating Login Redirect Logic` (Code changes in `auth.tsx`)
      - `### Adding Default Profile Image` (Instructions)
      - `### Building the Profiles UI` (Code and explanation for styling)
      - `### Displaying User Information` (Code and explanation)
      - `### Adding Navigation on Profile Click` (Code and explanation)
    - `## Conclusion` (Summary)

4.  **Flesh out Each Section:** Now, I'll go through the transcript chronologically, extracting relevant information, code snippets, and explanations for each section defined in the structure.

    - **Timestamps:** Ignore the timestamps (e.g., `1:33:40`). They are irrelevant for the final document.
    - **Code Extraction:** Identify code blocks. Pay attention to file paths mentioned (e.g., `lib/serverAuth.ts`, `pages/api/current.ts`, `lib/fetcher.ts`, `hooks/useCurrentUser.ts`, `pages/index.tsx`, `pages/profiles.tsx`). Use triple backticks with the appropriate language (`typescript`, `tsx`, `bash`).
    - **Explanations:** Extract the speaker's explanations for _why_ certain code is being written. Rephrase informal language ("all right so now I want to show you...") into more formal tutorial language ("This section explains how to protect...").
    - **Inline Code:** Use single backticks for function names (`serverAuth`, `getSession`), filenames (`serverAuth.ts`), variable names (`currentUser`, `session`), package names (`next-auth/react`, `swr`), commands (`npm install swr`), API routes (`/api/current`), CSS classes (`text-white`), etc.
    - **Steps/Instructions:** Use numbered or bulleted lists for sequential steps (like creating files, installing packages, adding code).
    - **Imports:** Clearly show necessary import statements within code blocks. Pay attention to path aliases (`@/lib/serverAuth` vs. `../../lib/serverAuth`) and mention the alternative if the speaker does.
    - **Troubleshooting:** The section about MongoDB network access is important. Dedicate a subsection to it.
    - **UI Styling:** When describing the Profiles UI, mention the purpose of key CSS classes (like `group`, `group-hover`).
    - **Clarity and Conciseness:** Remove filler words, repetitions, and overly conversational phrases. Ensure the flow is logical.
    - **PDF Compatibility:** Stick to standard Markdown features. Avoid complex HTML embeds or highly customized elements that might not render well in PDF. Ensure code blocks are clearly delineated.

5.  **Review and Refine:** Read through the generated Markdown.
    - Check for accuracy: Does the code match the description? Are the file paths correct?
    - Check for clarity: Is the language easy to understand? Is the structure logical?
    - Check for completeness: Have all the key steps from the transcript been included?
    - Check formatting: Are headings, lists, code blocks, and inline code used correctly and consistently?
    - Check PDF readiness: Does it look like a clean, well-structured document?

**(Self-Correction Example during the process):** Initially, I might just dump all the code into one big block. Then, during refinement, I'd realize it's better to break it down by file (`serverAuth.ts`, `current.ts`, etc.) with explanations preceding each block, matching the tutorial's flow. I also need to make sure I explicitly mention _where_ each file should be created (e.g., "Create a new file `serverAuth.ts` inside the `lib` directory"). I also noticed the speaker mentions path aliases (`@/lib/...`) versus relative paths (`../../lib/...`) and incorporated that explanation. The MongoDB troubleshooting part was a distinct segment in the transcript and needs its own clear section in the Markdown.Okay, here is the structured Markdown document converted from the provided transcript. It follows the requested guidelines for tutorials, documentation, and PDF compatibility.

---

# Protecting Routes and Creating the Profiles Screen

This tutorial covers how to protect both client-side and API routes in a Next.js application using NextAuth.js, and how to build a user profiles screen.

## Introduction

We will implement authentication checks to secure parts of our application. This involves:

1.  Creating a server-side utility to verify user sessions in API routes.
2.  Building an API endpoint to fetch the current logged-in user's data.
3.  Implementing client-side route protection using `getServerSideProps`.
4.  Using the SWR library for efficient client-side data fetching.
5.  Creating a functional "Profiles" screen similar to Netflix.

## Protecting API Routes

To avoid repeating authentication logic in every API route, we'll create a reusable server-side utility.

### Creating the `serverAuth` Utility

1.  **Create the file:** Inside the `lib` directory, create a new file named `serverAuth.ts`.

    - _Note:_ If you use path aliases like `@/lib`, ensure your `tsconfig.json` is configured. Otherwise, use relative paths (e.g., `../../lib/prismaDb`).

2.  **Add the code:**

    ```typescript
    // lib/serverAuth.ts
    import { NextApiRequest } from 'next';
    import { getSession } from 'next-auth/react';
    import prismaDb from '@/lib/prismaDb'; // Or use relative path: ../../lib/prismaDb

    const serverAuth = async (req: NextApiRequest) => {
      // 1. Get the session using the request context
      const session = await getSession({ req });

      // 2. Check if session, user, or email exists
      if (!session?.user?.email) {
        throw new Error('Not signed in');
      }

      // 3. Fetch the current user from the database using the email from the session
      const currentUser = await prismaDb.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

      // 4. Check if the user was found in the database
      if (!currentUser) {
        throw new Error('Not signed in'); // User might have been deleted
      }

      // 5. Return the found user
      return { currentUser };
    };

    export default serverAuth;
    ```

**Explanation:**

- This asynchronous function `serverAuth` takes the `NextApiRequest` object.
- It uses `getSession({ req })` to retrieve the user session based on the JWT token likely present in the request cookies or headers managed by NextAuth.js.
- It performs validation checks:
  - Ensures a session exists and contains user email information.
  - Queries the database using Prisma to find the user associated with the session's email.
- If any check fails, it throws a "Not signed in" error.
- If successful, it returns an object containing the `currentUser` data retrieved from the database.

## Creating the `/api/current` Endpoint

This API route will use our `serverAuth` utility to safely return the data of the currently logged-in user.

### Implementation

1.  **Create the file:** Inside the `pages/api` directory (**_not_** `pages/api/auth`), create a new file named `current.ts`.

2.  **Add the code:**

    ```typescript
    // pages/api/current.ts
    import { NextApiRequest, NextApiResponse } from 'next';
    import serverAuth from '@/lib/serverAuth'; // Or use relative path: ../../lib/serverAuth

    export default async function handler(
      req: NextApiRequest,
      res: NextApiResponse
    ) {
      // 1. Limit to GET requests only
      if (req.method !== 'GET') {
        return res.status(405).end(); // Method Not Allowed
      }

      try {
        // 2. Use serverAuth to get the current user
        // serverAuth handles session checking and throws errors if not authenticated
        const { currentUser } = await serverAuth(req);

        // 3. Return the user data if successful
        return res.status(200).json(currentUser);
      } catch (error) {
        // 4. Handle errors (e.g., 'Not signed in' from serverAuth)
        console.error(error);
        return res.status(400).end(); // Bad Request or Unauthorized (adjust status code as needed)
      }
    }
    ```

**Explanation:**

- This API handler first checks if the request method is `GET`. If not, it returns a `405 Method Not Allowed` status.
- It calls `await serverAuth(req)` within a `try...catch` block.
- If `serverAuth` executes successfully, it destructures `currentUser` from the result and returns it with a `200 OK` status.
- If `serverAuth` throws an error (meaning the user is not authenticated or an issue occurred), the `catch` block handles it, logs the error, and returns a `400 Bad Request` status (or potentially `401 Unauthorized`).

## Client-Side Data Fetching with SWR

To fetch the current user data on the client-side efficiently, we'll use SWR, a popular data fetching library for React.

### Creating the `fetcher` Utility

SWR requires a fetcher function. We'll create a simple one using Axios.

1.  **Create the file:** Inside the `lib` directory, create `fetcher.ts`.
2.  **Add the code:**

    ```typescript
    // lib/fetcher.ts
    import axios from 'axios';

    const fetcher = (url: string) => axios.get(url).then((res) => res.data);

    export default fetcher;
    ```

### Installing SWR

Open your terminal in the project directory and run:

```bash
npm install swr
# or
# yarn add swr
```

Remember to restart your development server after installing new packages.

### Creating the `useCurrentUser` Hook

This custom hook will encapsulate the logic for fetching user data using SWR.

1.  **Create the folder and file:** Create a new folder named `hooks` in the root or `src` directory. Inside `hooks`, create `useCurrentUser.ts`.
2.  **Add the code:**

    ```typescript
    // hooks/useCurrentUser.ts
    import useSWR from 'swr';
    import fetcher from '@/lib/fetcher'; // Adjust path if needed

    const useCurrentUser = () => {
      // Use SWR to fetch data from '/api/current' using our fetcher
      const { data, error, isLoading, mutate } = useSWR(
        '/api/current',
        fetcher,
        {
          // Optional: Configuration options for SWR
          shouldRetryOnError: false, // Don't retry automatically on error
          revalidateOnFocus: false, // Don't revalidate automatically on window focus
          revalidateOnReconnect: false, // Don't revalidate automatically on reconnect
        }
      );

      return {
        // Rename 'data' to 'user' for clarity
        user: data,
        error,
        isLoading,
        // 'mutate' allows manual re-fetching or updating of the data
        mutate,
      };
    };

    export default useCurrentUser;
    ```

**Explanation:**

- The `useCurrentUser` hook utilizes the `useSWR` hook from the `swr` package.
- It specifies the API endpoint key (`/api/current`) and the `fetcher` function to use.
- SWR handles caching, revalidation, loading states (`isLoading`), and error states (`error`).
- The hook returns an object containing the fetched `user` data (aliased from `data`), `error`, `isLoading` state, and the `mutate` function.

## Protecting Client-Side Pages

We need to ensure that only authenticated users can access certain pages, like the home page (`/`).

### Implementing `getServerSideProps` on the Home Page

1.  **Open the file:** Go to `pages/index.tsx`.
2.  **Add `getServerSideProps`:**

    ```typescript
    // pages/index.tsx
    import { NextPageContext } from 'next';
    import { getSession, signOut } from 'next-auth/react'; // Import signOut too
    import useCurrentUser from '@/hooks/useCurrentUser'; // Import the hook

    // ... potentially other imports

    // Add this function to the file
    export async function getServerSideProps(context: NextPageContext) {
      const session = await getSession(context);

      // If no session exists, redirect to the authentication page
      if (!session) {
        return {
          redirect: {
            destination: '/auth', // Your authentication page route
            permanent: false, // Not a permanent redirect
          },
        };
      }

      // If session exists, allow page access and pass empty props (or session if needed)
      return {
        props: {}
      }
    }

    // Your Home component
    export default function Home() {
      // ... (rest of your component logic)

      return (
        <div>
          {/* ... Existing content ... */}
        </div>
      );
    }
    ```

**Explanation:**

- `getServerSideProps` runs on the server before the page is rendered.
- It calls `getSession(context)` to check for an active session.
- If `session` is null (user is not logged in), it returns a `redirect` object, sending the user to the `/auth` page.
- If `session` exists, it returns an empty `props` object, allowing the page component (`Home`) to render.

### Adding a Logout Button

For testing purposes, add a simple logout button to the home page.

1.  **Modify the Home component:**

    ```typescript
    // pages/index.tsx
    // ... (imports including signOut and useCurrentUser)
    // ... (getServerSideProps)

    export default function Home() {
      // Fetch user data using the hook
      const { user } = useCurrentUser();

      return (
        <>
          <h1 className="text-2xl text-green-500">Myflix Clone</h1>
          {/* Display user info */}
          <p className="text-white text-lg">
            Logged in as: {user?.name} ({user?.email})
          </p>

          {/* Logout Button */}
          <button
            onClick={() => signOut()}
            className="h-10 w-full bg-white mt-4" // Basic styling
          >
            Log out
          </button>
        </>
      );
    }
    ```

Now, if you log out, you should be redirected to `/auth`. Trying to access `/` directly while logged out will also result in a redirect.

### Troubleshooting: MongoDB Connection Issues

If you encounter login problems, especially errors like `Server selection timed out` or `No available servers` in your terminal, it might be a MongoDB Atlas Network Access issue.

1.  **Go to MongoDB Atlas:** Navigate to your cluster's page.
2.  **Network Access:** Click on "Network Access" in the left-hand sidebar.
3.  **Check IP Addresses:** Ensure your current IP address is allowed. If you have a dynamic IP, it might have changed since you initially configured access.
4.  **Add/Update IP:**
    - Click "Add IP Address".
    - For testing/development convenience, you can choose "Allow Access From Anywhere" (IP: `0.0.0.0/0`). **Note:** This is less secure and generally not recommended for production.
    - Alternatively, add your _current_ IP address. You might need to update this periodically if your IP changes.
5.  **Confirm:** Click "Confirm" and wait for the changes to become active.
6.  **Restart Server:** Restart your Next.js development server (`npm run dev` or `yarn dev`).

### Fetching and Displaying User Data on the Home Page

Now that we have the `useCurrentUser` hook, we can easily display the logged-in user's information.

1.  **Modify the Home component** (as shown in the "Adding a Logout Button" section above): Import `useCurrentUser` and display `user.name` or `user.email`.

    ```typescript
    // pages/index.tsx
    // ... (imports)
    import useCurrentUser from '@/hooks/useCurrentUser';

    // ... (getServerSideProps)

    export default function Home() {
      const { user } = useCurrentUser(); // Get user data

      return (
        <>
          <h1 className="text-2xl text-green-500">Myflix Clone</h1>
          {/* Display user info */}
          <p className="text-white text-lg">
            Logged in as: {user?.name} ({user?.email})
          </p>
          <button onClick={() => signOut()} className="h-10 w-full bg-white mt-4">
            Log out
          </button>
        </>
      );
    }

    ```

## Creating the Profiles Screen

This screen allows users to select their profile after logging in.

### Creating the Profiles Page Component

1.  **Create the file:** Inside the `pages` directory, create `profiles.tsx`.
2.  **Add basic structure:**

    ```typescript
    // pages/profiles.tsx
    import { NextPageContext } from 'next';
    import { getSession } from 'next-auth/react';

    // Protect the route (similar to index.tsx)
    export async function getServerSideProps(context: NextPageContext) {
      const session = await getSession(context);

      if (!session) {
        return {
          redirect: {
            destination: '/auth',
            permanent: false,
          },
        };
      }

      return {
        props: {}
      }
    }

    const Profiles = () => {
      return (
        <div className="flex items-center h-full justify-center">
           {/* Content will go here */}
           <h1 className="text-3xl text-white">Who is watching?</h1>
        </div>
      );
    };

    export default Profiles;
    ```

### Protecting the Profiles Route

The `getServerSideProps` function added above already protects this route, redirecting unauthenticated users to `/auth`.

### Updating Login Redirect Logic

We want users to be redirected to the `/profiles` screen after successfully logging in, instead of the default (`/`).

1.  **Open the auth page:** Go to `pages/auth.tsx`.
2.  **Modify Login Callback:** Find your `login` function (likely within a `useCallback`). Update the `signIn` call:

    ```typescript
    // pages/auth.tsx
    import { signIn } from 'next-auth/react';
    // Remove import { useRouter } from 'next/router'; if only used for push

    // ... inside your component ...

    // Remove const router = useRouter(); if only used for push

    const login = useCallback(async () => {
      try {
        await signIn('credentials', {
          email,
          password,
          // redirect: false, // Remove this line or set to true explicitly
          callbackUrl: '/profiles' // Set the desired callback URL
        });

        // router.push('/profiles'); // Remove this line - signIn handles redirection now
      } catch (error) {
        console.error(error);
      }
    }, [email, password]);

    // Modify Google/GitHub Sign In as well
     const socialSignIn = (provider: 'google' | 'github') => {
        signIn(provider, { callbackUrl: '/profiles' });
     }


    // ... inside your JSX ...
    // Make sure the onClick handlers for Google/GitHub call socialSignIn('google') etc.
     <div onClick={() => socialSignIn('google')} className="...">
        {/* Google Icon */}
     </div>
     <div onClick={() => socialSignIn('github')} className="...">
         {/* GitHub Icon */}
     </div>

    ```

### Adding Default Profile Image

1.  **Download an image:** Get a default profile picture (e.g., `default-blue.png`, `default-red.png`) from a source like the tutorial's GitHub repository public/images folder.
2.  **Place the image:** Put the downloaded image inside your `public/images/` directory.

### Building the Profiles UI

Let's style the profiles page.

1.  **Modify `profiles.tsx`:**

    ```typescript
    // pages/profiles.tsx
    import { NextPageContext } from 'next';
    import { getSession } from 'next-auth/react';
    import useCurrentUser from '@/hooks/useCurrentUser'; // Import hook
    import { useRouter } from 'next/router'; // Import router for navigation

    // ... getServerSideProps (as defined before) ...

    const Profiles = () => {
      const router = useRouter(); // Initialize router
      const { user } = useCurrentUser(); // Get user data

      return (
        <div className="flex items-center h-full justify-center">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-6xl text-white text-center">Who is watching?</h1>
            <div className="flex items-center justify-center gap-8 mt-10">
              {/* Profile Item Container */}
              <div onClick={() => router.push('/')}> {/* Navigate to home on click */}
                <div className="group flex-row w-44 mx-auto">
                  {/* Profile Image */}
                  <div
                    className="
                      w-44
                      h-44
                      rounded-md
                      flex
                      items-center
                      justify-center
                      border-2
                      border-transparent
                      group-hover:cursor-pointer
                      group-hover:border-white
                      overflow-hidden
                    "
                  >
                    <img src="/images/default-blue.png" alt="Profile" /> {/* Update path if needed */}
                  </div>
                  {/* Profile Name */}
                  <div
                    className="
                      mt-4
                      text-gray-400
                      text-2xl
                      text-center
                      group-hover:text-white
                    "
                  >
                    {user?.name} {/* Display user name */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    export default Profiles;

    ```

**Explanation:**

- The outer `div` centers the content vertically and horizontally.
- An inner `div` uses `flex-col` to stack the title and the profiles grid.
- The "Who is watching?" title is styled.
- Another `div` acts as the container for profile items (`gap-8`, `mt-10`).
- The profile item itself is wrapped in a `div` with an `onClick` handler that uses `router.push('/')` to navigate to the home page.
- The `group` class is added to the profile container. This allows styling child elements based on the hover state of the parent (using `group-hover:`).
- The image `div` has styling for size, rounded corners, centering, and a border that appears on hover (`group-hover:border-white`). `overflow-hidden` prevents potential image overflow.
- The `img` tag points to the default profile image in the `public` folder.
- The name `div` below the image also uses `group-hover:text-white` to change color when the profile item is hovered.

### Displaying User Information

The code above already includes fetching the user data using `useCurrentUser` and displaying the `user?.name` under the profile image.

### Adding Navigation on Profile Click

The `onClick={() => router.push('/')}` handler on the profile item container (added in the UI section) handles redirecting the user to the main application page (`/`) when they click their profile.

## Conclusion

You have successfully implemented:

- Server-side authentication protection for API routes using a reusable `serverAuth` utility.
- A dedicated API endpoint (`/api/current`) to fetch authenticated user data.
- Client-side page protection using `getServerSideProps` and `getSession`.
- Efficient client-side data fetching with a custom `useCurrentUser` hook powered by SWR.
- A functional Profiles screen that displays user information and allows navigation into the main application.

This setup provides a robust way to handle authentication and user data throughout your Next.js application.

---
