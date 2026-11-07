-- W4: run inside one execute_sql call prefixed with: SET LOCAL truth.session_id = '<your session id>'; (the DDL audit trigger refuses unstamped writes). Not run by W1.
-- pkgPPJ v2 (W1, 11-07): store for the parallel panel judge replies. The Panel Judge Call workflow writes each reply (ppj_put); the main
-- workflow polls which slots have arrived (ppj_status) and then reads them once (ppj_get). Rows are found by a per-run random nonce made in
-- Panel Judges Prep. Same pattern as record_debate_judgment: SECURITY DEFINER functions taking one jsonb payload, executable by anon.
create table if not exists public.ppj_replies (
  id bigserial primary key,
  nonce text not null,
  slot int not null check (slot between 1 and 3),
  provider text,
  seat text,
  response_text text not null,   -- the reply as JSON text, so its key order and bytes come back unchanged (jsonb would reorder keys)
  created_at timestamptz not null default now(),
  unique (nonce, slot)
);
alter table public.ppj_replies enable row level security; -- no policies: reached only through the functions below
revoke all on public.ppj_replies from anon, authenticated;

create or replace function public.ppj_put(payload jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare n text := payload->>'nonce'; s int := (payload->>'slot')::int;
begin
  if n is null or length(n) < 24 or n !~ '^ppj-' then raise exception 'ppj_put: bad nonce'; end if;
  if s is null or s not between 1 and 3 then raise exception 'ppj_put: bad slot'; end if;
  if payload->>'response_text' is null or left(payload->>'response_text',1) <> '{' then raise exception 'ppj_put: response_text must be a JSON object text'; end if;
  insert into ppj_replies(nonce, slot, provider, seat, response_text)
  values (n, s, payload->>'provider', payload->>'seat', payload->>'response_text')
  on conflict (nonce, slot) do nothing;            -- the first stored reply for a slot stands
  delete from ppj_replies where created_at < now() - interval '3 days';
  return jsonb_build_object('ok', true, 'slot', s);
end $$;

create or replace function public.ppj_status(payload jsonb) returns jsonb
language sql security definer set search_path = public as $$
  select jsonb_build_object('slots', coalesce(jsonb_agg(slot order by slot), '[]'::jsonb))
  from ppj_replies where nonce = payload->>'nonce';
$$;

create or replace function public.ppj_get(payload jsonb) returns jsonb
language sql security definer set search_path = public as $$
  select jsonb_build_object('rows', coalesce(jsonb_agg(jsonb_build_object('slot', slot, 'provider', provider, 'seat', seat, 'response_text', response_text) order by slot), '[]'::jsonb))
  from ppj_replies where nonce = payload->>'nonce';
$$;

revoke all on function public.ppj_put(jsonb), public.ppj_status(jsonb), public.ppj_get(jsonb) from public;
grant execute on function public.ppj_put(jsonb), public.ppj_status(jsonb), public.ppj_get(jsonb) to anon;
