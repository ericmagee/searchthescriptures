# truth-app-dashboard: old deployments and cleanup options (W3, 11-19 16:1xZ, rev 2, read only; rev 0 put the live dashboard on the delete list)

Source: Vercel list_deployments for project truth-app-dashboard (prj_z6ZhLZIeI9DiDzRALD5Z9Wye3VIo), team TruthAPP; Vercel docs /docs/deployment-retention (fetched 11-19). Nothing was changed.

## 1. What exists (MEASURED)
- READY (these hold build output, which is what Deployment Storage bills): 42 in total.
  - Preview (branch claude/untitled-9jle0o): 20, created 2026-11-15 17:52Z to 2026-11-16 20:32Z.
  - Preview with no git metadata: 1, 2026-10-27 14:28Z (dpl_5n4sLu6gKhDk6DEfEgBAiE8Q9kNj). THIS IS THE LIVE DASHBOARD: the production domain truth-app-dashboard.vercel.app is aliased to it (list_aliases), and it is a CLI upload (src/index.html, odv1.js, patch-base.js, patch.js, queue.js, retire.js). It must never be deleted.
  - Production: 21, 2026-09-03 17:09Z to 2026-11-13 03:26Z: 4 from git main (newest two are the pkgDFL commit and its revert, 11-13 03:20Z and 03:26Z) and 17 CLI uploads (correction from W1 9614; rev 1 said all 21 were from main).
- ERROR, BUILDING, QUEUED: 0.
- CANCELED (no build output; no storage): at least 700, all previews of claude/untitled-9jle0o. Counted by page: 11-19 about 338, 11-18 68, 11-16 3, 11-15 99, 11-14 22, 11-13 34, 11-12 40, 11-11 101, 11-10 75 (from 7 pages of 100; days overlap pages). Pages older than 11-10 were NOT READ, so the total is a floor.
- The newest deployment (11-19 15:3xZ, commit A f8a9d6d5) is CANCELED, as are all since 11-16 20:32Z.

## 2. What Vercel always keeps, whatever the policy (docs, quoted)
- Pro and Enterprise: the last 10 deployments created; the last 20 production deployments in state Ready; the last 20 non-production deployments in state Ready. Hobby: last 3 created, last 3 production Ready, no non-production exception.
- Every plan: a deployment with a production alias; the latest Ready deployment of a branch with a domain; a non-production deployment with a custom alias; the latest preview of a branch with an open pull request.
- The plan of team TruthAPP was NOT READ (get_team does not return it).

## 3. Options
A. Retention policy (project Settings, Build and Deployment, Deployment Retention Policy), e.g. preview 7 days, canceled 1 day, errored 1 day; production unchanged.
   - On Pro it frees almost nothing: of 21 Ready previews the last 20 are kept by the exception, so only the oldest goes, and the oldest is the 10-27 live dashboard, which its production alias protects, so in practice none goes; of 21 Ready production, only the 09-03 one goes. Saving: the storage of about 1 deployment (the 09-03 production one).
   - On Hobby the 21 Ready previews go once they pass the set age (7 days: the 20 of 11-15/16 on 11-22/23).
   - Canceled rows go too, but they hold no storage; that is tidiness only.
   - Undo: a deleted deployment can be restored in Settings, Security, Recently Deleted Deployments, for up to 30 days (shorter if deleted younger than 30 days).
B. Delete list (exceptions do not apply to a manual delete, so the list must leave out the live dashboard by hand): the 20 Ready previews of 11-15/16 only. NOT the 10-27 preview (the live dashboard). Keeps every production deployment, so the live dashboard and rollback are untouched. Saving: all preview build output.
C. Both: B now, A to keep previews from piling up if builds are ever let through again.

Savings in money: NOT MEASURED. No tool here reads deployment size or the Deployment Storage meter; the operator's Vercel Usage page shows it.

## 4. Recommendation
B, on the operator's card (a delete is outward-facing; restorable for a limited period only). A alone does little on Pro.
