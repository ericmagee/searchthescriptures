# pkgFCB: K-FC, the CARRIED BY check on FORCED lines (W3 feedback ruling B7)

W3's rulings (00:05Z 11-07) are TRIAL for one run, then LIVE if that run shows zero false items, with the check made against the whole KJV verse through Cited Verses.

## The rule
- A FORCED line carries `CARRIED BY: "<the words of the pressed witness's own verse that state its MEANS>"`, placed between FAILS and GROUND.
- **Finding the press's verse.** The code takes the reference on the press's MEANS line, in the round that the FORCED line names. When the MEANS quotation itself opens with a reference, it takes that one instead.
- **The check.** The CARRIED BY words must stand in that verse as the run read it (kkjvStands against Cited Verses), and must be at least 3 words.
- **NOT CHECKED (no item).** A verse the run did not read, or a press reference the code cannot find, is listed NOT CHECKED when a CARRIED BY is written.
- **Side-neutral.** Every FORCED line is checked, whichever side it breaks.

## Consequence
- **TRIAL.** ENF_STATUS 'K-FC':'TRIAL'. The mark ends "not counted in audit_flags", so it leaves data_class alone.
- **Silence rule.** Eric's standing silence rule (reply 2185) still applies: a K-FC item with NO written response counts in drv_uncured, like every other TRIAL rule.
- **Cure.** RETRACTED, a RESTATED line not graded LINK BROKEN, or a FORCED line for the item whose CARRIED BY passes.

## Edits, by node
| Nodes | Edits |
|---|---|
| Build Independent Verdict, Panel Build | __R396F: the form gains CARRIED BY, plus one sentence on K-FC |
| Extract Independent Verdict, Panel Payloads, Alternate Payloads | the library, a kfcLines call after kfLines, and ENF |
| the 19 cure and gate nodes | the library, ENF, cureLabel and cureAsk lists, res keys, and the K-FC cure block before K-F's |

Not changed: the Commitment 13 example in the agreement text (Accept nodes, enforcer builds), because changing it would change the text judges accepted.

## Bases
- pkgPTA/patched for its part A nodes: Panel Cure Check, Alternate Payloads, Alternate Merge.
- pkgLNX/patched for Extract Independent Verdict.
- Live 1b49671d for the rest.

So the write order is pkgPTA part A, then pkgLNX, then pkgFCB. pkgL2R (W1, Wall 2662) also edits the L2C library in many of these nodes. Its anchors are text-exact and do not overlap these, so run its builder on these finals, or this builder on its finals. Shas are in plan_FCB.json.

## Tests
- `node pkgFCB/test_FCB.cjs` gives 34 OK. It runs:
  - replay_FCB.cjs: 150 checks on the 30 stored FORCED lines since 32791. All 30 press verses were found. As stored, each gives one K-FC item (no CARRIED BY). With a CARRIED BY taken from the verse, none does. With words from another verse, one item names the verse. With the verse not read, NOT CHECKED. The K-F parse is unchanged by the new field.
  - The base + edits identity for all 24 nodes.
  - The cure block on mocked replies.
  - scope_FCB.cjs: an acorn scope check that kfcLines and everything it reads are in scope in all 22 library nodes.
- Expected first run: every FORCED line written without CARRIED BY raises one TRIAL K-FC item. That is the rule working, not a false item. A false item is a CARRIED BY whose words do stand in the verse but are refused.

## Write and revert
- Write: replace jsCode with patched/<node>.js.
- Revert: base/<node>.js, which holds each node's base exactly as built on.
