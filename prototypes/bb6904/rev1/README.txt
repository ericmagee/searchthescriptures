R4 wrong-if (P2D revision 1, amended, order 6904).
wrongif.cjs reads kb.cjs from its own directory; copy it there first:
  git show 8935d6c:prototypes/bb6889/kb.cjs > prototypes/bb6904/rev1/kb.cjs
Run: node prototypes/bb6904/rev1/wrongif.cjs <rows.json>   (rows: [{id, verdict_raw}], R4's replay rows by run_token)
Cases run before posting: good.json SILENT (3 K-B items, from row 238's stored lines, prototypes/bb6889/lines238.json);
bad.json FIRED (one flag dropped, D5 vs C3); null.json FIRED (verdict_raw NULL); empty.json FIRED (no rows).
