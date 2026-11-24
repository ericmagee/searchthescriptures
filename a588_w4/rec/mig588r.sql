-- ASK 588 R (W4): the question round's record. The record line that Build Save Body writes runs BEFORE the round on a live run
-- (Build Save Body -> Save to DB -> ... -> Panel Build -> QR Merge), and a regrade never runs Build Save Body, so the record was never stored.
-- One row per run (live or regrade), written by the node QR Record right after QR Merge. Insert only; no other table is touched.
create table if not exists public.odv1_question_round_log (
  id bigserial primary key,
  run_token text not null,
  regrade boolean not null default false,
  dry boolean not null default false,
  status text not null check (status in ('RAN','SKIPPED')),
  record jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists odv1_question_round_log_run_token on public.odv1_question_round_log(run_token);
alter table public.odv1_question_round_log enable row level security;
create or replace function public.odv1_record_question_round(p_run_token text, p_regrade boolean, p_dry boolean, p_status text, p_record jsonb)
returns bigint language plpgsql security definer set search_path to 'public','pg_temp' as $f$
declare v_id bigint;
begin
  if p_run_token is null or length(p_run_token)=0 then raise exception 'run_token required'; end if;
  insert into public.odv1_question_round_log(run_token,regrade,dry,status,record)
  values (p_run_token,coalesce(p_regrade,false),coalesce(p_dry,false),p_status,coalesce(p_record,'{}'::jsonb)) returning id into v_id;
  return v_id;
end $f$;
revoke all on function public.odv1_record_question_round(text,boolean,boolean,text,jsonb) from public, anon, authenticated;
grant execute on function public.odv1_record_question_round(text,boolean,boolean,text,jsonb) to service_role, lab_seat;
