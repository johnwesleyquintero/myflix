# Issue Tracker

## Overview

This document serves as an issue tracker for the project. It provides an overview of open and closed issues, their categories, descriptions, statuses, priorities, components, import traces, steps to reproduce, expected behaviors, and suggested fixes based on the latest TypeScript compiler output.

## Filters:

#### Status Legend

- ✅ **Done**: Task completed
- 🔄 **In Progress**: Currently being worked on
- ⏳ **Pending**: Not yet started

#### Priority Levels

- **Critical**: Must be addressed immediately
- **High**: Important for next release
- **Medium**: Should be completed when possible
- **Low**: Nice to have, not urgent

#### Notes

- Tasks are listed in order of priority.
- Tasks are updated as they are completed or moved to a different status.
- The current list reflects issues identified by `npx tsc --noEmit` on `C:\Users\johnw\OneDrive\Desktop\myflix`.

#### Tasks by Status

- **Completed**: Tasks that have been completed and closed.
- **New**: Tasks that have been created but not yet started.
- **In Progress**: Tasks that are currently being worked on.
- **Pending**: Tasks that are not yet started but are planned for future work.

#### Tasks by Priority

- **Critical**: Tasks that must be addressed immediately.
- **High**: Tasks that are important for the next release.
- **Medium**: Tasks that should be completed when possible.
- **Low**: Tasks that are nice to have, but not urgent.

#### Tasks by Category

- **Setup**: Tasks related to project setup and configuration (e.g., path aliases, module resolution).
- **UI**: Tasks related to user interface design and implementation.
- **Core**: Tasks related to core functionality and architecture (e.g., hooks, API routes).
- **Type Safety**: Tasks related to TypeScript type errors.
- **Dependencies**: Tasks related to missing or incorrect modules/declarations.
- **Code Quality**: Tasks related to code style, duplication, and maintainability.
- **Testing**: Tasks related to testing and QA.

---

## Open Issues

