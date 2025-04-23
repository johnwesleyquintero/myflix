# Auth UI

---

1.  **Understand the Goal:** The main objective is to convert a raw transcript from a video tutorial (covering building an Auth UI, setting up NextAuth/Prisma/MongoDB, and adding Google/GitHub OAuth) into a well-structured, readable Markdown document suitable for technical tutorials and easily convertible to PDF.

2.  **Identify Key Sections:** I'll read through the transcript, looking for logical breaks and distinct topics. The timestamps help, but the content itself is the primary guide. I can immediately see three major sections:

    - Auth Screen UI (Styling, Layout, Input Component)
    - NextAuth, Prisma, Mongo Setup (Database, Schema, NextAuth Configuration, Registration API)
    - Google and Github OAuth (Adding OAuth providers, UI integration)

3.  **Structure with Headings:** I'll use Markdown headings to delineate these sections:

    - `# Building the Authentication UI` (Main title)
    - `## Global Styling` (Sub-section for initial CSS)
    - `## Setting up Public Assets (Images)`
    - `## Creating the Auth Page (`/pages/auth.tsx`)`
    - `## Styling the Auth Page Background`
    - `## Adding Navigation and Logo`
    - `## Creating the Auth Container`
    - `## Building the Reusable Input Component (`/components/input.tsx`)`
      - `### Input Styling`
      - `### Implementing the Floating Label Effect`
      - `### Making the Input Component Dynamic (Props)`
    - `## Integrating the Input Component into the Auth Page`
    - `## Adding State Management (Email, Password, Name)`
    - `## Adding the Submit Button`
    - `## Adding the Toggle Between Login and Register`
      - `### State for Variant`
      - `### Toggle Function`
      - `### Conditional Rendering (Title, Input, Button, Toggle Text)`
    - `## Responsive Design Considerations`

    - `# Setting Up Authentication Backend (NextAuth, Prisma, MongoDB)`
    - `## Installing Prisma and Initializing Schema`
    - `## Setting up MongoDB Atlas`
      - `### Create a Cluster`
      - `### Create a Database User`
      - `### Configure Network Access`
      - `### Get the Connection String`
    - `## Configuring Prisma Client and Schema`
      - `### Prisma Client Helper (`/lib/prismaDb.ts`)`
      - `### Handling Hot Reloading`
      - `### Global Type Definition (`/global.d.ts`)`
      - `### Defining Prisma Models (`prisma/schema.prisma`)`
        - `#### User Model`
        - `#### Account Model (for OAuth)`
        - `#### Session Model`
        - `#### Verification Token Model`
        - `#### Movie Model`
      - `### Pushing Schema to Database`
    - `## Setting Up NextAuth`
      - `### Installing NextAuth and Bcrypt`
      - `### Creating the NextAuth API Route (`/pages/api/auth/[...nextauth].ts`)`
      - `### Configuring Credentials Provider`
      - `### Configuring JWT Strategy and Secrets`
    - `## Creating the Registration API Endpoint (`/pages/api/register.ts`)`
      - `### API Route Structure`
      - `### Handling POST Requests`
      - `### Input Validation and User Check`
      - `### Hashing Password with Bcrypt`
      - `### Creating User in Database`
    - `## Implementing Registration Logic in the Frontend`
    - `## Implementing Login Logic in the Frontend`
      - `### Using `signIn`from`next-auth/react``
      - `### Redirecting After Login`
    - `## Fixing the NextAuth API Route Path`
    - `## Adding Redirect After Registration`

    - `# Adding Google and Github OAuth`
    - `## Installing React Icons`
    - `## Adding OAuth Buttons to the UI`
    - `## Configuring GitHub Provider`
      - `### Getting GitHub OAuth Credentials`
      - `### Adding Credentials to `.env``
      - `### Updating NextAuth Configuration`
      - `### Implementing GitHub Sign-In on Frontend`
    - `## Configuring Google Provider`
      - `### Setting up Google Cloud Project & OAuth Consent Screen`
      - `### Creating Google OAuth Credentials`
      - `### Adding Credentials to `.env``
      - `### Updating NextAuth Configuration`
      - `### Implementing Google Sign-In on Frontend`
    - `## Installing and Configuring Prisma Adapter for NextAuth`
      - `### Installation`
      - `### Integrating Adapter in NextAuth Configuration`

