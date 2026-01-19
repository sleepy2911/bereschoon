-- Recreate service_requests_ad to match public.service_requests exactly + quote_details
drop table if exists public.service_requests_ad;

create table public.service_requests_ad (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  service_type text not null,
  name text not null,
  email text not null,
  phone text null,
  street_address text null,
  postcode text null,
  city text null,
  message text null,
  square_meters text null,
  photo_url text null, -- JSON string of URLs
  status text not null default 'nieuw'::text,
  contact_id uuid null,
  service_options text null, -- JSON string
  service_plan text null,
  quote_details jsonb, -- Extra column for calculated quote
  
  constraint service_requests_ad_pkey primary key (id),
  constraint service_requests_ad_contact_id_fkey foreign KEY (contact_id) references contacts (id) on delete set null
);

-- Indices
create index IF not exists idx_service_requests_ad_contact_id on public.service_requests_ad using btree (contact_id);
create index IF not exists idx_service_requests_ad_status on public.service_requests_ad using btree (status);
create index IF not exists idx_service_requests_ad_created_at on public.service_requests_ad using btree (created_at desc);

-- RLS
alter table public.service_requests_ad enable row level security;

create policy "Enable insert for all users"
on public.service_requests_ad
for insert
to public
with check (true);

create policy "Enable select for service_role and authenticated users"
on public.service_requests_ad
for select
to authenticated, service_role
using (true);

grant insert on public.service_requests_ad to anon, authenticated, service_role;
grant select on public.service_requests_ad to authenticated, service_role;
