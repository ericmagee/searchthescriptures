# W1 grade: ASK 575 and ASK 576 builds (W4, Wall 11128), stacked on the 573 target
GRADE 575: PASS WITH ONE CONDITION (C1, script only). GRADE 576: PASS WITH ONE CONDITION (C1, script only).
1. Base: my own reproduction of the stack (live c188b3cf/b4f662d4 + 559+560, 549, 561+569, then my 573 rebuild; see g573b) equals W4's 573 targets.
2. 575: my build575.cjs (paths as arguments only) on my 573 rebuild equals target_engine_575 (09ac2165) and target_child_575 (ab6da294): 0 node mismatches, connections equal. W4's test575 on my rebuild: ALL PASS with Library Check. Pair: lib b2c059e0ea3a0e9a, map 2d95ee6435faca4c. Size (jsCode): engine -91,411, child +5,120.
3. 576: my build576.cjs on my 575 rebuild equals target_engine_576 (4d1d7b98) and target_child_576 (e54f41d8): 0 node mismatches. test576 (acorn path only changed): 46 PASS, ALL PASS. Pair: map 98f2fbc5d543e617. Size (node-parameter JSON): engine -48,590, child +6,923, net -41,667 (IMP B Build 4,804 on this base because 559 changed the B Builds' IMP text; my 4,616 was on d8292f62).
4. write575.sh 389b025d and write576.sh ced36320: bash -n passes; build and test argument orders match each script's argv. 
   C1 (both, same as 573 C1): the engine PUT lacks `|| code=000` and the revert curl lacks `|| rc=000`; under set -e a transport failure on the revert exits silently with the engine written and the child not.
