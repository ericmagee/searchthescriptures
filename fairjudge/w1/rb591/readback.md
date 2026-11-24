# W1 READBACK: ASK 591 live write (Wall 11543, audit 41446), 09:01 CST 11-24
Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
RESULT: ENGINE MATCH. DATABASE MATCH with F3. DASHBOARD FILES MATCH, BUT THE PRODUCTION DOMAIN DOES NOT SERVE THEM (F4).

## Engine
- My fetch of moMxiV4Irg1uRBZN v347f3e21-0484-41b7-bc60-9ed5142ec58f (createdAt 14:53:38.108Z; workflow updatedAt 14:53:38.073Z): 423 nodes.
- cmp: target_engine_591 vs live 0 diffs; W4 fetch-back vs live 0 diffs; prior live 489b977b vs live: only Init Seats, Build Save Body, Accept Build, new Judge Order Read, connections.
- t591 (base 489b977b, target = my live fetch): ALL PASS 8. Standing 29/29. Pair with live child: PASS, LIB b243080d9bd0b10c.
- Child MqQHRl7mQQ0z8QdT updatedAt 14:12:39Z = e086bb3a (J2 write); fetch-back child e086bb3a. Untouched.

## Database (mig591 adbadc73)
- prosrc md5/length equal to the migration text for all six: lists 299699e1/275, fault 1cd08d94/1273, read 056a8bae/532, save 66785a1f/1356, dash_judge_order c83f6c1b/548, dash_judge_lineup 1ba7807e/5418. All SECURITY DEFINER.
- odv1_judge_order = seed (chatgpt, sol, sol62 | gemini, spark, qwen4max, argon, sonnet). Log row 1 only, seed, before NULL. odv1_judge_order_read() gives version 1 and the seed.
- dash_api: the three new WHEN lines present; the unknown-action anchor occurs once. RLS on both tables.
- F3: EXECUTE on lists, fault and save is also held by lab_seat and service_role (likely Supabase default privileges); the build notes and Wall 11543 name only read for those roles. Save can therefore be called directly, outside dash_api. Revoke, or state it.

## Dashboard
- Deployment dpl_GfY2EAHyqufMAeza4eBTW6z6jGhm: READY, target production. All 8 file uids (sha1) equal W4's dash/ files (judge591.js 3aace11b, odv1.js b0fe9a5b, patch.js 95fc4418) and dash_live/ for the 5 unchanged.
- F4: alias truth-app-dashboard.vercel.app (the project's only domain) still points to dpl_F4JdWAFWSHCAodqrBa4MtnkpwDA9, the old deployment; read at 09:0x CST, about 20 minutes after GfY2 was ready. The new tab and the haiku removal are not on the page users open. Assign the alias to GfY2 (or redeploy) and read back.
