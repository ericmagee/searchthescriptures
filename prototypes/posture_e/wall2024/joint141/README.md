Joint parent of pkgPCS (W1), pkgECS (W2) and pkgRRT (W2) on live s141 (ff40f39f). Order: PCS, then ECS, then RRT, each by its own graded build script:
node pkgPCS/build.cjs fetchback_live_s141.json j1.json; node pkgECS/build.cjs j1.json j2.json; node pkgRRT/build.cjs j2.json parent_s141_JOINT_PCS_ECS_RRT.json
check.cjs: every node's code (rebuilt source for stubs) in the joint equals the single-package parent that changed it, else live; map lengths; size.
