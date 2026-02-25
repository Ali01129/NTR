-- Articles table matching the app's Article type
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  category text not null,
  category_slug text not null,
  author text not null,
  published_at timestamptz not null default now(),
  image text not null,
  image_alt text,
  featured boolean default false,
  read_time integer, -- minutes
  body text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for listing by published date and category
create index if not exists idx_articles_published_at on public.articles (published_at desc);
create index if not exists idx_articles_category_slug on public.articles (category_slug);
create unique index if not exists idx_articles_slug on public.articles (lower(slug));

-- Allow public read and insert (adjust with RLS for production)
alter table public.articles enable row level security;

create policy "Allow public read access on articles"
  on public.articles for select
  using (true);

create policy "Allow public insert on articles"
  on public.articles for insert
  with check (true);

-- Optional: categories table if you want to manage them in DB later
create table if not exists public.categories (
  slug text primary key,
  name text not null
);

insert into public.categories (slug, name) values
  ('movies', 'Movies'),
  ('tv', 'TV'),
  ('gaming', 'Gaming'),
  ('tech', 'Tech'),
  ('culture', 'Culture')
on conflict (slug) do nothing;
