# B4 — VERIFIER FALSIFIERS (worker C, board bb4e6060)

Written and committed **before** worker B posted its builder falsifiers, so neither set is
anchored on the other. That independence is the point; if these were written after B's, they
would tend to check what B already thought to check.

**Authority:** Eric ruled 2026-08-16, "i approve changes and recommendation." Recorded BB-0611.
**Authorized change:** `stamp_audit_actor` appends the FULL asserted token as a NEW segment across
all three attribution regimes. The legacy 8-character `sess=` / `sess?` tag is left untouched.
Appends only; rejects nothing; cannot block a write.
**Not authorized:** anything touching `engine`, anything touching the 18 spellings, anything that
rejects or rewrites a caller-supplied `performed_by`, and any repair of the five lost rows.

**Role split (BB-0555 T2):** B builds, C verifies. The builder never verifies its own work.

---

## The failure these must catch

Two identifiers, `cowork-bb0229` and `cowork-bb0290`, both stored as `cowork-b`. Five rows dated
2026-08-04 carry `sess=cowork-b` and are unattributable to either hand by anyone, permanently.
95% of tagged rows (2,485 of 2,625) sit at that same 8-character cut. A build that does not
separate those two specific identifiers has not fixed the thing it was authorized to fix.

---

## Falsifiers

Each states what result proves the build BROKEN. A verifier's job is to break it, not to confirm it.

**V1 — FULL TOKEN, UNTRUNCATED.**
Assert a token longer than 8 characters with a distinctive tail. Write an audit row. Read it back.
*Broken if:* the new segment carries only the first 8 characters, or any prefix short of the whole
token. The entire defect is a truncation; propagating it into the new field fixes nothing.

**V2 — THE PROVEN COLLISION, BY NAME.**
Assert `cowork-bb0229`, write, read back. In a **separate transaction**, assert `cowork-bb0290`,
write, read back.
*Broken if:* the two rows are not distinguishable in the new segment. This is the exact pair that
destroyed attribution. It is not a representative case, it is *the* case.

**V3 — LEGACY TAG BYTE-IDENTICAL.**
For identical input, compare the old trigger's `sess=` / `sess?` output against the new one.
*Broken if:* the legacy tag differs in any byte. Every existing query reading the current format
must be unaffected — that non-breaking property is what the ruling was granted on.

**V4 — REGIME 3 IS ACTUALLY REACHED.**
Insert an audit row with `performed_by` supplied by the caller (the case the old trigger skipped
entirely, because it fires only when the column is NULL).
*Broken if:* no new segment is appended. Reaching this regime is the amendment's whole purpose.

**V5 — REGIME 2 CARRIES THE FULL POINTER.**
With no token asserted, write a row so it falls back to the global pointer.
*Broken if:* the new segment carries the 8-character slot rather than the full pointer value.
Regime 2 is 1,115 rows and 1,026 of them sit at the cut; it is not a rounding error.

**V6 — NEVER BLOCKS A WRITE.**
Assert a pathological token: very long, embedded quotes, pipes, newlines, non-ASCII.
*Broken if:* the audit row fails to be written. `stamp_audit_actor` wraps its body in
`EXCEPTION WHEN OTHERS THEN NULL` precisely so attribution can never cost an audit record. If the
build moves any logic outside that wrapper, this fails.

**V7 — SEPARATOR INJECTION.**
The tag format is pipe-delimited (`app_name|session_user|addr|tag`). Assert a token that itself
contains `|`.
*Broken if:* a reader parsing by pipe can be made to see a forged `session_user` or address field.
This is an attribution record; a token that can inject a fake *observed* segment would let a seat
manufacture the very cross-check the observed context exists to provide. If the build cannot
prevent it, it must declare the limitation rather than leave it undiscovered.

**V8 — NO DOUBLE APPEND.**
Pass a value that already carries the new segment back through the trigger.
*Broken if:* the segment is duplicated. Attribution that grows on each pass is not attribution.

**V9 — EXISTING ROWS UNTOUCHED.**
Count and checksum `performed_by` across all existing rows before and after the replacement.
*Broken if:* any existing row changed. `block_audit_rewrites` should prevent it — verify it FIRED
rather than assuming it would.

**V10 — T7 APPLIES TO EVERY ONE OF THE ABOVE.**
`stamp_audit_actor` cannot raise. A broken append is therefore SILENT.
*Broken if:* any check above was satisfied by the absence of an error. Every one reads the row back
and confirms the row exists by explicit count. A quiet return proves nothing.

---

## Declared not covered by this set (T4)

- Collisions among identifiers that never reached the blackboard. A seat can assert any text; my
  sweep covered only `from_session` / `addressed_to`. Unmeasured, and unmeasurable from a record
  that already truncated the evidence. B shares this blind spot; neither of us has closed it.
- The `engine` column, which carries the same identity sprawl (13 spellings across 46 rows) and is
  outside this ruling.
- Whether the full token is itself *meaningful* — it is asserted, never authenticated. F-1 stands.
  These falsifiers test that the record carries what the seat stated, not that the statement is true.
