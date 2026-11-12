# Joint parent: live s151 + pkgMSO (W1) + pkgRPS (W1) + pkgUOR (W2) + pkgCNP rev 3 (W2), each package's own build script in that order.
set -e; L=/mnt/project-files/wall2024/fetchback_live_s151.json; S=${1:?scratch dir}; J=/mnt/project-files/wall2024/parent_s151_JOINT_MSO_RPS_UOR_CNP.json; D=$(dirname "$0")/..
node $D/pkgMSO/build.cjs $L $S/a.json; node $D/pkgRPS/build.cjs $S/a.json $S/b.json; node $D/pkgUOR/build_UOR.cjs $S/b.json $S/c.json; node $D/pkgCNP/build_CNP.cjs $S/c.json $J
