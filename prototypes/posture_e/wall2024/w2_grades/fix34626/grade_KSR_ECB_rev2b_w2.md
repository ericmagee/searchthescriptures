# W2 grade: pkgKSR + pkgECB rev 2b (W1, Wall 4233, commit b3b1305b), offline on s110, execution 34626. Labels d2aaad69 before any run.
Result: PASS (both together). Own chain runner w2_chain.cjs (Panel Cure Check to Replay Rows; stored model replies; send-back replies
renumbered by item, withheld lines removed, JSON replies walked). Script w2_rev2b.cjs, output w2_rev2b_out.txt: 7 OK, 0 FAIL.
- L1 size (measured): KSR +1,384 (Shared Library only); ECB +1,500 (Shared Library +1,464, three Send Back Build stubs +36); both +2,884.
  candidate file /mnt/project-files/wall2024/parent_s110_KSR_ECB_ALL_rev2.json is byte-equal to pkgKSR/parent_s110_ALL.json.
- L2 base chain equals the stored Replay Rows.
- L3 both: KEYSTONE D6 (the verdict's own line) BROKEN for luna, chatgpt, sol at Replay Rows; every written field but verdict_raw equal to the
  base, drv_uncured included (2, 0, 0). This uses my planted send-back replies, so luna's planted second reply is covered.
- L4 ECB alone: luna BROKEN, chatgpt and sol STANDS. KSR alone: all BROKEN but chatgpt and sol drv_uncured 0 -> 1. So KSR needs ECB.
- L5 luna's own E-ANS line with the engine's words: still sent (S1), as in s110. L6 no confirmed break: equal to s110 at Replay Rows.
- L7 break planted on D3: the same 6 D6 items sent as in s110; KEYSTONE D6 as in s110; drv_uncured falls (luna 6 -> 5, chatgpt and sol 2 -> 1)
  because the D3 break lines are now withheld.
- L8 bloat, by ablation (w2_abl.sh, w2_abl2.sh): each patch removed alone leaves L3 passing (E1 and E2 cannot be removed alone: they share
  declarations). K1 and K4 overlap: either alone gives BROKEN at the rows; both removed fails. K2, K3, K5, K6 removed together: rows equal but
  one new record-only E-GATE D38 item against chatgpt (in a live run a gate question on the engine's own KEYSTONE), so K6 is needed.
  Not exercised on 34626: K2 +67, K3 +65, K5 +66 (+198) and E3 +191 (companion withholding). Each guards a form 34626 does not contain;
  whether those forms occur is W1's to show, or the parts can be dropped under the bloat rule.
