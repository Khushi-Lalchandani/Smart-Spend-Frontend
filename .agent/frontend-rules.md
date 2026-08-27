---
name: nextjs-redux-query-frontend-setup
description: Use this skill whenever scaffolding a brand-new Next.js frontend from this stack (Redux Toolkit + React Query + Axios), or when adding features (pages, API integrations, redux state, layouts, auth) to an existing project built on it. It encodes the exact stack, folder structure, boilerplate files, and coding conventions so any generated code matches existing style byte-for-byte. Trigger this whenever asked to "set up the frontend," "bootstrap this project," "add a new API-connected feature," "add a redux slice," or "follow the project conventions" for an app using this stack.
---

# Next.js + Redux Toolkit + React Query Frontend — Setup & Conventions

A Next.js 15 (App Router) + TypeScript frontend starter stack. This skill has two jobs:

1. **Scaffold from zero** — recreate this exact stack and config in a fresh repo.
2. **Extend consistently** — when adding a feature to an existing copy of this project, follow the same folder placement, naming, and API/state patterns already established here. Never introduce a new library, state manager, or HTTP client for something the existing stack already covers.

Do not implement a full feature in one shot. First inspect what exists (folders below, existing types, existing routes), then propose where the new code should live, then implement.

---

## 1. Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router), `next dev --turbopack` |
| UI | React 19 |
| Language | TypeScript 5, `strict: true` |
| Styling | Tailwind CSS v4 via `@tailwindcss/postcss` |
| State | Redux Toolkit + `react-redux` + `redux-persist` (localStorage) |
| Server data / caching | TanStack React Query v5 |
| HTTP client | Axios, wrapped in a single `useAxios` hook |
| Toasts | `sonner` |
| Formatting | Prettier 3 + `prettier-plugin-tailwindcss` |
| Linting | ESLint 9 flat config + `typescript-eslint` |
| Git hooks | Husky + lint-staged (pre-commit) |
| Fonts | `next/font/google` — Geist Sans / Geist Mono |

**Never add:** a second HTTP client, a second global-state library, a second CSS approach (CSS modules, styled-components, etc.), or a second data-fetching library. Everything server-related goes through `useAxios` + React Query; everything client/global state goes through the existing Redux store.

---

## 2. Folder Structure

```
src/
├── app/                    # Next.js App Router — routes, layout.tsx, globals.css
├── config/                 # Environment-driven constants (BASE_URL, environment)
├── layouts/                # MainLayout (providers) and AuthLayout (auth-gate wrapper)
├── redux/
│   ├── reducers/           # One slice file per domain, e.g. authSlice.ts
│   ├── store.ts            # configureStore + persistReducer + typed hooks
│   └── redux-provider.tsx  # Client provider wrapping <Provider store={store}>
├── shared/
│   ├── hooks/
│   │   ├── routes.ts       # apiRoutes — single source of truth for endpoint URLs/methods
│   │   └── index.ts        # React Query hooks (useQuery/useMutation) per feature
│   └── useAxios.tsx        # Central axios wrapper: auth header, 401/503/network handling
└── utils/
    ├── helper.tsx           # Small pure helpers (isDevEnv, etc.)
    └── types/
        ├── index.ts         # Barrel export — `export * from './xTypes'`
        ├── commonTypes.ts    # ICommonResponse base { status, message }
        ├── childrenPropsTypes.ts
        ├── useAxiosTypes.ts
        ├── authSliceTypes.ts
        └── <feature>Types.ts # One file per domain, extends ICommonResponse where relevant
```

**Rule:** one slice = one file in `redux/reducers/`. One domain = one types file in `utils/types/`, always re-exported from `utils/types/index.ts`. Never inline request/response types in a component or hook file — they belong in `utils/types/`.

---

## 3. Bootstrapping From Zero

If no project exists yet, create it and reproduce these exact files.

### 3.1 Install

