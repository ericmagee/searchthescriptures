# ASK 516b build (W4, seat 35), to W3 plan516b.md rev 7 (e2e13266). NOT written.

Base: live engine 31702b15 and child cd2d84d8. These are 515 rev 7, equal to the 516 revert fetch-backs, library 6f2ae36f19303a92.
Targets: target_engine_516b.json and target_child_516b.json. The md5s are in the Wall post. Library 6f2ae36f19303a92 -> e481127ff69347f9, still 3560 lines.

## What changes, in plain words
1. Library line 3191 (pkgREC). The rounds text is built as in 516: THE ROUNDS IN FULL, all eight rounds tagged and as stored.
   - The body no longer holds it. In its place the body holds one line: "[THE ROUNDS IN FULL: <n> characters, md5 <8>; the same in every call of this run]".
   - The md5 is computed by a pure-JS md5 inside the line, because the n8n sandbox has no require or crypto.
   - When the rounds cannot be read, the old "(rounds not available: ...)" text goes in the body as before, with no placeholder.
   - POINTS AT ISSUE is unchanged.
2. Judge Enforcer Build (the MAP return head) and library line 3246 (the Alt and R2 Alt Builds). The first output item gains one field, rounds516, which holds the rounds text. No other item holds it.
3. Judge Enforcer Resume. It now returns the Build's items without rounds516. Nothing else changes.
4. Twelve senders, 8 engine and 4 child.
   - jsonBody was "={{ $json.body }}". It is now one fill expression, the same text in all 12 except the Build node name. When the body holds the placeholder, the fill puts that Build's rounds516 in its place and sends the result.
   - If rounds516 is missing, or its length is not the n in the placeholder, the expression errors. The node's onError (continueRegularOutput) records the error, and the placeholder is never sent.
   - A body without the placeholder, such as an Enforcer Build body in the Batch, is sent unchanged.
5. prompt_sent in the log. It now holds the placeholder line, not the rounds. Library line 3405 (the three Judge Enforcer Records) and the three Reread Records add "; prompt_tokens <usage.prompt_tokens>" inside that line's bracket.
Removed: nothing from what the model receives. From the stored bodies and from prompt_sent, the rounds copy is removed; the placeholder line stands in its place.
Unchanged: RULES, the items, packing, max_tokens, the cure code, the Batch, Retry, Resend and Reread Builds, Write Enforcer Log, and every other node.

## Checks (replay516b.js on 41117 Judge Enforcer Build inputs; checks516b.js)
- 36 of 36 replay checks and 13 of 13 build checks pass (replay516b_41117.txt).
- C1: every sent body equals the live-516 body (target_engine_516.json, library 1bcba53c), byte for byte as JSON.
  - Direct, on 10 calls through all 12 sender expressions.
  - Through the actual node code: Batch Build (11 items, 10 J), Retry and Resend (20 each, every call forced to retry), Reread (1 call). Each is run for the Judge, Alt and R2 Alt paths.
- Known-bad cases: rounds missing, wrong length, or the Build not executed each give an error. A body with no placeholder is unchanged.
- md5: the function in line 3191 on 41117's rounds gives d5d44e5221385255b6f74da3f5de1855, equal to Python hashlib. The placeholder n and md5 equal the rounds held.
- Expressions: the 12 are one text except the Build name. None holds "{{" or "}}" inside.
- Nodes changed: engine 12 (Shared Library, Judge Enforcer Resume, Reread Record, Alt Reread Record and the 8 senders); child 6 (Shared Library, R2 Alt Reread Record and the 4 senders). The node set and connections are unchanged.
- C3: prompt_sent holds the marker and no rounds copy. With a reply, it reads "...; prompt_tokens N]". With no usage, it is unchanged.

## Coverage limits (rev 7 D3)
- The Alt and R2 Alt Builds were not run on real alternate data: 41117 seated none, and 41155 has no node data.
  - Their senders, Retry, Resend and Reread were run as real node code, on the 41117 Judge Build items placed under the Alt and R2 names.
  - Line 3246, which adds rounds516 to the Alt and R2 Builds, was only syntax-checked and rebuilt inside those Builds. It was not run.
- 41155 (alternates seated): from debate_enforcer_log, 28 of 249 prompts carry the rounds, 15 of them alternate rows. All 28 hold one identical rounds text of 124,700 characters, so a single held copy serves every call of the run.

## C2 and WRONG-IF (measure516b_41117.json)
The 41117 shape, with the same inputs through 515 rev 7 (live), 516 and 516b: 2 of 10 calls retried (4 halves), 1 half resent, 1 reread call. Held = every Build, Batch, Resume, Retry, Resend and Reread output, each IF counted, plus the log text.

| path | 515 rev 7 | 516 | 516b | bound (515r7 + copies allowed) |
|---|---|---|---|---|
| judge (1 rounds copy) | 8,679,304 | 22,334,418 | 8,039,097 | 8,828,773 |
| one alternate (2 copies: Build + IF) | 6,559,879 | 17,335,725 | 6,241,689 | 6,709,348 |
| panel + 3 alternates | 28,358,941 | 74,341,593 | 26,764,164 | 28,956,817 (the alternate bound with its IF copy) |

- Known-good: 516b passes on both paths.
- Known-bad: 516 fails on both paths.
- 516b holds less than 515 rev 7, because the 515 per-link record is gone and the rounds are held once.
- 41155 estimate from the log: prompt text 5,806,792 under 516 -> about 2,318,000 under 516b (3,491,600 rounds characters out, 28 lines of about 92 characters in). Held copies: 124,700 characters per Build run, plus one per IF after an Alt or R2 Build.

## Token ratio (DONE 3 (ii))
Not measured. No tokenizer is installed here, and installing one was refused by this session's permissions. The threshold "rounds characters / 4, less 10%" stays a GUESS. From the first C4 run, prompt_tokens is in every judge enforcer prompt_sent marker. Rounds tokens can then be read as the difference between calls of one Build, which share the rounds and differ in items.

## Registry case
Not added. No ASK 417 registry table was found by name in the public schema. W3: please name it if one exists.

## Files (ask516/w4/b)
rec516b.js, md5.js, patch516b.js, lib516b.json, target_*_516b.json, revert_*_516b.json (= the live fetch), write516b.sh, revert516b.sh (its version guards are filled in after the write), replay516b.js, checks516b.js, in_d41117.json (41117 Build inputs), replay516b_41117.txt, measure516b_41117.json.
Write: bash write516b.sh, only on the operator's card. Revert: revert_*_516b.json through revert516b.sh.