| ID  | Category     | Description                                                                     | Status     | Priority | Component                                  | Import Trace           | Steps to Reproduce | Expected Behavior                  | Suggested Fix                                                                                          |
| --- | ------------ | ------------------------------------------------------------------------------- | ---------- | -------- | ------------------------------------------ | ---------------------- | ------------------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1   | Dependencies | TS2307: Cannot find module `'@/lib/prismaDb'`                                   | ⏳ Pending | High     | `lib/serverAuth.ts:3`                      | `'@/lib/prismaDb'`     | `npx tsc --noEmit` | Module resolved correctly          | Verify `tsconfig.json` path aliases (`@/`) & ensure `prismaDb` exists with types.                      |
| 2   | Type Safety  | TS2339: Property 'data' does not exist on type from `useCurrentUser`            | ⏳ Pending | Medium   | `src/app/components/FavoriteButton.tsx:12` | `data`                 | `npx tsc --noEmit` | Type definition includes 'data'    | Check the return type of `useCurrentUser`. Ensure 'data' property exists or adjust destructuring.      |
| 3   | Dependencies | TS2304: Cannot find name 'AiOutlineCheck'                                       | ⏳ Pending | Medium   | `src/app/components/FavoriteButton.tsx:25` | `AiOutlineCheck`       | `npx tsc --noEmit` | Identifier is defined/imported     | Import `AiOutlineCheck` from its library (e.g., `react-icons/ai`).                                     |
| 4   | Dependencies | TS2307: Cannot find module `'../ui/skeleton'`                                   | ⏳ Pending | Medium   | `src/app/components/MovieList.tsx:2`       | `'../ui/skeleton'`     | `npx tsc --noEmit` | Module resolved correctly          | Verify the relative path and ensure `skeleton` component/module exists with types.                     |
| 5   | Dependencies | TS2307: Cannot find module `'@/lib/fetcher'`                                    | ⏳ Pending | High     | `src/app/hooks/useCurrentUser.ts:2`        | `'@/lib/fetcher'`      | `npx tsc --noEmit` | Module resolved correctly          | Verify `tsconfig.json` path aliases (`@/`) & ensure `fetcher` exists with types.                       |
| 6   | Code Quality | Multiple duplicate identifiers/exports/implementations (TS2300, TS2323, TS2393) | ⏳ Pending | High     | `src/app/hooks/useFavorites.ts`            | `useState`, `default`  | `npx tsc --noEmit` | Single definitions for identifiers | Review the file for duplicated code blocks (imports, exports, function definition). Remove duplicates. |
| 7   | Dependencies | TS2307: Cannot find module `'@/components/input'`                               | ⏳ Pending | Medium   | `src/app/page.tsx:3`                       | `'@/components/input'` | `npx tsc --noEmit` | Module resolved correctly          | Verify `tsconfig.json` path aliases (`@/`) & ensure `Input` component exists with types.               |
| 8   | Dependencies | TS2304: Cannot find name 'useCallback'                                          | ⏳ Pending | Medium   | `src/app/page.tsx:12`                      | `useCallback`          | `npx tsc --noEmit` | Identifier is defined/imported     | Import `useCallback` from 'react'.                                                                     |
| 9   | Dependencies | TS2307: Cannot find module `'@/lib/prisma'`                                     | ⏳ Pending | High     | `src/pages/api/auth/login.ts:2`            | `'@/lib/prisma'`       | `npx tsc --noEmit` | Module resolved correctly          | Verify `tsconfig.json` path aliases (`@/`) & ensure `prisma` client instance exists with types.        |
| 10  | Dependencies | TS2307: Cannot find module `'bcrypt'`                                           | ⏳ Pending | High     | `src/pages/api/auth/login.ts:3`            | `'bcrypt'`             | `npx tsc --noEmit` | Module resolved correctly          | Install `bcrypt` (`npm install bcrypt`) and its types (`npm install --save-dev @types/bcrypt`).        |
| 11  | Dependencies | TS2307: Cannot find module `'@/lib/prisma'`                                     | ⏳ Pending | High     | `src/pages/api/auth/register.ts:2`         | `'@/lib/prisma'`       | `npx tsc --noEmit` | Module resolved correctly          | Verify `tsconfig.json` path aliases (`@/`) & ensure `prisma` client instance exists with types.        |
| 12  | Dependencies | TS2307: Cannot find module `'bcrypt'`                                           | ⏳ Pending | High     | `src/pages/api/auth/register.ts:3`         | `'bcrypt'`             | `npx tsc --noEmit` | Module resolved correctly          | Install `bcrypt` (`npm install bcrypt`) and its types (`npm install --save-dev @types/bcrypt`).        |
| 13  | Dependencies | TS2307: Cannot find module `'@/lib/prisma'`                                     | ⏳ Pending | High     | `src/pages/api/favorite.ts:2`              | `'@/lib/prisma'`       | `npx tsc --noEmit` | Module resolved correctly          | Verify `tsconfig.json` path aliases (`@/`) & ensure `prisma` client instance exists with types.        |
| 14  | Dependencies | TS2307: Cannot find module `'@/lib/serverAuth'`                                 | ⏳ Pending | High     | `src/pages/api/favorite.ts:3`              | `'@/lib/serverAuth'`   | `npx tsc --noEmit` | Module resolved correctly          | Verify `tsconfig.json` path aliases (`@/`) & ensure `serverAuth` exists with types.                    |
| 15  | Dependencies | TS2307: Cannot find module `'@/lib/prisma'`                                     | ⏳ Pending | High     | `src/pages/api/movies/[movieId].ts:2`      | `'@/lib/prisma'`       | `npx tsc --noEmit` | Module resolved correctly          | Verify `tsconfig.json` path aliases (`@/`) & ensure `prisma` client instance exists with types.        |
| 16  | Dependencies | TS2307: Cannot find module `'@/lib/serverAuth'`                                 | ⏳ Pending | High     | `src/pages/api/movies/[movieId].ts:3`      | `'@/lib/serverAuth'`   | `npx tsc --noEmit` | Module resolved correctly          | Verify `tsconfig.json` path aliases (`@/`) & ensure `serverAuth` exists with types.                    |
| 17  | Dependencies | TS2307: Cannot find module `'@/lib/prisma'`                                     | ⏳ Pending | High     | `src/pages/api/movies/index.ts:2`          | `'@/lib/prisma'`       | `npx tsc --noEmit` | Module resolved correctly          | Verify `tsconfig.json` path aliases (`@/`) & ensure `prisma` client instance exists with types.        |
| 18  | Dependencies | TS2307: Cannot find module `'@/lib/prisma'`                                     | ⏳ Pending | High     | `src/pages/api/random.ts:2`                | `'@/lib/prisma'`       | `npx tsc --noEmit` | Module resolved correctly          | Verify `tsconfig.json` path aliases (`@/`) & ensure `prisma` client instance exists with types.        |

