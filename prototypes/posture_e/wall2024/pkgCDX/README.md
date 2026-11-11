# pkgCDX (W1): unused code cut from Close Enforcer Record, on top of pkgCLG (s120)
Finding: W2 Wall 4625; second reading W1 Wall 4661. Write file /mnt/project-files/wall2024/parent_s120_CLG_CDX.json (sha256 6fe56717fbc6499d), built on parent_s120_CLG.json.
Cut (acorn, whole declarations): cecOracle 772 (never referenced), cecDeclared 526, cecDlinks 273, cecCblocks 259, cecLinks 121 (reached only through "B.links||cecLinks(F)", now "B.links||{}").
Size: Close Enforcer Record 11,176 to 9,211; code -1,965 measured vs pkgCLG (3,246,339 to 3,244,374), -1,900 vs live s120; prompt 0.
Tests (out/): every pkgCLG plant set (W4, W3, W4 R plants with pkgRCL rev 3/RCL2 Build) and the six stored runs: output equal to pkgCLG, 0 lines differ.
Limit (nolinks.cjs, out/nolinks.txt): a Close Enforcer Build item with no links (never produced: Build computes links on every non-skip item, and a skip item makes the Record return early) now fails the declared-link check: 34852 X2 becomes NOT CONFIRMED (form) "LINK 3 is not one of the defender's declared links (none read)" and nothing breaks; pkgCLG would rebuild the links and break D2. Visible, not silent, on a path no run reaches.