4.  **Extract and Format Content:** Now, I'll go through the transcript segment by segment, extracting the relevant information and formatting it according to Markdown rules.

    - **Instructions:** Convert statements like "we're just going to enter our Global Styles" into clear instructions like "Navigate to your global styles file (`styles/globals.css` or similar) and add the following:"
    - **Code:** Identify code snippets (CSS classes, React components, terminal commands) and wrap them in appropriate backticks. Use language identifiers (like `css`, `tsx`, `bash`, `typescript`, `prisma`).

      - Example: "add apply BG sync 900" becomes:

        ```css
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        @layer base {
          body {
            @apply bg-zinc-900 h-full overflow-x-hidden;
          }
          #__next {
            @apply h-full;
          }
          html {
            @apply h-full;
          }
        }
        ```

        _(Self-correction: The transcript mentions specific elements like `body`, `#__next`, `html`. I need to structure the CSS correctly, likely within `@layer base` for Tailwind.)_

    - **File Paths:** Clearly indicate file paths using backticks: `/public/images/hero.jpg`, `/pages/auth.tsx`, `/components/input.tsx`, `prisma/schema.prisma`, `.env`. (Self-correction: The transcript uses `.ybj` and `.ypj`, which seem like typos for image extensions. I'll use standard ones like `.png` or `.jpg` unless there's a specific reason, and mention the original transcript for clarity if needed. I'll stick to `.png` for the logo and perhaps `.jpg` for the hero, making a reasonable assumption.)
    - **Commands:** Use code blocks for terminal commands:
      ```bash
      npm run dev
      npm install -D prisma
      npx prisma init
      npm install @prisma/client
      npm install next-auth bcrypt
      npm install -D @types/bcrypt
      npm install axios
      npm install react-icons
      npm install @next-auth/prisma-adapter
      npx prisma db push
      ```
    - **Lists:** Use bullet points for steps like downloading images or configuring OAuth.
    - **Emphasis:** Use bold (`**`) for key terms, file names, or important actions. Use italics (`*`) for emphasis or notes.
    - **Explanations:** Extract the speaker's explanations (e.g., why `peer` class is needed, hot reloading issue with Prisma) and present them clearly, possibly using blockquotes or just standard paragraphs.
    - **Timestamps:** Remove the timestamps as they are irrelevant in the final document.
    - **Clarity and Conciseness:** Rephrase conversational parts ("what I want you to do now is...") into direct instructions ("Now, do the following:"). Correct minor grammatical errors or awkward phrasing inherent in transcriptions.
    - **PDF Compatibility:** Ensure the structure is linear and logical. Avoid overly complex Markdown elements that might not render well in all PDF converters. Keep code blocks well-formatted. Use standard characters.

5.  **Refine and Review:** After the initial conversion, reread the entire Markdown document.

    - **Accuracy:** Does it accurately reflect the steps in the transcript?
    - **Clarity:** Is it easy to understand and follow? Are the instructions clear?
    - **Completeness:** Are all the necessary code snippets, commands, and configuration steps included? (Self-correction: Ensure all imports mentioned or implied are included in code blocks).
    - **Formatting:** Is the Markdown syntax correct and consistent?
    - **Flow:** Does the tutorial flow logically from one section to the next?
    - **PDF Preview (Mental):** Does the structure look like it would convert cleanly to a PDF?

6.  **Add Introduction and Conclusion:** Add a brief introduction explaining the tutorial's scope and a concluding remark.

This structured approach ensures all requirements are met, transforming the raw transcript into a high-quality, usable technical tutorial in Markdown format. The iterative refinement step helps catch errors and improve clarity.Okay, here is the structured Markdown document converted from the provided transcript, focusing on clarity, PDF compatibility, and adherence to technical tutorial standards.

````markdown
# Full-Stack Myflix Clone Tutorial: Authentication Module

This tutorial guides you through building the authentication user interface and backend logic for a Myflix clone application using Next.js, Tailwind CSS, Prisma, MongoDB, and NextAuth.

---

## Part 1: Building the Authentication UI

_(Timestamp: 8:51)_

### Prerequisites

Ensure your Next.js project is set up and running:

```bash
npm run dev
```
````

### 1. Global Styling

We'll start by applying some global styles using Tailwind CSS.

Navigate to your global styles file (e.g., `styles/globals.css`) and add the following within the `@layer base` directive or equivalent:

```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-zinc-900 h-full overflow-x-hidden; /* Apply background, full height, hide x-overflow */
  }
  #__next {
    /* Target the main Next.js wrapper */
    @apply h-full;
  }
  html {
    @apply h-full;
  }
}
```

_(Timestamp: 9:28)_ These styles set a dark background and ensure the application takes up the full viewport height.

### 2. Setting up Public Assets (Images)

_(Timestamp: 9:57)_

1.  Create an `images` folder inside your `public` directory: `/public/images`.
2.  Download the `hero` and `logo` images from the provided repository (link should be in the original tutorial description).
    - Save the hero image as `/public/images/hero.jpg` (Note: transcript mentioned `.ybj`/`.ypj`, likely typos, using `.jpg` as standard).
    - Save the logo image as `/public/images/logo.png`.

### 3. Creating the Auth Page (`/pages/auth.tsx`)

_(Timestamp: 10:42)_

Create a new page file for authentication:

```bash
touch pages/auth.tsx
```

Add the basic component structure:

```typescript
// pages/auth.tsx
import React from 'react';

const Auth = () => {
  return (
    <div>
      {/* Content will go here */}
    </div>
  );
};

export default Auth;
```

You can now access this page at `/auth` in your browser (e.g., `http://localhost:3000/auth`).

### 4. Styling the Auth Page Background

_(Timestamp: 11:07)_

Update `pages/auth.tsx` to include the background image and styles:

```typescript
// pages/auth.tsx
import React from 'react';

const Auth = () => {
  return (
    <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      {/* Content will go here */}
    </div>
  );
};

export default Auth;
```

- `relative`: Necessary for absolute positioning of child elements (like overlays).
- `h-full w-full`: Make the div take full height and width.
- `bg-[url('/images/hero.jpg')]`: Sets the background image using Tailwind's arbitrary value syntax.
- `bg-no-repeat bg-center bg-fixed bg-cover`: Styles the background image to cover the area without repeating, centered, and fixed during scroll.

_(Timestamp: 12:23)_

### 5. Adding a Background Overlay

To improve text readability, add a semi-transparent black overlay:

```typescript
// pages/auth.tsx
// ... imports
const Auth = () => {
  return (
    <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        {/* Navigation and Form will go inside this overlay */}
      </div>
    </div>
  );
};
export default Auth;
```

- `bg-black w-full h-full`: Creates a full-size black div.
- `lg:bg-opacity-50`: Makes the overlay 50% transparent on large screens (`lg` breakpoint and up). The default is fully opaque on smaller screens.

### 6. Adding Navigation and Logo

_(Timestamp: 12:29)_

Add the navigation bar with the logo inside the overlay div:

```typescript
// pages/auth.tsx
import Image from 'next/image'; // Import Image component
// ... other imports

const Auth = () => {
  return (
    <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">
          <Image src="/images/logo.png" alt="Logo" width={100} height={48} className="h-12 w-auto" /> {/* Adjust width/height as needed */}
        </nav>
        {/* Form Container will go here */}
      </div>
    </div>
  );
};
export default Auth;
```

- Use the `next/image` component for optimized images.
- `px-12 py-5`: Adds padding to the navigation bar.
- `h-12`: Sets the height of the logo. (Note: Using `next/image` requires `width` and `height` props, but `className="h-12 w-auto"` can still control rendered size).

### 7. Creating the Auth Container/Form Box

_(Timestamp: 13:37)_

Below the `<nav>`, add the container for the sign-in/register form:

```typescript
// pages/auth.tsx
// ... imports and nav

        {/* Add Form Container below nav, still inside overlay div */}
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            {/* Form elements will go here */}
          </div>
        </div>
// ... rest of component
```

- `flex justify-center`: Centers the form box horizontally.
- `bg-black bg-opacity-70`: Dark background with 70% opacity.
- `px-16 py-16`: Padding inside the form box.
- `self-center`: Aligns the box vertically (useful within flex).
- `mt-2`: Small margin top.
- `lg:w-2/5 lg:max-w-md`: Sets width and max-width on large screens.
- `rounded-md`: Applies medium rounded corners.
- `w-full`: Takes full width on smaller screens.

### 8. Building the Reusable Input Component (`/components/input.tsx`)

_(Timestamp: 15:44)_

Create a dedicated component for input fields to ensure consistency and reusability.

1.  Create a `components` folder if it doesn't exist: `mkdir components`.
2.  Create the input file: `touch components/input.tsx`.

```typescript
// components/input.tsx
import React from 'react';

interface InputProps {
  id: string;
  onChange: any; // Consider using specific event type: React.ChangeEventHandler<HTMLInputElement>
  value: string;
  label: string;
  type?: string; // Optional type
}

// Using React.FC for functional component with props typing
const Input: React.FC<InputProps> = ({ id, onChange, value, label, type }) => {
  return (
    <div className="relative">
      <input
        onChange={onChange}
        value={value}
        type={type}
        id={id}
        className="
          block
          rounded-md
          px-6
          pt-6
          pb-1
          w-full
          text-md
          text-white
          bg-neutral-700
          appearance-none
          focus:outline-none
          focus:ring-0
          peer /* Important for floating label effect */
        "
        placeholder=" " /* Needs a space placeholder for the effect */
      />
      <label
        htmlFor={id}
        className="
          absolute
          text-md
          text-zinc-400
          duration-150
          transform
          -translate-y-3 /* Initial position slightly up */
          scale-75 /* Initial scale down */
          top-4 /* Position from top */
          z-10 /* Ensure label is above input background */
          origin-[0] /* Transform origin to top-left */
          left-6
          peer-placeholder-shown:scale-100 /* When placeholder is shown (input empty), scale to normal */
          peer-placeholder-shown:translate-y-0 /* When placeholder is shown, move down to normal position */
          peer-focus:scale-75 /* When input is focused, scale down */
          peer-focus:-translate-y-3 /* When input is focused, move up */
        "
      >
        {label}
      </label>
    </div>
  );
}

export default Input;
```

**Explanation:**

- **Interface `InputProps`**: Defines the expected properties for the component.
- **Relative Container (`<div className="relative">`)**: Allows absolute positioning of the label.
- **Input Styling**: Standard input styles for appearance.
  - `appearance-none`: Removes default browser styling.
  - `focus:outline-none focus:ring-0`: Removes the default focus outline.
  - `peer`: This crucial Tailwind class allows styling the sibling `label` based on the state of this `input`.
  - `placeholder=" "`: A non-empty placeholder (even just a space) is required for the `:placeholder-shown` pseudo-class (emulated by `peer-placeholder-shown`) to work correctly.
- **Label Styling**:
  - `absolute`: Positions the label relative to the container div.
  - `transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-6`: These classes define the initial "floating" state (up and small).
  - `peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0`: When the input is empty _and not focused_, the label scales to 100% and moves down to act like a placeholder.
  - `peer-focus:scale-75 peer-focus:-translate-y-3`: When the input is focused (or has value), the label moves up and scales down (the floating effect).
- **`htmlFor={id}`**: Links the label to the input for accessibility.

### 9. Integrating the Input Component into the Auth Page

_(Timestamp: 16:22, 24:27)_

Import and use the `Input` component within the form box in `pages/auth.tsx`. We also need state to manage the input values.

```typescript
// pages/auth.tsx
import React, { useState } from 'react'; // Import useState
import Image from 'next/image';
import Input from '@/components/input'; // Use alias '@/' if configured, otherwise use relative path '../components/input'

const Auth = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); // Renamed from username for consistency
  const [password, setPassword] = useState('');

  // State to toggle between Login and Register view
  const [variant, setVariant] = useState('login');

  return (
    <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="bg-black w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">
           <Image src="/images/logo.png" alt="Logo" width={100} height={48} className="h-12 w-auto" />
        </nav>
        <div className="flex justify-center">
          <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            <h2 className="text-white text-4xl mb-8 font-semibold">
              {/* Title will be dynamic */}
              Sign In
            </h2>
            <div className="flex flex-col gap-4">
              {/* Inputs will go here */}
              <Input
                label="Email"
                onChange={(ev: any) => setEmail(ev.target.value)}
                id="email"
                type="email"
                value={email}
              />
               <Input /* Keep this for password */
                label="Password"
                onChange={(ev: any) => setPassword(ev.target.value)}
                id="password"
                type="password"
                value={password}
              />
            </div>
            {/* Button and toggle text will go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
```

### 10. Adding State Management (Email, Password, Name)

_(Timestamp: 25:13)_

We've already added `useState` for `email` and `password`. Let's refine this and add `name` (used for registration).

```typescript
// pages/auth.tsx
import React, { useState, useCallback } from 'react'; // Add useCallback
// ... other imports

const Auth = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); // State for username/name
  const [password, setPassword] = useState('');

  const [variant, setVariant] = useState('login'); // 'login' or 'register'

  // Function to toggle between login and register forms
  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
  }, []); // Empty dependency array: function identity is stable

 // ... rest of the component structure (return statement)
 // ... Inside the return, update the Input components to use the state handlers

              {variant === 'register' && ( // Conditionally render Name input only for registration
                <Input
                  label="Username" // Or "Name"
                  onChange={(ev: any) => setName(ev.target.value)}
                  id="name"
                  value={name}
                />
              )}
              <Input
                label="Email"
                onChange={(ev: any) => setEmail(ev.target.value)}
                id="email"
                type="email"
                value={email}
              />
              <Input
                label="Password"
                onChange={(ev: any) => setPassword(ev.target.value)}
                id="password"
                type="password"
                value={password}
              />

 // ... rest of the content
```

- `useState` hooks manage the input field values.
- `useCallback` is used for `toggleVariant` to memoize the function, preventing unnecessary re-renders if passed down to child components (though not strictly necessary here, it's good practice).

### 11. Adding the Submit Button

_(Timestamp: 27:16)_

Add the main action button below the input fields.

```typescript
// pages/auth.tsx
// ... inside the form container div, after the inputs div

            </div> {/* Closing tag for flex flex-col gap-4 */}
            <button className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">
              {/* Button text will be dynamic */}
              Login
            </button>
            {/* Toggle text will go here */}
          </div>
        </div>

// ... rest of component
```

- Styles create a red button with hover effects.

### 12. Adding the Toggle Between Login and Register

_(Timestamp: 28:17, 29:22)_

Add text below the button to allow users to switch between the "Sign In" and "Register" forms. This involves conditional rendering based on the `variant` state.

```typescript
// pages/auth.tsx
// ... inside the form container div, after the button

            <p className="text-neutral-500 mt-12">
              {variant === 'login' ? 'First time using Myflix?' : 'Already have an account?'}
              <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                {variant === 'login' ? 'Create an account' : 'Login'}
              </span>
            </p>
          </div> {/* Closing tag for form box */}
        </div> {/* Closing tag for flex justify-center */}

// ... rest of component
```

### 13. Finalizing Conditional Rendering

_(Timestamp: 31:03)_

Update the Title (`h2`) and Button text to be dynamic based on the `variant`. Also, ensure the Name input is conditionally rendered correctly.

```typescript
// pages/auth.tsx
// ... inside the form container div

            <h2 className="text-white text-4xl mb-8 font-semibold">
              {variant === 'login' ? 'Sign In' : 'Register'} {/* Dynamic Title */}
            </h2>
            <div className="flex flex-col gap-4">
              {variant === 'register' && ( // Conditionally render Name input
                <Input
                  label="Username"
                  onChange={(ev: any) => setName(ev.target.value)}
                  id="name"
                  value={name}
                />
              )}
              <Input
                label="Email"
                onChange={(ev: any) => setEmail(ev.target.value)}
                id="email"
                type="email"
                value={email}
              />
              <Input
                label="Password"
                onChange={(ev: any) => setPassword(ev.target.value)}
                id="password"
                type="password"
                value={password}
              />
            </div>
            <button className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">
              {variant === 'login' ? 'Login' : 'Sign up'} {/* Dynamic Button Text */}
            </button>
            <p className="text-neutral-500 mt-12">
              {variant === 'login' ? 'First time using Myflix?' : 'Already have an account?'}
              <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                {variant === 'login' ? 'Create an account' : 'Login'}
              </span>
            </p>

// ... rest of component
```

### 14. Responsive Design Considerations

_(Timestamp: 33:48)_

The use of Tailwind's responsive prefixes (like `lg:`) helps ensure the layout adapts:

- The background overlay (`lg:bg-opacity-50`) changes opacity on large screens.
- The form container (`lg:w-2/5 lg:max-w-md`) adjusts its width on large screens.

---

## Part 2: Setting Up Authentication Backend (NextAuth, Prisma, MongoDB)

_(Timestamp: 34:58)_

### 1. Installing Prisma and Initializing Schema

1.  **Install Prisma Extension:** Install the official "Prisma" extension in VS Code for syntax highlighting and formatting.
2.  **Install Prisma CLI (Dev Dependency):**
    ```bash
    npm install -D prisma
    ```
3.  **Initialize Prisma:** This creates a `prisma` folder with a `schema.prisma` file and updates your `.env`.
    ```bash
    npx prisma init
    ```
4.  **Update `schema.prisma`:** Change the `provider` in the `datasource db` block from `"postgresql"` to `"mongodb"`.

    ```prisma
    // prisma/schema.prisma
    datasource db {
      provider = "mongodb" // Changed from postgresql
      url      = env("DATABASE_URL")
    }

    generator client {
      provider = "prisma-client-js"
    }

    // Models will go here
    ```

5.  **Install Prisma Client:**
    ```bash
    npm install @prisma/client
    ```

### 2. Setting up MongoDB Atlas

_(Timestamp: 36:18)_

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Sign in or create an account.
3.  **Create a Cluster:**
    - Click "Build a Database".
    - Choose the **Free Tier** (Shared, often named M0).
    - Select a cloud provider and region.
    - Keep default settings (Cluster name "Cluster0" is fine).
    - Click "Create".
4.  **Create a Database User:**
    - Under "Security" -> "Database Access", click "Add New Database User".
    - Enter a username and password (remember these!). Use a secure password for production.
    - Assign built-in role `readWriteAnyDatabase`.
    - Click "Add User".
5.  **Configure Network Access:**
    - Under "Security" -> "Network Access", click "Add IP Address".
    - Click "Allow Access From Anywhere" (`0.0.0.0/0`) for easy development setup, **OR** click "Add Current IP Address" for better security (you might need to update this if your IP changes).
    - Click "Confirm".
6.  **Get the Connection String:**
    - Go back to "Database" under "Deployment".
    - Click "Connect" for your cluster.
    - Click "Drivers" (or potentially "Connect using VS Code" as mentioned in the transcript, as it sometimes provides a more compatible format). You need the `mongodb+srv://...` string.
    - Copy the connection string.
7.  **Update `.env`:** Paste the connection string into your `.env` file, replacing the placeholder `DATABASE_URL`. Replace `<username>` and `<password>` with the database user credentials you created. You can also change `test` to your desired database name (e.g., `netflix-clone`).
    ```dotenv
    # .env
    DATABASE_URL="mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@yourcluster.mongodb.net/netflix-clone?retryWrites=true&w=majority"
    ```

### 3. Configuring Prisma Client and Schema

#### Prisma Client Helper (`/lib/prismaDb.ts`)

_(Timestamp: 36:49)_

To avoid creating multiple Prisma Client instances during development due to Next.js hot reloading, create a helper file.

1.  Create a `lib` folder: `mkdir lib`.
2.  Create the file: `touch lib/prismaDb.ts`.

```typescript
// lib/prismaDb.ts
import { PrismaClient } from '@prisma/client';

// Add prisma to the NodeJS global type
declare global {
  var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;
```

- This code checks if a Prisma client instance already exists on the global object. If so, it reuses it; otherwise, it creates a new one. In development, it assigns the instance to the global object.

_(Self-correction: The transcript mentions `global.d.ts`, which isn't strictly needed with `declare global` inside the `.ts` file itself as shown above, simplifying the setup)._

#### Defining Prisma Models (`prisma/schema.prisma`)

_(Timestamp: 40:00)_

Define the data models in `prisma/schema.prisma`.

```prisma
// prisma/schema.prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id             String    @id @default(auto()) @map("_id") @db.ObjectId
  name           String? // Made optional as per potential OAuth scenarios
  image          String?
  email          String?   @unique
  emailVerified  DateTime?
  hashedPassword String? // Optional for credential login
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  favoriteIds    String[]  @db.ObjectId

  sessions Session[] // Relation to Session model
  accounts Account[] // Relation to Account model
}

model Account {
  id                String  @id @default(auto()) @map("_id") @db.ObjectId
  userId            String  @db.ObjectId
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.String // Use @db.String for potentially large tokens
  access_token      String? @db.String
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.String
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId]) // Ensure unique combination
}

model Session {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  sessionToken String   @unique
  userId       String   @db.ObjectId
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// Optional: Movie model if part of the tutorial scope
model Movie {
  id            String @id @default(auto()) @map("_id") @db.ObjectId
  title         String
  description   String
  videoUrl      String
  thumbnailUrl  String
  genre         String
  duration      String
}
```

**Key Points:**

- `@id @default(auto()) @map("_id") @db.ObjectId`: Standard way to define MongoDB ObjectIDs in Prisma.
- `String?`: Marks fields as optional.
- `@unique`: Ensures the field value is unique across the table.
- `@default(now())`: Sets the default value to the current timestamp upon creation.
- `@updatedAt`: Automatically updates the timestamp whenever the record is modified.
- `@relation(...)`: Defines relationships between models. `onDelete: Cascade` means related records (e.g., Accounts, Sessions) are deleted if the parent User is deleted.
- `@@unique(...)`: Defines a compound unique constraint.

#### Pushing Schema to Database

_(Timestamp: 55:50)_

Apply the schema changes to your MongoDB database:

```bash
npx prisma db push
```

This command synchronizes your database schema with your `schema.prisma` file, creating collections based on your models. You can verify this in MongoDB Atlas under "Browse Collections".

### 4. Setting Up NextAuth

_(Timestamp: 56:39)_

NextAuth handles authentication flows (credentials, OAuth).

1.  **Install NextAuth and Bcrypt:**
    ```bash
    npm install next-auth bcrypt
    npm install -D @types/bcrypt # Install types for bcrypt
    ```
2.  **Create the NextAuth API Route (`/pages/api/auth/[...nextauth].ts`):**

    - Create the directory structure: `mkdir -p pages/api/auth`
    - Create the file: `touch pages/api/auth/[...nextauth].ts`
      _(Correction: The transcript initially misses the `auth` subfolder, causing issues later. Ensure the file path is correct.)_

3.  **Configure NextAuth:** Populate the file with providers and settings.

```typescript
// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials'; // Correct import path
import GithubProvider from 'next-auth/providers/github'; // Add later
import GoogleProvider from 'next-auth/providers/google'; // Add later
import { PrismaAdapter } from '@next-auth/prisma-adapter'; // Add later
import { compare } from 'bcrypt';

import prisma from '@/lib/prismaDb'; // Import Prisma client helper

export default NextAuth({
  providers: [
    // Add GithubProvider and GoogleProvider here later

    CredentialsProvider({
      id: 'credentials', // Important identifier
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      // Authorize function handles credential validation
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // Check if user exists and has a hashed password
        if (!user || !user.hashedPassword) {
          throw new Error('Email does not exist');
        }

        // Compare provided password with stored hash
        const isCorrectPassword = await compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error('Incorrect password');
        }

        // Return user object if authentication succeeds
        return user;
      },
    }),
  ],
  pages: {
    signIn: '/auth', // Redirect users to /auth if sign-in is required
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug logs in development
  // adapter: PrismaAdapter(prisma), // Add Prisma Adapter later for session/account handling
  session: {
    strategy: 'jwt', // Using JWT for session management
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET, // Secret for signing JWTs
  },
  secret: process.env.NEXTAUTH_SECRET, // General secret for NextAuth
});
```

4.  **Add Secrets to `.env`**: Generate strong secrets for production. For development:
    ```dotenv
    # .env
    # You can generate strong secrets using: openssl rand -base64 32
    NEXTAUTH_URL=http://localhost:3000 # Important for NextAuth
    NEXTAUTH_JWT_SECRET=YOUR_JWT_SECRET_HERE
    NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET_HERE
    ```
    _Restart your development server after changing `.env`._

### 5. Creating the Registration API Endpoint (`/pages/api/register.ts`)

_(Timestamp: 1:08:05)_

Create an API route specifically for handling user registration.

1.  Create the file: `touch pages/api/register.ts`

```typescript
// pages/api/register.ts
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prismaDb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email, name, password } = req.body;

    // Basic validation
    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ message: 'Missing email, name, or password' });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(422).json({ error: 'Email taken' }); // 422 Unprocessable Entity
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12); // Salt rounds: 12

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: '', // Default empty image
        emailVerified: new Date(), // Mark email as verified immediately (adjust if verification flow needed)
      },
    });

    return res.status(200).json(user); // Return created user
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(400).json({ message: `Something went wrong: ${error}` });
  }
}
```

### 6. Implementing Registration Logic in the Frontend

_(Timestamp: 1:08:18)_

Wire up the registration form in `pages/auth.tsx` to call the new API endpoint.

1.  **Install Axios (or use `fetch`):**
    ```bash
    npm install axios
    ```
2.  **Add Register Function:**

```typescript
// pages/auth.tsx
import React, { useState, useCallback } from 'react';
import axios from 'axios'; // Import axios
import { signIn } from 'next-auth/react'; // Import signIn for login
import { useRouter } from 'next/router'; // Import router for redirection
// ... other imports

const Auth = () => {
  // ... states (email, name, password, variant)
  const router = useRouter(); // Initialize router

  // ... toggleVariant function

  // Login Function (will call NextAuth directly)
  const login = useCallback(async () => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false, // Handle redirect manually or based on result
        callbackUrl: '/' // Where to redirect after successful external login via NextAuth page
      });

      if (result?.error) {
         console.error("Login Error:", result.error);
         // Add user feedback here (e.g., display error message)
      } else if (result?.ok) {
         // Successful login
         router.push('/'); // Redirect to home page
      }
    } catch (error) {
      console.error("Login Exception:", error);
      // Add user feedback here
    }
  }, [email, password, router]);


  // Register Function
  const register = useCallback(async () => {
    try {
      await axios.post('/api/register', {
        email,
        name,
        password,
      });

      // Log in the user immediately after successful registration
      login();

    } catch (error: any) { // Catch specific Axios error type if needed
       console.error("Registration Error:", error);
       // Add user feedback here (e.g., display error.response.data.error)
    }
  }, [email, name, password, login]); // Add login as dependency

  return (
    // ... JSX Structure
    // Update the button's onClick handler:
            <button onClick={variant === 'login' ? login : register} className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">
              {variant === 'login' ? 'Login' : 'Sign up'}
            </button>
    // ... rest of JSX
  );
};

export default Auth;
```

**Key Changes:**

- Imported `axios` for making the POST request to `/api/register`.
- Imported `signIn` from `next-auth/react` for the login action.
- Imported `useRouter` for redirection after successful login.
- Created `login` and `register` functions using `useCallback`.
- The `register` function calls `axios.post`. On success, it calls the `login` function.
- The `login` function calls `signIn('credentials', ...)` provided by NextAuth.
  - `redirect: false` prevents NextAuth from automatically redirecting, allowing manual handling.
  - `callbackUrl: '/'` tells NextAuth where to go _if_ it were redirecting (less relevant with `redirect: false`).
  - Check `result.error` or `result.ok` to handle success/failure and perform manual redirection using `router.push('/')`.
- Updated the main button's `onClick` to call either `login` or `register` based on the `variant`.
- Added dependencies (`email`, `name`, `password`, `login`, `router`) to `useCallback` hooks.

_(Timestamp: 1:14:53)_ You should now be able to register a new user. The form will attempt to log the user in immediately after registration.

_(Timestamp: 1:18:13)_ **Correction:** Ensure the NextAuth API route is correctly placed at `/pages/api/auth/[...nextauth].ts`. If it was initially wrong, move the file and restart the server.

_(Timestamp: 1:19:58)_ The `router.push('/')` ensures redirection after successful login.

---

## Part 3: Adding Google and Github OAuth

_(Timestamp: 1:20:37)_

Integrate third-party authentication providers.

### 1. Install React Icons

To display provider logos:

```bash
npm install react-icons
```

### 2. Add OAuth Buttons to the UI

_(Timestamp: 1:21:05)_

In `pages/auth.tsx`, add buttons for Google and GitHub login below the main login/register button and toggle text.

```typescript
// pages/auth.tsx
import { FcGoogle } from 'react-icons/fc'; // Google Icon
import { FaGithub } from 'react-icons/fa'; // Github Icon
// ... other imports

const Auth = () => {
  // ... states and functions

  return (
     // ... existing JSX structure up to the toggle text paragraph ...
            </p> {/* Closing tag for toggle text paragraph */}

            {/* OAuth Buttons Container */}
            <div className="flex flex-row items-center gap-4 mt-8 justify-center">
              {/* Google Button */}
              <div
                onClick={() => signIn('google', { callbackUrl: '/' })} // Direct sign-in call
                className="
                  w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer
                  hover:opacity-80 transition
                "
              >
                <FcGoogle size={30} />
              </div>
              {/* GitHub Button */}
              <div
                onClick={() => signIn('github', { callbackUrl: '/' })} // Direct sign-in call
                className="
                  w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer
                  hover:opacity-80 transition
                "
              >
                <FaGithub size={30} />
              </div>
            </div>

          </div> {/* Closing tag for form box */}
        </div> {/* Closing tag for flex justify-center */}
      </div> {/* Closing tag for overlay */}
    </div> /* Closing tag for main container */
  );
};

export default Auth;
```

- Import icons from `react-icons`.
- Create styled `div` elements acting as buttons.
- `onClick` handlers directly call `signIn` with the provider ID (`'google'` or `'github'`) and a `callbackUrl`. NextAuth handles the redirect flow.

### 3. Configure GitHub Provider

_(Timestamp: 1:27:13)_

1.  **Get GitHub OAuth Credentials:**
    - Go to your GitHub Settings -> Developer settings -> OAuth Apps -> New OAuth App.
    - **Application name:** `Myflix Clone Video` (or similar).
    - **Homepage URL:** `http://localhost:3000` (use your production URL later).
    - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github` (NextAuth's default callback URL structure).
    - Click "Register application".
    - Copy the **Client ID**.
    - Generate a **New client secret** and copy it immediately (it won't be shown again).
2.  **Add Credentials to `.env`:**
    ```dotenv
    # .env
    GITHUB_ID=YOUR_GITHUB_CLIENT_ID
    GITHUB_SECRET=YOUR_GITHUB_CLIENT_SECRET
    ```
3.  **Update NextAuth Configuration (`/pages/api/auth/[...nextauth].ts`):**

    - Import `GithubProvider`.
    - Add it to the `providers` array.

    ```typescript
    // pages/api/auth/[...nextauth].ts
    // ... other imports
    import GithubProvider from 'next-auth/providers/github';

    export default NextAuth({
      providers: [
        GithubProvider({
          clientId: process.env.GITHUB_ID || '', // Add fallback for type safety
          clientSecret: process.env.GITHUB_SECRET || '',
        }),
        // ... CredentialsProvider
      ],
      // ... rest of the config
    });
    ```

    _Restart your development server._

4.  **Test GitHub Sign-In:** Click the GitHub icon on your `/auth` page. You should be redirected to GitHub to authorize, then back to your app, logged in.

### 4. Configure Google Provider

_(Timestamp: 1:29:40)_

1.  **Set up Google Cloud Project & OAuth Consent Screen:**
    - Go to the [Google Cloud Console](https://console.cloud.google.com/).
    - Create a new project (e.g., `Myflix Clone Video Tutorial`) or select an existing one.
    - Navigate to "APIs & Services" -> "OAuth consent screen".
    - Choose **External** user type. Click Create.
    - Fill in required fields: App name, User support email, Developer contact information. Click Save and Continue through Scopes and Test Users (can configure later).
    - Publish the app if required (may initially be in "Testing" mode, limiting logins to explicitly added test users).
2.  **Create Google OAuth Credentials:**
    - Navigate to "APIs & Services" -> "Credentials".
    - Click "+ CREATE CREDENTIALS" -> "OAuth client ID".
    - **Application type:** Web application.
    - **Name:** `Myflix Clone Web Client` (or similar).
    - **Authorized JavaScript origins:** Add `http://localhost:3000`.
    - **Authorized redirect URIs:** Add `http://localhost:3000/api/auth/callback/google`.
    - Click Create.
    - Copy the **Client ID** and **Client secret**.
3.  **Add Credentials to `.env`:**
    ```dotenv
    # .env
    GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
    ```
4.  **Update NextAuth Configuration (`/pages/api/auth/[...nextauth].ts`):**

    - Import `GoogleProvider`.
    - Add it to the `providers` array.

    ```typescript
    // pages/api/auth/[...nextauth].ts
    // ... other imports
    import GoogleProvider from 'next-auth/providers/google';

    export default NextAuth({
      providers: [
        GithubProvider({
          /* ... */
        }),
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID || '',
          clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        CredentialsProvider({
          /* ... */
        }),
      ],
      // ... rest of the config
    });
    ```

    _Restart your development server._

5.  **Test Google Sign-In:** Click the Google icon on your `/auth` page.

### 5. Installing and Configuring Prisma Adapter for NextAuth

_(Timestamp: 1:25:55)_

To automatically handle user creation, account linking, and session management in your database when using OAuth providers, use the Prisma Adapter.

1.  **Installation:**
    ```bash
    npm install @next-auth/prisma-adapter
    ```
2.  **Integrate Adapter in NextAuth Configuration (`/pages/api/auth/[...nextauth].ts`):**

    - Import `PrismaAdapter`.
    - Add the `adapter` option to the NextAuth configuration, passing your Prisma client instance.

    ```typescript
    // pages/api/auth/[...nextauth].ts
    // ... other imports
    import { PrismaAdapter } from '@next-auth/prisma-adapter';
    import prisma from '@/lib/prismaDb'; // Ensure prisma client import is correct

    export default NextAuth({
      adapter: PrismaAdapter(prisma), // Add the adapter
      providers: [
        // ... your providers (Github, Google, Credentials)
      ],
      // ... rest of the config (pages, debug, session, jwt, secret)
    });
    ```

    _Restart your development server._

Now, when a user signs in via Google or GitHub for the first time:

- The Prisma Adapter will automatically create a `User` record in your database using the information from the provider (email, name, image).
- It will create an associated `Account` record linking this `User` to the specific OAuth provider (`provider`, `providerAccountId`).
- It will manage `Session` records for keeping the user logged in.

_(Timestamp: 1:33:22)_ Check your MongoDB Atlas "user" and "account" collections after logging in with Google/GitHub to see the automatically created records.

---

You have now successfully implemented the authentication UI, credential-based registration/login, and Google/GitHub OAuth integration using Next.js, Tailwind, Prisma, MongoDB, and NextAuth!
