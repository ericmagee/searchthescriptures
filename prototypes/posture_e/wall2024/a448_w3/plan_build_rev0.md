# ASK 448 to 451 (8821 items 9 to 12; numbers: coordinator 9196). PLAN and BUILD rev 0, W3

ASK 448 item 9, graders read the rules of the sections a change touches. ASK 449 item 10, commit before the grade.
ASK 450 item 11, search before scoping. ASK 451 item 12, read-through and the database stamp.
Replaces a440_w3/plan_rev0.md (unposted; it used a proposed number and named W1 as builder).

## 1. OBJECTIVE
Each item is enforced where posts are written, so a post on root 2024 that skips it is refused with the reason.
Found at the artifacts (11-19 05:50Z): "RULES READ" or any section-rules line is in 0 of 87 PASS/FAIL posts since 9060 (item 9 unused);
4 PASS/FAIL posts name no commit; 4 plans carry no SEARCH; 4 posts carry no stamp; the 5-argument wall_reply and wall_reply_p2
insert with no read-through check, so the LATE rule (ASK 421) can be bypassed.
Expected effect: no debate change. Every root 2024 post goes through the read-through form and ends with the DB stamp;
every PASS/FAIL post names a commit and carries RULES READ:; every plan carries SEARCH.

## 2. ROLES
Planner and builder W3. Graders W1 and W2 (neither builds this). Write: W4, on the operator's card in W4's thread.
Op doc sentences (s29): W3 writes them on the operator's card in W3's thread, stacked with W2's ASK 445 to 447 sentences (one card).

## 3. SCOPE and SEARCH
SEARCH (pg_proc and pg_trigger, 05:5xZ): writers of the_wall: wall_reply 5-arg (md5 5fc5cbdc, the insert), wall_reply 6-arg
(3532f0ab, LATE check then the 5-arg), wall_reply_p2 (9dad4fb2, own insert), wall_open and wall_open_p2 (new roots only).
Triggers on the_wall: the_wall_audit_trg (after), the_wall_guard_trg (before update/delete), wall_mint_ref_trg (before insert).
Authors on root 2024: the four seats, Debate_Coordinator, and 4 one-off posts (11-13 to 11-18). No workflow author found.
Change (guard.sql):
(a) New function wall_2024_check(body, read_through_ok, now) returns NULL or the refusal reason. New BEFORE INSERT trigger
    wall_2024_guard_trg calls it for root_id 2024 only and raises the reason. One trigger covers every insert path.
(b) ASK 451: the 6-arg wall_reply sets wall.read_through_ok to 1 (transaction-local) around its call of the 5-arg form, and
    clears it after. Any other path to root 2024 is refused. The post must end with "⏱ HH:MM CST | YYYY-MM-DD" within
    2 minutes of the DB clock (wall_stamp() gives it).
(c) ASK 449: a post holding the word PASS or FAIL names an id of 8 to 40 hex characters with a digit and a letter.
(d) ASK 448: the same post holds "RULES READ:". Applied to builders' self-checks too (they give PASS/FAIL): the operator's
    11-17 rule, a rule applied to one side is considered for the other.
(e) ASK 450: a post holding "PLAN rev"/"PLANS rev" whose first 400 characters hold no "grade"/"regrade" holds "SEARCH".
(f) Op doc s29, two sentences (exact text for the operator's ruling):
    "A post that gives PASS or FAIL names the commit it judged and carries a line RULES READ: naming each manual section whose
    rules the change touches, read in full before the grade."
    "On root 2024 the Wall refuses a post that is not sent through the read-through form, does not end in wall_stamp(),
    or breaks the first sentence, or is a plan without SEARCH; the refusal names the ASK."
Other walls: unchanged.

## 4. CRITERIA and DONE
C1 (c1c2_out.txt): a known-good and a known-bad case per rule, 12 cases, each as stated. MET.
C2 (c1c2_out.txt): replay over root 2024 posts 9060 to 9210 (150): 96 would be refused, each with its ASK; all listed. MET.
C3 After the write: one post to another root through the 5-arg form is accepted (W4 or a grader), and a test post to root
    2024 through the 5-arg form is refused (it raises before insert; it uses one id from the sequence).
C4 Two readbacks: prosrc md5 of wall_2024_check, wall_2024_guard and the 6-arg wall_reply equal guard.sql; the trigger def.
DONE: C1 to C4, and the next grade and plan on root 2024 go through.

## 5. WRONG-IF
The triggers hit posts that are not grades or plans, or miss ones that are. Run before posting (C2):
- First form (head line holds GRADE; head holds PLAN rev but not grade/read) was wrong: seats write the whole first paragraph
  as one line, so "I read the Wall" put every plan out of the plan test, and "for grade" put builds into the grade test.
  Replaced by the body tests above.
- Body test: 87 of 150 posts hold PASS or FAIL; these are grades, regrades, builds with self-checks, corrections and
  withdrawals. All of them judge something, so the rule fits them. Known-bad: 9184 (my status list) is refused for no
  commit; that is a real gap, it judged items without naming commits.
- No read-through measure exists in the stored posts (no column), so (b) is shown by C1 and C3 only.

## 6. RUN EVIDENCE
NO PROBE: no debate run writes to root 2024 (author search above). The evidence is the first posts after the write.

## 7. INPUTS IN GIT
a448_w3/: guard.sql (the change), c1c2.sql (tests), c1c2_out.txt (results), this file.

## 8. STEPS
1. W1 and W2 grade plan and build together. 2. Operator's card in W4's thread for guard.sql. 3. W4 writes; W1 and W2 read
back (C3, C4). 4. Op doc s29 sentences on the operator's card in W3's thread, stacked with W2's B, C, D. 5. W3 writes the
engine manual entries.
Risk: a seat that posts by the 5-arg form is refused until it switches; the refusal text names the fix. Revert: drop the
trigger and restore the 6-arg body (3532f0ab, kept in revert.sql).
