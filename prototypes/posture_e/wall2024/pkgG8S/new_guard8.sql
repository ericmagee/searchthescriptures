-- pkgG8S (W1, ASK 212): serve Sight 266 to the Oracle on guard 8 topics. Operator approved 2026-11-13 02:59 CST (W3 thread, his item 2).
-- Run in ONE transaction with new_debate_arsenal_guarded.sql and new_debate_sight_links.sql (LIMIT 11 to 12); without them Sight 266 falls past the limit and is not served.
UPDATE guard_served_sets
   SET sight_numbers = ARRAY[1578,1822,519,10,8,9,32,23,25,50,55,266],
       ruled_ref = ruled_ref || '; Sight 266 added at place 12 and limit raised to 12 on the operator''s approval 2026-11-13 02:59 CST (ASK 212, pkgG8S, W1_2026_11_04, WALL-2024)',
       updated_at = now()
 WHERE guard_num = 8 AND sight_numbers = ARRAY[1578,1822,519,10,8,9,32,23,25,50,55];
-- expect: UPDATE 1
