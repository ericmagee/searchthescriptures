W1 grade of ASK 466 test (Wall 9496, 17dd1f29) and step 1 rev 3 (Wall 9499, fed273b0); W1 readback of ASK 477 (Wall 9498).
loa_test.sql: rev 3 log_override_arming body run on temp copies of app_state and audit_log, rolled back.
Result 14:5xZ: ARMED row current_user=anon (JWT claim), DISARMED row current_user=postgres (fallback), plain key no row.
477 readback: md5 of the two step.sql blocks (086f70a6) = live 0b132fde (2268) and 625ab111 (2641).
