# MEO Watch - Google Maps Ranking Monitor

A SaaS application for monitoring Google Maps business rankings and competitor analysis.

## Features

- **Keyword Tracking**: Monitor your business ranking for specific keywords and locations
- **Historical Data**: Track ranking changes over time with detailed analytics
- **Competitor Analysis**: Analyze competitor businesses in your market
- **Export Capabilities**: Export ranking data in CSV, XLSX, and JSON formats
- **Subscription Management**: Tiered pricing plans with Stripe integration

## Subscription Plans

- **Starter**: ¥1,980/month - Up to 3 keywords
- **Business**: ¥3,980/month - Up to 10 keywords + competitor analysis + CSV export
- **Professional**: ¥7,980/month - Up to 50 keywords + API access + priority support

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Styling**: Tailwind CSS 4
- **Data Collection**: Google Maps API

## Getting Started

1. **Clone and install dependencies:**

```bash
git clone <repository>
cd meo-watch
npm install
```

2. **Set up environment variables:**

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `GOOGLE_MAPS_API_KEY`: Your Google Maps API key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_SECRET_KEY`: Your Stripe secret key

3. **Set up database:**

- Create a new Supabase project
- Run the database schema from `docs/design/meo-watch/database-schema.sql`
- Run the RLS policies from `supabase/policies.sql`

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development Commands

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint with auto-fix
npm run lint:check   # Run ESLint without auto-fix
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript type checking

# Git Hooks
npm run prepare      # Set up Husky git hooks
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── lib/
│   ├── supabase/       # Supabase client and utilities
│   └── utils/          # Utility functions
└── types/              # TypeScript type definitions

docs/
├── spec/               # Requirements documentation
├── design/             # Technical design documents
└── tasks/              # Implementation task breakdown
```

## Documentation

- [Requirements](./docs/spec/meo-watch-requirements.md)
- [Architecture Design](./docs/design/meo-watch/architecture.md)
- [Database Schema](./docs/design/meo-watch/database-schema.sql)
- [API Specifications](./docs/design/meo-watch/api-spec.md)
- [Task Breakdown](./docs/tasks/meo-watch-tasks.md)

## Contributing

1. Follow the established code style (ESLint + Prettier)
2. Write TypeScript with strict mode enabled
3. Use conventional commit messages
4. All commits trigger pre-commit hooks for linting and formatting

## License

This project is private and proprietary.
