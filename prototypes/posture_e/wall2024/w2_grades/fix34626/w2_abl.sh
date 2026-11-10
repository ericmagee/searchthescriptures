# W2 ablation: build both packages minus one patch, then chain-replay to Replay Rows (label L8).
cd /home/claude/searchthescriptures/prototypes/posture_e/wall2024
O=/tmp/claude-0/-home-claude/6883c67b-298d-5583-a27c-a88baefc6cfe/scratchpad/abl
for A in K1 K2 K3 K4 K5 K6 E1 E2 E3; do
 SET=ALL ABL=$A node w2_grades/fix34626/w2_build_abl.cjs /mnt/project-files/wall2024/fetchback_live_s110.json $O/ALLn$A.json 2>&1 | grep -E "SIZE|BUILD|FAIL" | sed "s/^/$A build: /"
 node w2_grades/fix34626/w2_rev2b.cjs $O/ALLn$A.json 2>&1 | sed "s/^/$A: /"
 rm -rf pkgLIB/strip_ALLw2n$A pkgLIB_ALLw2n$A
done
