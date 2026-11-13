-- pkgG8S revert: guard 8 back to its live s179 row (sight_numbers and ruled_ref exactly as read 2026-11-13).
UPDATE guard_served_sets
   SET sight_numbers = ARRAY[1578,1822,519,10,8,9,32,23,25,50,55],
       ruled_ref = $r$WALL-1740 replies 1749 and 1751; operator approved in Advisor_Code_D's thread 2026-10-16 (reply 1752); Sight 1822 added and limit raised to 11 on the operator's word, md_notes_rulings 430; Sight 1822 moved to second place so it cannot fall past the limit of 11, on the operator's approval 2026-11-06 00:25 CST (W3_2026_11_04, WALL-2024)$r$,
       updated_at = now()
 WHERE guard_num = 8;
-- run with revert_debate_arsenal_guarded.sql and revert_debate_sight_links.sql (LIMIT 11), one transaction.
