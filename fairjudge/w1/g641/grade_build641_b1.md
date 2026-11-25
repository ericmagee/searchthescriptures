# GRADE: ASK 641 build b1 (ask641/w4/b1, commit 25051e40; target dbeff2f6 on ee4e389d)
PASS.
- Rebuilt with b641.cjs from W1's own fetch of live ee4e389d: node-equal and connections-equal to dbeff2f6.
- t641: 33 pass, 0 fail. Standing set: 31 PASS 0 FAIL.
- Changed or new: Panel Tokens, Shared Library, Salvage Tokens, Salvage Write Tokens?, Salvage Write Tokens. Wiring: Salvage Save -> Salvage Tokens -> If -> (true) Salvage Write Tokens -> Save Incomplete to Drive; (false) -> Save Incomplete to Drive.
- N1 met: both stubs' if(false) headers name the same 93 nodes as the body's literal $('...') set (W1 count).
- Salvage Tokens and Salvage Write Tokens have onError continueRegularOutput, so a fault there still reaches Save Incomplete to Drive. The HTTP node uses the Write Tokens credential.
- record_debate_row_tokens read: with null tokens the token UPDATE matches no row (p_input >= ... is null); p_calls is priced and stored separately.
- 42505 replay: 21 calls, 20 billed, C4 Call anthropic carries no usage (priced NULL); W4's figure $6.92 NOT CHECKED by W1.
NOTE: ASK 634 and ASK 641 both change Shared Library. The second to be written must be rebased on the first and rechecked.
STANDARD (ASK 599): met (one copy via the library, tagged).
