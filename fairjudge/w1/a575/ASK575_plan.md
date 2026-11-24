# ASK 575 plan, draft 1 (W1): serve the Accept POSTURE block from the Shared Library's existing lines
Base: live engine d8292f62 and child de9efc4e (fairjudge/w1/a573/base_*.json on the mount). Read-only planning; nothing is written. Method: as ASK 573 (Wall 11067).

## 1. OBJECTIVE
The five Accept nodes (Accept Build, Accept Check, Accept Return Build, Accept DS Return Build, Accept Final) each write out the judge prompt block POSTURE (PART2, HEADS, LINE, FORM, PROMPT, ANSWER, PLACED, RULE_C) in full: 99,588 characters in all, 4 distinct texts (Return Build and DS Return Build are one text). Most of its lines already stand in the Shared Library as whole lines. Expected effect: each node loads its own POSTURE text from the library, rebuilt byte for byte, so the engine code shrinks by 91,411 characters with no change in behaviour.

## 2. ROLES
Planner W1. Builder W4 (rebuild on a fresh live readback; write). Plan grader W4 (coordinator 18:10 CST 11-23); build grader a non-builder seat. Write card: W4's own card.

## 3. SCOPE and SEARCH
Scope: four new MAP entries, one per text ("POSTURE Accept Build", "POSTURE Accept Check", "POSTURE Accept Return Build", "POSTURE Accept Final"). Each is built from the LIB lines that already hold the text (13 distinct LIB lines, among them the PART2 line), plus a literal for each line not in LIB (65, 1,889, 200 and 2,317 characters). No LIB line is added or changed, so the LIB sha f24a5192c60cbc55 is unchanged. In each Accept node the POSTURE statement is replaced by a loader of the pkgREFP shape that throws on a missing entry or a wrong length. The same four entries go into the child's MAP (unused there), so the engine and child MAP drift check (ASK 422a) still matches; the child gains 5,120 characters.
SEARCH (probe.cjs): acorn over every code node of engine and child. A top-level POSTURE declaration is in the five Accept nodes only, with no free names in any of the four texts. Build Independent Verdict, Panel Build and Reserve Build use a POSTURE inside __R; that is not top level and is not in scope. The child has no POSTURE. The 13 LIB lines are already served to 31 modules (gate, send-back, cure, payload and merge modules, with their Alt and R2 copies). Workflows reached: c7366RPLb8vdMQg6 and SX4ZWtgHNs96uBOo are NOT SEARCHED (named per the form), plus the child and one webhook.

## 4. CRITERIA and DONE (test575.cjs; offline ALL PASS on my targets)
1. Engine LIB unchanged; every existing MAP entry unchanged.
2. Each rebuilt entry equals that node's POSTURE byte for byte (19,011; 20,930; 19,145 twice; 21,357).
3. Putting today's text back in place of each loader gives each node byte for byte.
4. The loaded POSTURE equals today's in every field, with functions compared by source.
5. Only the five Accept nodes and the Shared Library change in the engine; connections are equal; each node parses. In the child, only the MAP gains the four entries, equal to the engine's.
6. Library Check passes on the engine target, and the child drift check passes on the target pair (../a573/libpair.cjs). The engine target paired with today's child fails it.
7. Controls: an entry removed, the loader throws; one character dropped from a literal, the loader throws.
DONE: written on one card for engine and child, read back live by a non-builder seat, and the first run's Accept nodes complete with the loader.

## 5. WRONG-IF
This plan aims wrong if a POSTURE text reads a node-scoped name, or if its library lines are not the same text. Run: the free-name check gives none on all four texts (known good); C4P in D4 Build gives REFP (known bad). Every rebuilt text is byte-equal. Not wrong.

## 6. A DESIGN POINT FOR THE TEAM (leave nothing to chance)
After this change, the Accept prompts share their library lines with 31 library modules. Today an edit to the PART2 line in the library changes the panel and gate prompts but not the Accept nodes; after 575 it would change the Accept nodes too, wherever the line is shared. The texts are identical today, so nothing changes now. But a later prompt edit meant for one side reaches both, unless the builder splits the line. Every library edit already lists its MAP users (build rule), and those users would now include these four entries. The team should accept this coupling, or ask for the shared lines to be carried as literals (this costs about 18,000 characters of the saving).

## 7. RUN EVIDENCE
A run that reaches Accept Build and Accept Final completes them, and no "ASK 575:" error appears in debate_errors.

## 8. INPUTS IN GIT
fairjudge/w1/a575/: probe.cjs, posture_texts.json, build575.cjs, test575.cjs, this plan. Targets on the mount: /mnt/project-files/fairjudge/w1/a575/target_engine_575.json (c8922993) and target_child_575.json (9550e7f2).

## 9. STEPS
1. W4 grades this plan; the team rules on section 6. (no card)
2. W4 rebuilds on a fresh live readback, after the library writes ahead of it (573 adds one MAP entry; 571 appends lines; if any of them edits one of the 13 lines, rebuild the entries). (no card)
3. A non-builder seat grades the build. (no card)
4. W4 cards the write: engine and child in one write. (waits on the card)
5. Write, fetch back; W1 reads back live. Revert: restore the five nodes and both Shared Libraries from the pre-write export. (waits on the card)
6. First run evidence.
