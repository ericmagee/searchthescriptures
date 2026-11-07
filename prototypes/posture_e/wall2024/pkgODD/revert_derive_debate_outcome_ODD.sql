-- pkgODD revert. Removes the pkgODD block and checks the result is the pre-pkgODD md5 2c39766e2bdcf7ecfcd1779a648f1db4.
DO $oddr$
DECLARE
  v_def text := pg_get_functiondef('public.derive_debate_outcome(uuid)'::regprocedure);
  v_new text;
  v_a int; v_b int;
BEGIN
  v_a := strpos(v_def, E'  -- pkgODD (Eric 10:14 CST');
  v_b := strpos(v_def, E'  -- AMENDMENT THREE (BB-7397, ruled BB-7402)');
  IF v_a = 0 OR v_b <= v_a THEN RAISE EXCEPTION 'pkgODD revert: block not found. Nothing changed.'; END IF;
  v_new := substr(v_def, 1, v_a - 1) || substr(v_def, v_b);
  IF md5(v_new) <> '2c39766e2bdcf7ecfcd1779a648f1db4' THEN
    RAISE EXCEPTION 'pkgODD revert: result md5 % is not 2c39766e2bdcf7ecfcd1779a648f1db4. Nothing changed.', md5(v_new);
  END IF;
  EXECUTE v_new;
END
$oddr$;
