# pkgGLX2 (W2, 2026-11-08 CST; W3 Wall 3065/3066): the old glm seat out

The old seat glm (z-ai/glm-5.3) left the n8n panel on 2026-11-06 but its model_config row is still active and it is still in
odv1_record_panel_substitution's seat list, so the database would accept it as an alternate or a substitute.
Change (fix_GLX2.sql, after pkgGLX, one DO block): substitution seat list drops 'glm' (d7477482 -> ef13ee23, asserted); model_config glm active false.
Revert: revert_GLX2.sql (back to the pkgGLX version). Write order at the gap: test_GLX2.sql, then fix_GLX.sql, then fix_GLX2.sql.
Checks:
- read-only SELECT on live: anchor count 1 on the pkgGLX text, result md5 ef13ee23; after it no 'glm' remains in the function.
- test_seats_GLX2.cjs (test_seats_GLX2.txt): live s54 Init Seats, Resolve Seats, Accept Build on 33482, 33490, 33497, 33506 saved inputs give
  identical output (run token masked) with and without the glm and glm_flash rows: 12 of 12 IDENTICAL.
- test_GLX2.sql: GLX + GLX2 applied inside one rolled-back block; adds T9 (glm refused as alternate), T10 (glm refused as substitute), T8 counts
  both seats. Not run yet: run 33575 is going (no test transactions during a run).
