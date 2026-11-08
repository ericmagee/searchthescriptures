# pkgMER: the main K-W DeepSeek enforcer call is split and resent when it fails (W2, 11-08; W3 grade_33705)

DeepSeek enforcer change (the main "Enforcer Call deepseek", ruling 421 checks). Base: live s62 (0774fea5).

## Fault (33705)
- Enforcer Build made one call with 61 answer ids (60 K-W and 1 K-S3), across 21 items and 82K characters.
- DeepSeek returned finish_reason "length" with 0 characters of content: 64,000 completion tokens, all of them reasoning.
- Enforcer Record's env() reads an empty string as a good reply. The main call has no split or retry path. pkgESR, ESS and ERF cover only the Judge Enforcer and Alt calls.
- So all 61 rows went "ENFORCER NO VERDICT" with no reply_error, and EKN and EKL v2 went untested.

## Change
- New Enforcer Retry Build (code; retry_build.js, sha 4f918ed218df). The call fails when it has:
  - no reply;
  - an error;
  - no choices;
  - finish_reason "length";
  - empty content;
  - or 2 or more answer ids with no ENFORCER line. A G<k> or bare <k> line covers item k, as the Record reads it.
- A failed call is cut into parts of whole ITEMs. A part closes at 7 items, or once its share of the text is reached, with at least 2 parts.
  - Each part keeps the system message, the rules head and max_tokens unchanged.
  - Each part's item texts are byte-equal to the original, in order.
- If the call has not failed, Enforcer Retry Build emits one marker item ({esr_retry:false}).
- New Enforcer Retry Needed? (IF on esr_retry, a copy of Judge Enforcer Retry Needed?).
- New Enforcer Retry Call deepseek, a copy of Judge Enforcer Retry Call deepseek: the same URL, credential, 900 s timeout, retryOnFail 3, and batching 1 with interval 0, so the parts run at the same time.
- Enforcer Record dc7d800144a3 -> b98b57db98f8.
  - When the Retry Call ran, the parts' replies take the call's place.
  - An empty part reply counts as a failure (pkgMER __mEnv).
  - A part that fails again leaves its ids NO VERDICT, with "pkgMER retry part k of n: <why>" as their reply_error.
  - enf421.mer = {retried, parts, failed_parts}. It is present only when a retry ran.
- Connections:
  - Removed: Enforcer Call deepseek -> Enforcer Record.
  - Added:
    - Enforcer Call deepseek -> Enforcer Retry Build
    - Enforcer Retry Build -> Enforcer Retry Needed?
    - Enforcer Retry Needed? true -> Enforcer Retry Call deepseek
    - Enforcer Retry Needed? false -> Enforcer Record
    - Enforcer Retry Call deepseek -> Enforcer Record
  - Enforcer Needed? false -> Enforcer Record is unchanged.

## Why parts of items, not one call per seat
The reasoning that hit the cap is per item. For each item, DeepSeek decides what fact the side's sentence carried and whether the side still claims it (NEEDS). Only then does it grade the judges. The 33705 reasoning_content shows this.
- A per-seat call would carry all 21 items and redo that decision 21 times in each of 3 calls.
- A part of 7 items does it 7 times.
Splitting by items shrinks what overran. Splitting by seat does not. This is my reading of the saved reasoning, not a measured comparison.

## Test (test_MER.cjs: 61 OK, 0 FAIL, test_MER.txt)
- Retry Build on the 28 saved runs that have both Enforcer Build and Enforcer Call saved:
  - Retry fires in 2 runs:
    - 33705 (length, empty): 3 parts of 7 items (21/21/19 ids).
    - 33482 ("aborted" error, an older ITEM G<k> format): 5 parts.
  - In both, every id appears once, and the head and the item texts are unchanged.
  - Every other run gives the marker only.
- Record, no-retry path: the output is byte-equal to live s62's Record in all 28 runs.
- Record, retry path, on 33705 with synthetic part replies (offline makes no call):
  - All parts answer: NO VERDICT 61 -> 0, and every other row field equals live.
  - Part 2 comes back empty on "length" again: its 21 ids stay NO VERDICT with the part error, and the other 40 are read.
  - All parts fail: all NO VERDICT, and the error is kept on every row.
- v1.1 (W1 3233): a failed call whose ids cannot all be placed in whole items is not retried, as before. The marker now names it (esr_unsplit), and Enforcer Record writes enf421.mer {retried:false, why}. Tested by removing one id's item.

## Live bar (first run whose main enforcer call fails)
- Enforcer Retry Needed? goes true.
- The parts return verdicts, and the K-W rows are graded (EKN NOT HELD, EKL layers).
- mer.failed_parts is empty.
- Whether 7 items fit under the 64K cap is shown only by a live call. In 33617-33682 the whole call (56-77 ids) took 19.7K-47.9K reasoning tokens.

## Revert
Delete the 3 new nodes, restore the Call -> Record edge, and restore Enforcer Record from the prewrite copy.

Rebuild: node pkgMER/build_MER.cjs [fetchback, default s62] -> pkgMER/out/ (nodes_new.json, Enforcer_Record.js, plan_MER.json).
