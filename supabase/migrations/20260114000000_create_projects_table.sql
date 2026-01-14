-- Create projects table
create table if not exists public.projects (
  id uuid not null default gen_random_uuid (),
  name text not null,
  date date null,
  before_image_url text null,
  after_image_url text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint projects_pkey primary key (id)
) tablespace pg_default;

-- Create update trigger function if it doesn't exist
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for projects table
drop trigger if exists update_projects_updated_at on projects;
create trigger update_projects_updated_at 
  before update on projects 
  for each row
  execute function update_updated_at_column();

-- Enable RLS
alter table public.projects enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access to projects"
  on public.projects
  for select
  to public
  using (true);

-- Create policy to allow authenticated users to insert
create policy "Allow authenticated users to insert projects"
  on public.projects
  for insert
  to authenticated
  with check (true);

-- Create policy to allow authenticated users to update
create policy "Allow authenticated users to update projects"
  on public.projects
  for update
  to authenticated
  using (true)
  with check (true);

-- Create policy to allow authenticated users to delete
create policy "Allow authenticated users to delete projects"
  on public.projects
  for delete
  to authenticated
  using (true);

