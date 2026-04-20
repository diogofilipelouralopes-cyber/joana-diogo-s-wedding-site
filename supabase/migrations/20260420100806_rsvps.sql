create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  attending boolean not null,
  allergies text,
  song_suggestion text,
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;

-- Anyone (including anonymous guests) can submit an RSVP
create policy "Anyone can insert an rsvp"
  on public.rsvps for insert
  to anon, authenticated
  with check (true);
