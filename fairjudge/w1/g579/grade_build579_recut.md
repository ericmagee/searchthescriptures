GRADE ASK 579 build re-cut (ask579/w4/b2/notes579.md 21150744; targets engine 115b1db5, child fe01ca77; write579.sh e9d23edc; git b28a7074; Wall 11759 part 2): PASS WITH N1. COMMIT: this file.
RULES READ: 579 plan rev 2 (922b1a04) C1 to C9 and steps; my plan grade 4d199c73 (N1: the shared-line cost on the card); my C6 baseline check aef5cd2f; ASK 599; ASK 612; ASK 616; build rule (fresh base, touched nodes only, no model settings); NEVER TOUCH REASONING (no prompt, check or setting changes).
OBJECTIVE MET: yes, as a build. Nine served texts rebuilt byte for byte from the library; outputs equal on run 42071's inputs.
STANDARD (ASK 599): PASS. No dead code; each loader is used; the nine texts are served whole, none merged.

Re-run by me in my own container:
- Base = live: base_eng_579 and base_child_579 equal my own live fetch node for node (engine 20db58ee, child 74353c40); n8n updatedAt unchanged since (22:03:08Z, 22:01:29Z).
- t579.js (be789169, W3's, unchanged) on the base: output byte-equal to out_t579.txt, ALL PASS (99 checks, with the 18 loader controls and the engine-only append control). fixhdr579.js: header sha a3c1e42f5b0ebda6, 3,852 lines, engine Library Check runs. Targets byte-equal to W4's: 115b1db5, fe01ca77.
- Target against base: engine changes exactly the nine Extract nodes and the Shared Library; child only the Shared Library; connections equal; 423 nodes. Nine nodes 226,060 to 41,693; Shared Library +70,069 in each. Matches the plan.
- C6: c6_579.cjs on the target with rundata_42071 (35c0b165): byte-equal to out_c6_579_target.txt, 9 of 9 equal. The swap control of my baseline check shows the harness catches a wrong input.
- Standing set on the targets: 31 PASS 0 FAIL. Pair: Library Check PASSES (a3c1e42f5b0ebda6, map ed7212a3189a4565).
- write579.sh read: refuses on a live run, a rebuild not byte-equal to these targets, C6 not 9 of 9, any of the ten engine nodes or the child library not equal to the base, a failed standing set or pair check; replaces only those nodes on the live JSON; reads back with standing, pair and C6 on the fetch-back. Fails closed.
- notes579.md carries my plan N1 (37 lines, 4,623 characters, 54 entries).

N1: plan rev 2 step 3 places this build "after the run that proves ASK 611". No run has happened since 13:48 CST. The write card must say the build was cut before that run, so the operator decides whether the write waits for it. Also on the card: the try-node re-call path is NOT SHOWN by C6, C1 (byte-equal rebuilt text) stands in its place, and the two net figures 44,229 / 114,298 with the shared-line cost.
