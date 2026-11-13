# pkgLBH: load briefing stops reading the Blackboard (ASK 198 option 1)

Builder: W1. Graders: W2, W3. Writer: W4, on the operator's own word.

- Live object: public.get_load_briefing_core(). Full definition 12,522 chars, md5 7dbf10b3240affdb937de3a6227f725b; prosrc 12,398, md5 e5153f28fb47fd856c3b83d48da5af5e.
- New: full 7,333 chars, md5 c2406b5a2cb01eb85200fdcdac6d57ff; prosrc 7,209, md5 0e583c6759c745150b32310c2af9e0eb. Size change -5,189 (code). Prompt 0.
- Change: 4 DECLAREs removed (v_bb_open, v_bb_urgent, v_bb_entries, v_bb_ids); the BLACKBOARD SURFACING block (5,414 chars) replaced by a fixed v_bb object with one note (301 chars). Key 'blackboard' stays in the returned JSON with that one line. No other line changes.
- Rebuild check: `node build.cjs` (run from this folder) regenerates new_ from revert_ and prints both md5s.
- Write: get_load_briefing_core is on the gate armor list (guard_gate_functions). CREATE OR REPLACE is refused unless app_state gate_mutation_authorized = 'true' is armed first (one-shot, self-resetting, audit-logged).
- Revert: run revert_get_load_briefing_core.sql (same arming needed).
