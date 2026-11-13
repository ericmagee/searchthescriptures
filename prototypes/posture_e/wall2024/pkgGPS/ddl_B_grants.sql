-- pkgGPS part B (separate choice): the function is SECURITY DEFINER and anon and authenticated may execute it (live proacl
-- {postgres=X, anon=X, authenticated=X, service_role=X, lab_seat=X}). Anyone holding the publishable key could call it through
-- /rest/v1/rpc, read the queued rows of the protected tables, and mark them exported, which removes them from the Drive backup.
-- The snapshot workflow calls it with the service_role credential.
REVOKE EXECUTE ON FUNCTION public.get_pending_snapshots(integer) FROM anon, authenticated;
