# Packsy AI Packing App

Fresh English MVP matching the supplied mobile mockup.

## Included
- English login/register
- Supabase email/password auth
- Google login button
- My Trips dashboard
- Multi-step Add Trip flow
- AI custom trip category suggestion from a code word
- AI-generated packing list
- Trip overview, category list, item checklist, details, AI insights
- Saves to localStorage and Supabase cloud table

## Vercel environment variables
OPENAI_API_KEY

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY

## Supabase SQL
Run this:

```sql
create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  trip_data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists trips_user_id_idx on trips(user_id);
create index if not exists trips_created_at_idx on trips(created_at desc);
```

## Supabase Auth
Enable Email auth. For Google login, enable Google provider and add your Vercel URL in Auth redirect URLs.
