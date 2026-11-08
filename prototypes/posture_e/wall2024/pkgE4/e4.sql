-- pkgE4 (earlier alternate start; Eric approved 12:03 CST 11-07). DB part: the hand-off table and two RPCs.
-- The sub-workflow "WALL-2024 Early Alternate" writes the alternate's reply; Get Early Alternate (main flow) reads it at Alternate Build.
CREATE TABLE IF NOT EXISTS public.early_alternate (
  id bigserial PRIMARY KEY,
  run_token text NOT NULL,
  seat_for text NOT NULL,           -- the removed (candidate) seat
  alt_seat text NOT NULL,
  api_model text NOT NULL,
  payload_sha text NOT NULL,        -- sha256 (12 hex) of the request body as Alternate Build sends it
  reply jsonb,                      -- the HTTP JSON exactly as the openrouter call returned it
  error text,
  ms integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (run_token, seat_for, payload_sha)
);
ALTER TABLE public.early_alternate ENABLE ROW LEVEL SECURITY;  -- no policies: reached only through the two SECURITY DEFINER functions

CREATE OR REPLACE FUNCTION public.record_early_alternate(p_run_token text, p_seat_for text, p_alt_seat text, p_api_model text,
  p_payload_sha text, p_reply jsonb, p_error text, p_ms integer)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public','pg_temp' AS $f$
DECLARE n integer;
BEGIN
  IF p_run_token IS NULL OR p_run_token !~ '^ODV1-' THEN RETURN 0; END IF;
  INSERT INTO early_alternate(run_token,seat_for,alt_seat,api_model,payload_sha,reply,error,ms)
  VALUES (p_run_token,p_seat_for,p_alt_seat,p_api_model,p_payload_sha,p_reply,p_error,p_ms)
  ON CONFLICT (run_token,seat_for,payload_sha) DO NOTHING;
  GET DIAGNOSTICS n = ROW_COUNT; RETURN n;
END $f$;

CREATE OR REPLACE FUNCTION public.get_early_alternate(p_run_token text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public','pg_temp' AS $f$
  SELECT coalesce(jsonb_agg(jsonb_build_object('seat_for',seat_for,'alt_seat',alt_seat,'api_model',api_model,'payload_sha',payload_sha,
         'reply',reply,'error',error,'ms',ms) ORDER BY id),'[]'::jsonb)
    FROM early_alternate WHERE run_token = p_run_token AND created_at > now() - interval '6 hours';
$f$;
GRANT EXECUTE ON FUNCTION public.record_early_alternate(text,text,text,text,text,jsonb,text,integer) TO anon;
GRANT EXECUTE ON FUNCTION public.get_early_alternate(text) TO anon;
-- Revert: DROP FUNCTION public.get_early_alternate(text); DROP FUNCTION public.record_early_alternate(text,text,text,text,text,jsonb,text,integer); DROP TABLE public.early_alternate;