_Summary: Found 31 errors across 12 files._

---

## New Issues

_(This section is for manually adding new issues not detected by the compiler check)_

| ID  | Category    | Description                                          | Status | Priority | Component                          | Import Trace | Steps to Reproduce                                                                     | Expected Behavior                                             | Suggested Fix                                                                                                             |
| --- | ----------- | ---------------------------------------------------- | ------ | -------- | ---------------------------------- | ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 6   | Build Error | Module not found: Can't resolve '@/components/input' | Open   | High     | `./src/app/page.tsx`               | N/A          | 1. Run `vercel build`. <br> 2. Observe the error message regarding the missing module. | The module `@/components/input` should be resolved correctly. | - Verify the path and existence of the `input` component. <br> - Ensure the component is correctly exported and imported. |
| 7   | Build Error | Module not found: Can't resolve '@/lib/prisma'       | Open   | High     | `./src/pages/api/auth/login.ts`    | N/A          | 1. Run `vercel build`. <br> 2. Observe the error message regarding the missing module. | The module `@/lib/prisma` should be resolved correctly.       | - Verify the path and existence of the `prisma` module. <br> - Ensure the module is correctly exported and imported.      |
| 8   | Build Error | Module not found: Can't resolve 'bcrypt'             | Open   | High     | `./src/pages/api/auth/login.ts`    | N/A          | 1. Run `vercel build`. <br> 2. Observe the error message regarding the missing module. | The module `bcrypt` should be resolved correctly.             | - Verify the installation of the `bcrypt` package. <br> - Ensure the package is correctly imported.                       |
| 9   | Build Error | Module not found: Can't resolve '@/lib/prisma'       | Open   | High     | `./src/pages/api/auth/register.ts` | N/A          | 1. Run `vercel build`. <br> 2. Observe the error message regarding the missing module. | The module `@/lib/prisma` should be resolved correctly.       | - Verify the path and existence of the `prisma` module. <br> - Ensure the module is correctly exported and imported.      |
| 10  | Build Error | Module not found: Can't resolve 'bcrypt'             | Open   | High     | `./src/pages/api/auth/register.ts` | N/A          | 1. Run `vercel build`. <br> 2. Observe the error message regarding the missing module. | The module `bcrypt` should be resolved correctly.             | - Verify the installation of the `bcrypt` package. <br> - Ensure the package is correctly imported.                       |

---

## Closed Issues

_(This section is for issues that have been resolved)_

| ID  | Category   | Description        | Status  | Priority | Component | Import Trace | Steps to Reproduce | Expected Behavior | Suggested Fix |
| --- | ---------- | ------------------ | ------- | -------- | --------- | ------------ | ------------------ | ----------------- | ------------- |
| 0   | Bug Report | Sample Description | ✅ Done | High     | N/A       | N/A          | N/A                | N/A               | N/A           |
