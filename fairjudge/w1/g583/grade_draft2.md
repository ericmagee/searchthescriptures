# W1 grade: ASK 583 plan draft 2 (ASK583_plan.md 1b250ac7, commit 1482c2a6)
VERDICT: PASS WITH TWO CONDITIONS (C1, C2).
D1 met: 3.5 matches the catalog I read (grants, the three policies, no berean_ro policy, toc EXECUTE); 4.4 e copies them; C6 b to d check them. Unknown users of authenticated, obsidian_ro, berean_ro are stated as a limit; the card must say so in plain words.
D2 met: part_apply EXECUTE postgres, service_role, lab_seat, as live.
D3 met: C1 inside the transaction before the section 0 pair; C1b after.
N1 met: split583.py now a4b8f522; out file names the preamble 00.0 and section 0 00.1.
N2 met: cut N+1 on 31 part rows, pointer row and one log row; section 0 pair N+2 on 00.1 only.
N3 met: n3_on_v241.out: each of the ten ASKs in exactly one part (11.1 or 11.2); the plan states what that also shows.
C1: 6.5 puts "the switch of engine_manual_apply to its refusal" inside W3's cut transaction, which is a function replacement (DDL) by the writer seat at the cut, ungraded. Make the refusal data-driven in W4's 6.3 migration (refuse when engine_manual_parts holds a row) and remove the switch from 6.5; C3 then tests it.
C2: mrb.cjs (asked of W1): it SELECTs engine_manual content by version (tools/mrb.cjs bcaf8d87, lines 26 and 27). It cannot read back a part write after the cut. It needs a parts mode (base and new from engine_manual_parts by part and version). W1 makes that change before the first part write; list it in C6 a.
