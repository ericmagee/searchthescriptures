-- ASK 466 step 2c revert (W2 9520 C-1): restores the live ACLs read 11-19 (anon EXECUTE on all three; authenticated on log_audit_event only).
BEGIN;
GRANT EXECUTE ON FUNCTION public.log_audit_event(text,text,text,date) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_session_close(text,text) TO anon;
GRANT EXECUTE ON FUNCTION public.complete_security_check(integer,text) TO anon;
COMMIT;
