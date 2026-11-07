-- pkgPPJ v2 revert
drop function if exists public.ppj_get(jsonb);
drop function if exists public.ppj_status(jsonb);
drop function if exists public.ppj_put(jsonb);
drop table if exists public.ppj_replies;
