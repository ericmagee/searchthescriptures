# Joint of three on s115: pkgBRF rev 4 + pkgCCM + pkgCMS (comment strip last). W1, 17:4x CST 11-10.
Build (scratch a.json, b.json):
  node pkgBRF/build4.cjs /mnt/project-files/wall2024/fetchback_live_s115.json a.json
  node pkgCCM/build_CCM.cjs a.json b.json
  CMSX=_J3 node pkgCMS/build_CMS.cjs b.json pkgLIB/strip_S115L pkgCMS/joint_s115_BRF4_CCM_CMS.json
File: joint_s115_BRF4_CCM_CMS.json (also /mnt/project-files/wall2024/), sha256 fb4d025d2d3d39c9.
Size MEASURED vs s115: all Code 3,849,937 -> 3,243,982 = -605,955 (= +6,348 BRF4 - 327 CCM - 611,976 CMS); prompt 0 fixed; BRF4 book line only when the case occurs.
Checks: CMS M1-M5 OK (145 of 145 token-equal, 42 stubs rebuild). Against pkgCMS alone, exactly 14 nodes differ: the 12 C4P nodes +529 each (C4 Build +370 = +529 -159), C2 Build -9, C3 Build -159. connections equal.
pkgBRF test4 on the joint: 52 cases x 12 nodes, 0 disagreeing, 0 silent drops (test4_joint.cjs). pkgCCM W1 grade on the joint: K2 216/216, K3 36/36, K4 864/864, K5 108/108 (grade_CCM_joint.cjs).
