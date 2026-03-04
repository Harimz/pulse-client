# Pulse Social Client

## Overview

Pulse Social Client is a TypeScript React frontend for a Spring Boot monolith backend. It supports auth, profile pages, post creation, likes, comments, explore/following feeds, and event-driven notifications. The frontend uses a centralized API client for token handling, error normalization, and refresh-on-unauthorized behavior, so network logic is consistent across modules. Data loading is built around TanStack Query + route prefetching, with cursor-based infinite scroll for feed-like surfaces. The codebase is organized by feature modules (`auth`, `posts`, `feeds`, `profile`, `notifications`, `follows`) with separate `domain/api/ui` layers.

## Tech Stack

- Frontend: React 19, TypeScript, TanStack Start/Router, Tailwind CSS 4
- Data Fetching: TanStack Query (infinite queries, route prefetch, polling for unread notifications)
- Database: PostgreSQL (managed by Spring Boot backend; this repo is frontend-only)
- Auth & Security: JWT access token + refresh token flow (via backend Spring Security)
- Deployment: Vite + Nitro Node server build output (`npm run build`)

## Core Features

- Auth bootstrap with token refresh and protected route shell.
- Explore and Following feeds with cursor-based infinite scroll.
- Post detail page with comments and optimistic cache updates.
- Profile pages with follow/unfollow behavior and self-profile edit placeholder CTA.
- Notifications page with polling (`/notifications` list + unread badge count).
- Consistent API error handling and retry behavior across all modules.

## Architecture Overview

![Pulse Client Architecture](/Users/harimzermeno/Documents/portfolio-projects/Java/pulse-client/pulse-client-diagram.svg)

### API & Data Flow

All API calls go through a centralized client in `src/shared/api/api-client.ts` and `src/shared/api/http.ts`. It injects auth headers, retries once on `401/403` using refresh logic, and normalizes failures into `ApiError`. Feature modules (`src/modules/*/api`) only define endpoint-specific calls and schema parsing.

### Route Prefetch + Query Usage

Each route prefetches core data with TanStack Router loaders (for fast first render), then consumes the same query keys in UI hooks. Feature-specific query keys (`*.keys.ts`) and options (`*.options.ts`) keep caching predictable and reusable.

### Caching Strategy

- Default query caching configured centrally in `src/router.tsx` (`staleTime`, retry, gcTime).
- Optimistic updates used for interactions like likes, comments, and follow/unfollow.
- Targeted invalidation keeps feed/profile/post data in sync.
- Notifications use lightweight polling intervals for freshness without backend realtime transport.

## Interaction & Notification Processing

User interactions (follow, mention, post) are processed by the backend’s event-driven outbox/notification pipeline. The frontend consumes this via notification list + unread count endpoints and polling. This avoids websocket/SSE complexity while still keeping the UI current.

## Database Design

Backend domain is normalized around users, profiles, posts, follows, likes, comments, notifications, and outbox events. Cursor pagination is based on `(created_at, id)` ordering, which enables stable infinite scroll behavior on the frontend.

## Testing

- Unit/component tests: Vitest + Testing Library.
- API behavior mocks: MSW.
- Focused coverage on auth bootstrapping/hooks, feed/list behavior, notifications, post hooks, and follow/profile CTA logic.

Run tests:

```bash
npm run test
```

## Tradeoffs & Future Improvements

- Polling for notifications is simpler than realtime transport but less immediate than SSE/WebSockets.
- Optimistic updates improve UX but increase cache coordination complexity.
- Profile editing UI is currently a placeholder (backend endpoint is available).
- Additional integration/e2e tests can improve confidence on multi-step flows.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set environment variables:

```bash
VITE_API_URL=http://localhost:8080
```

3. Run dev server:

```bash
npm run dev
```

4. Build production bundle:

```bash
npm run build
```
