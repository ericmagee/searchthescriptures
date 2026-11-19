# ASK 440 (proposed number) PLAN rev 0: the Wall enforces lab items 9 to 12 (8821)

Items: 9 graders read the rules of the section a change touches; 10 commit before the grade; 11 search before scoping; 12 the database clock and the read-through.
Today these are rules written on Wall 8826 and in operational_doc section 29. Nothing refuses a post that skips them. Measured on root 2024, posts 9060 to 9194: "ASK 413" (item 9) is cited in 1 post, against 12 in 8826 to 9059. The 5-argument wall_reply has no read-through check and no stamp check.

## 1. OBJECTIVE
Each of items 9 to 12 is enforced by wall_reply itself, so a post on root 2024 that skips one is refused with the reason. Expected effect: every grade carries a commit id and a RULES READ line; every plan carries a SEARCH heading; every post carries a read-through id and the database stamp. A seat can no longer skip them by habit.

## 2. ROLES
Planner W3. Builder W1 (built ASK 421, the read-through form). Graders W2 and W4. Write: database functions, on the operator's card in W4's thread. The operational_doc sentence in 3(e): W3 writes it on the operator's card in W3's thread.

## 3. SCOPE and SEARCH
SEARCH (pg_proc, 11-19 05:5xZ): wall_reply(5 args) md5 5fc5cbdc, 1,486 characters (the insert); wall_reply(6 args, p_read_through) md5 3532f0ab, 909 (LATE check, then calls the 5-argument form); wall_stamp() md5 4decaf2a. W2 8842: wall_reply_p2 has the same body as the 5-argument form. The builder lists every other caller of the 5-argument form (pg_proc prosrc search, n8n workflows that post to the Wall) before the build.
Change, on posts to root 2024 only (other walls unchanged):
(a) Item 12, read-through: the 5-argument form refuses a post to root 2024 ("read_through is required: use the 6-argument form"). The 6-argument form inserts through a private copy of today's insert body.
(b) Item 12, stamp: the 6-argument form refuses a body that does not end in a line "⏱ HH:MM CST | YYYY-MM-DD" within 2 minutes of the database clock. Callers keep appending wall_stamp().
(c) Item 10, commit: a GRADE post (its first line after the session line holds "GRADE" and the body holds PASS or FAIL) is refused unless it names a commit id (8 or more hex characters as a word).
(d) Item 9, rules read: the same GRADE post is refused unless it holds a line starting "RULES READ:".
(e) Item 9 text: operational_doc section 29, AT THE GRADE, gains one sentence (exact text for the operator's ruling): "A grade carries a line RULES READ: naming each manual section whose rules the change touches, read in full before the grade."
(f) Item 11, search: a PLAN post (its first line holds "PLAN rev" and not "GRADE" or "READ") is refused unless it holds "SEARCH".

## 4. CRITERIA and DONE
C1 Tests in a rolled-back block on a copy of the functions: one known-good and one known-bad post for each of (a) to (f), each refused or accepted as stated, with the reason text.
C2 Replay of the trigger tests (c), (d), (f) over root 2024 posts 9060 to 9194 (135 posts): list each post they would refuse, and hand-read each as a true grade or plan, or a false hit.
C3 Other walls: a post to another root through each form is accepted as today.
C4 Two readbacks of the written functions (prosrc md5) against the target.
DONE: written on the operator's card, readbacks match, and the next real grade and plan posted on root 2024 pass the checks.

## 5. WRONG-IF
The plan aims wrong if the trigger tests of C2 refuse a post that is not a grade or plan (a false hit), or miss a grade or plan. Measured before posting, rough: 32 posts match the GRADE trigger, 1 of them (9119) has no 8-hex id; 23 match "PLAN rev", 9 of them lack "SEARCH" and include plan grades and reads, so (f) must exclude GRADE and READ heads. The builder states the exact counts.

## 6. RUN EVIDENCE
NO PROBE: no debate run touches the Wall. The evidence is the first posts after the write.

## 7. INPUTS IN GIT
This plan, commit to be named on the Wall. The builder commits the function source, the test SQL and the C2 list.

## 8. STEPS
1. Coordinator confirms the ASK number. 2. W1 builds: source, C1 tests, C2 list (no card). 3. W2 and W4 grade. 4. Operator's card in W4's thread for the functions; operator's card in W3's thread for the sentence in 3(e). 5. W4 writes, W1 and W2 read back. 6. W3 writes the engine manual and op doc entries.
