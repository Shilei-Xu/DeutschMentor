# German Learning Platform

## Overview

A focused language learning application designed for building German vocabulary through reading comprehension. Users read German articles, highlight unfamiliar words, and create personalized dictionary entries with translations and context. The platform emphasizes a distraction-free reading experience with seamless integration between article content and dictionary functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing
- **TanStack Query** (React Query) for server state management and caching

**UI Framework:**
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- Material Design-inspired design system optimized for reading

**Design Principles:**
- Reading-first interface with optimized typography (Merriweather/Lora for content, Inter for UI)
- Progressive disclosure to minimize visual clutter
- Responsive layout with mobile-first approach
- Generous spacing and line height for comfortable extended reading sessions

**Key Layout Decisions:**
- Article content constrained to `max-w-4xl` for optimal reading width
- Dictionary sidebar fixed at `w-80` to `w-96`
- Article list uses responsive grid: single column on mobile, 2-3 columns on larger screens
- Mobile uses Sheet component for dictionary (slide-out panel)

### Backend Architecture

**Server Framework:**
- **Express.js** with TypeScript
- Development mode uses Vite middleware for hot module replacement
- Production mode serves static built files
- Session management via `connect-pg-simple`

**Development vs Production:**
- Development (`server/index-dev.ts`): Integrates Vite dev server for HMR
- Production (`server/index-prod.ts`): Serves pre-built static assets from `dist/public`
- Both modes share core application logic from `server/app.ts`

**API Design:**
- RESTful endpoints under `/api` prefix
- Resource-based routing: `/api/articles` and `/api/dictionary`
- Standard HTTP methods (GET, POST, DELETE)
- Zod validation for request payloads using Drizzle-generated schemas

### Data Storage

**ORM and Database:**
- **Drizzle ORM** for type-safe database operations
- Configured for **PostgreSQL** dialect (via `@neondatabase/serverless`)
- Schema-first approach with TypeScript type inference

**Data Models:**

1. **Articles Table:**
   - `id`: UUID primary key (auto-generated)
   - `title`: Text, required
   - `content`: Text, required (German article text)
   - Purpose: Store reading material for language learning

2. **Dictionary Words Table:**
   - `id`: UUID primary key (auto-generated)
   - `word`: Text, required (highlighted German word)
   - `translation`: Text, required (user-provided translation)
   - `context`: Text, required (sentence/phrase containing the word)
   - `articleId`: Foreign key reference to articles
   - Purpose: Personal vocabulary tracking with contextual learning

**Storage Abstraction:**
- `IStorage` interface defines contract for data operations
- `MemStorage` class provides in-memory implementation for development/testing
- Allows swapping storage backends without changing application logic
- Production would swap to Drizzle-based implementation against PostgreSQL

### State Management

**Server State:**
- TanStack Query manages all API data fetching and caching
- Query keys follow REST endpoint structure: `["/api/articles"]`, `["/api/articles", id]`
- Automatic cache invalidation after mutations (create/delete operations)
- Optimistic UI updates prevented; refetch after mutations for consistency

**Client State:**
- React hooks for component-level state (text selection, UI toggles)
- Form state managed by `react-hook-form` with Zod validation
- Toast notifications via custom `useToast` hook
- No global state management library (Redux/Zustand) - server state handles most needs

### User Interaction Flow

**Word Learning Workflow:**
1. User selects/highlights text in article content
2. `WordTooltip` component appears at selection position
3. User enters translation and saves
4. POST to `/api/dictionary` with word, translation, context, and articleId
5. Word appears in dictionary sidebar for that article
6. Dictionary persists across sessions via database

**Key Interaction Patterns:**
- Text selection triggers tooltip positioned via DOM `getBoundingClientRect()`
- Context extraction finds containing paragraph for fuller context
- Mobile uses Sheet component for dictionary access
- Search/filter within dictionary for quick word lookup

### Authentication and Authorization

**Current State:**
- No authentication implemented
- All data is public/shared
- Session management infrastructure present but unused

**Design Consideration:**
- Session middleware (`connect-pg-simple`) configured for future user isolation
- Architecture supports adding user-scoped data with minimal changes
- Would require adding `userId` foreign key to articles and dictionary words tables

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Unstyled accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- **shadcn/ui**: Pre-styled component layer built on Radix UI
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Drizzle Kit**: Database migration and schema management CLI
- **TypeScript**: Type safety across entire stack
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Plugins**: Development environment enhancements (error overlay, cartographer, dev banner)

### Styling and Design
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing pipeline
- **Autoprefixer**: Automatic vendor prefix addition
- **class-variance-authority**: Type-safe variant styles for components
- **clsx** + **tailwind-merge**: Conditional className utilities

### Data and Validation
- **Zod**: Runtime type validation and schema definition
- **Drizzle-Zod**: Automatic Zod schema generation from Drizzle tables
- **@tanstack/react-query**: Async state management

### Database
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **Neon Database** (implied): Serverless Postgres hosting platform
- Connection via `DATABASE_URL` environment variable

### Form Handling
- **react-hook-form**: Performant form state management
- **@hookform/resolvers**: Integrates Zod validation with react-hook-form

### Utilities
- **date-fns**: Date manipulation and formatting
- **nanoid**: Compact unique ID generation
- **cmdk**: Command palette component (imported but not visibly used)

### Font Resources
- **Google Fonts**: Inter (UI elements) and Merriweather (reading content)
- Preconnected in HTML for performance optimization