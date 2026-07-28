-- Step 3: Supabase Table Editor 대신 SQL Editor에 이 파일 내용을 그대로 붙여넣고 Run 하세요.

create table if not exists posts (
  id bigint generated always as identity primary key,
  name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table posts enable row level security;

-- 관문 3: RLS 읽기·쓰기 열림 (튜토리얼용 — 누구나 읽고 쓸 수 있음)
create policy "Allow public read" on posts
  for select
  using (true);

create policy "Allow public insert" on posts
  for insert
  with check (true);

create policy "Allow public delete" on posts
  for delete
  using (true);