```bash
npx create-next-app@latest your-project-name --typescript --tailwind --app --src-dir --import-alias "@/*"
cd your-project-name
yarn add @reduxjs/toolkit @tanstack/react-query axios react-redux redux redux-persist sonner
yarn add -D @eslint/eslintrc @eslint/js eslint-plugin-react globals husky lint-staged prettier prettier-plugin-tailwindcss typescript-eslint
npx husky init
```

### 3.2 `tsconfig.json` (path alias)

```jsonc
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Imports always go through this alias: `@/src/redux/store`, never relative paths that climb more than one or two levels.

### 3.3 `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
};

export default nextConfig;
```

### 3.4 `postcss.config.mjs`

```js
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
```

### 3.5 `eslint.config.mjs`

```js
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['.next/', 'node_modules/', 'coverage/', 'public/', 'build/', '__snapshots__/', '/types/', '**/.d.ts'],
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: { project: './tsconfig.json' },
    },
    plugins: { js: pluginJs, react: pluginReact },
    rules: {
      ...pluginReact.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^(|err|error|.*)$',
          varsIgnorePattern: '^(|err|error|.*)$',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^(|err|error|.*)$',
          destructuredArrayIgnorePattern: '^(|err|error|.*)$',
          ignoreRestSiblings: true,
        },
      ],
      'no-console': ['error', { allow: ['error'] }],
    },
  },
  ...tseslint.configs.recommended,
]);
```

### 3.6 `.prettierrc` / `.prettierignore`

```jsonc
// .prettierrc
{
  "bracketSpacing": true,
  "endOfLine": "lf",
  "printWidth": 150,
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

```
# .prettierignore
build
.next
.cache
package-lock.json
public
node_modules
next-env.d.ts
next.config.ts
yarn.lock
```

### 3.7 `.lintstagedrc` + Husky pre-commit

```jsonc
{
  "*/**/*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix", "eslint"],
  "*/**/*.{json,css,md}": ["prettier --write"]
}
```

`.husky/pre-commit`:
```bash
yarn lint-staged
```

### 3.8 `src/config/index.ts`

```ts
type Environment = 'production' | 'staging' | 'development';

const environment: Environment = (process.env.NEXT_PUBLIC_ENV as Environment) ?? 'development';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export { BASE_URL, environment };
```

Required env vars: `NEXT_PUBLIC_ENV` (`development` | `staging` | `production`), `NEXT_PUBLIC_API_URL`.

### 3.9 Redux store, persistence, and provider

`src/redux/store.ts` — single `app` root key wrapping a `persistReducer`, `user` slice whitelisted for persistence, SSR-safe noop storage fallback, typed `useAppDispatch`/`useAppSelector`:

```ts
'use client';
import { isDevEnv } from '@/src/utils/helper';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import authSlice from './reducers/authSlice';

const createNoopStorage = () => ({
  getItem() { return Promise.resolve(null); },
  setItem(_key: string, value: number) { return Promise.resolve(value); },
  removeItem() { return Promise.resolve(); },
});

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const persistConfig = { key: 'root', storage, whitelist: ['user'] };

const rootReducer = combineReducers({ user: authSlice });

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: { app: persistedReducer },
  devTools: isDevEnv,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

setupListeners(store.dispatch);
```

`src/redux/redux-provider.tsx`:
```tsx
'use client';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { store } from './store';

persistStore(store);
export default function ReduxProvider({ children }: { readonly children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
```

**Note the nesting:** because `app` wraps `persistedReducer` which wraps `user`, selectors read `state.app.user.<field>`, always with optional chaining (see §5).

### 3.10 Layouts

`src/layouts/MainLayout.tsx` — the single entry point that wires providers in order `ReduxProvider → QueryClientProvider → AuthLayout → children`, and gates first paint behind a `loading` flag to avoid hydration flicker:

```tsx
'use client';
import ReduxProvider from '@/src/redux/redux-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import AuthLayout from './AuthLayout';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { setLoading(false); }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F5F5F5]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <ReduxProvider>
      <QueryClientProvider client={queryClient}>
        <AuthLayout>{children}</AuthLayout>
      </QueryClientProvider>
    </ReduxProvider>
  );
};

export default MainLayout;
```

`src/layouts/AuthLayout.tsx` is the auth-gate seam — currently a passthrough, meant to hold redirect/guard logic as auth is built out:

```tsx
import { ChildrenProps } from '../utils/types';

const AuthLayout: React.FC<ChildrenProps> = ({ children }) => {
  return <>{children}</>;
};

export default AuthLayout;
```

### 3.11 Root `app/layout.tsx`

Sets Geist fonts and mounts the global `<Toaster />` once, above `{children}`:

```tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster richColors />
        {children}
      </body>
    </html>
  );
}
```

---

## 4. The API Layer (follow exactly — do not deviate per feature)

Every server-connected feature is built from four pieces, always in this order:

1. **Types** in `utils/types/<domain>Types.ts`, request/response interfaces, response extends `ICommonResponse`.
2. **Route definition** added to `shared/hooks/routes.ts`.
3. **React Query hook** added to `shared/hooks/index.ts`, built on `useAxios`.
4. **Consumption** in a page/component via the hook — never call `axios` directly from a component.

### 4.1 `useAxios` (do not modify unless the error-handling contract changes)

Central hook. Injects `Authorization: Bearer <token>` from the Redux store, handles network errors, 401 (logout + redirect to `/`), and 503 (redirect to `/404`), and always throws a normalized string message:

```tsx
'use client';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { removeAuthToken, removeUser } from '../redux/reducers/authSlice';
import { store, useAppDispatch } from '../redux/store';
import { ApiCallParams, ErrorResponse, ErrResponse } from '../utils/types';

const useAxios = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const callApi = useCallback(
    async ({ headers, ...rest }: ApiCallParams): Promise<unknown> => {
      try {
        const { authToken } = store.getState().app.user;
        const { data } = await axios({
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { authorization: `Bearer ${authToken}` } : {}),
            ...headers,
          },
          ...rest,
          validateStatus: (status) => status >= 200 && status <= 299,
        });
        return data;
      } catch (err) {
        const axiosError = err as AxiosError;
        if (axiosError.isAxiosError) {
          if (axiosError.code === 'ERR_NETWORK') {
            dispatch(removeAuthToken());
            dispatch(removeUser());
            router.push('/');
            toast.error('Server is under maintenance mode. Please try again later.');
            return;
          } else if (axiosError?.response?.status === 401 || axiosError?.status === 401) {
            dispatch(removeUser());
            dispatch(removeAuthToken());
            setTimeout(() => { router.push('/'); }, 4);
            const errorResponse = axiosError.response?.data as ErrorResponse;
            toast.error(errorResponse?.message || 'Unauthorized');
            return;
          } else if (axiosError.response?.status === 503) {
            router.replace('/404');
            toast.error('Service unavailable');
          }
        }
        throw (axiosError?.response as ErrResponse)?.data?.message ?? (axiosError?.response as ErrResponse)?.message ?? 'Something went wrong';
      }
    },
    [dispatch, router],
  );

  return callApi;
};

export default useAxios;
```

### 4.2 Template — adding a new endpoint

Given a new feature, e.g. "list clients" (`GET /clients/`):

**Step 1 — types** (`utils/types/clientTypes.ts`):
```ts
import { ICommonResponse } from './commonTypes';

export interface IClient {
  uuid: string;
  name: string;
}

export interface IClientListResponse extends ICommonResponse {
  data: { results: IClient[]; total: number };
}
```
Add `export * from './clientTypes';` to `utils/types/index.ts`.

**Step 2 — route** (`shared/hooks/routes.ts`):
```ts
export const apiRoutes = {
  login: { POST: { query: 'LOGIN', method: 'POST', url: `${BASE_URL}/login/` } },
  clients: { GET: { query: 'CLIENTS', method: 'GET', url: `${BASE_URL}/clients/` } },
};
```

**Step 3 — hook** (`shared/hooks/index.ts`):
```ts
const { clients } = apiRoutes;

export const useClientList = () => {
  const { url, method } = clients.GET;
  const callApi = useAxios();

  return useQuery<IClientListResponse>({
    queryKey: [clients.GET.query],
    queryFn: async () => (await callApi({ method, url })) as IClientListResponse,
  });
};
```

**Step 4 — usage** — call `useClientList()` in the page/component. Never construct the URL inline; never call `axios`/`fetch` directly.

---

## 5. Redux Conventions

- One slice per domain in `redux/reducers/<domain>Slice.ts`, built with `createSlice`.
- Selectors live at the bottom of the slice file, always optional-chained through the nested `app` root: `state?.app?.user?.field ?? fallback`.
- Only persist what must survive a refresh; add new persisted keys to `persistConfig.whitelist` deliberately, not by default.
- Reference implementation (`authSlice.ts`):

```ts
'use client';
import { UserData, UserState } from '@/src/utils/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState: UserState = { authToken: null, userData: null, darkTheme: false };

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserData>) { state.userData = action.payload; },
    removeUser(state) { state.userData = null; },
    setAuthToken(state, action: PayloadAction<string | null>) { state.authToken = action.payload; },
    removeAuthToken(state) { state.authToken = null; },
  },
});

export const { setUser, removeUser, setAuthToken, removeAuthToken } = authSlice.actions;
export default authSlice.reducer;

export const selectAuthToken = (state: RootState) => state?.app?.user?.authToken ?? null;
export const selectUser = (state: RootState) => state?.app?.user?.userData ?? null;
```

---

## 6. Styling & Formatting Rules

- Tailwind utility classes only — no CSS modules, no styled-components, no inline `style={}` unless truly dynamic (computed values).
- Class order is auto-sorted by `prettier-plugin-tailwindcss` on commit — don't hand-order classes, just write them and let the hook fix it.
- Single quotes, semicolons, trailing commas everywhere, 150-char print width, 2-space indent (`.prettierrc`).
- `console.log` is an ESLint error; only `console.error` is allowed.
- Unused vars/args/catch bindings are allowed only when named `err`/`error` (or matching that pattern) — otherwise they're lint errors.
- Every commit runs `prettier --write` + `eslint --fix` + `eslint` on staged `.ts/.tsx/.js/.jsx`, and `prettier --write` on staged `.json/.css/.md`, via Husky + lint-staged. Don't bypass this with `--no-verify`.

---

## 7. Checklist for "Set This Up From Scratch"

1. Run the install + config steps in §3.1–3.9 exactly as written.
2. Recreate `app/layout.tsx` (§3.11) and wrap the route tree's content with `MainLayout` where pages need auth/providers.
3. Confirm `.env.local` has `NEXT_PUBLIC_ENV` and `NEXT_PUBLIC_API_URL` set for the target environment.
4. Run `yarn lint` and `yarn build` before handing back — both must pass clean.
5. Do not scaffold example/demo pages beyond a minimal placeholder `app/page.tsx` unless asked for a specific feature.
6. Report: files created, any deviation from this skill and why, and what still needs product-specific implementation (real auth flow, real endpoints, dashboard, etc.).

## 8. Checklist for "Add a Feature to the Existing Project"

1. Inspect `utils/types/`, `shared/hooks/routes.ts`, and `redux/reducers/` first — reuse existing types/slices where the domain already overlaps.
2. Follow the exact 4-step API pattern in §4.2 for anything server-connected.
3. Follow §5 for any new global state.
4. Do not create a new layout unless the feature needs a genuinely different provider tree — extend `AuthLayout`/`MainLayout` instead.
5. Run lint/format before reporting done; don't rely on the pre-commit hook to catch it.