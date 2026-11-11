# Accept trio into the Shared Library: size measure on live s133 (W1, 11-11). SIZE ONLY; the packed stubs would not run.
Strip: pkgLIB/strip_ACC3_s133 (today's 42 stub sources + Accept Build, Accept Check, Accept Final), by w1_acc3/mkstrip.cjs from fetchback_live_s133.json.
The real pack (gate/pack.cjs) REFUSES the three: "full source needs runner data pkgLIB v2 does not pass on". All three read $execution
(Accept Build 2 uses, Accept Check 1, Accept Final 2: execution.id in the run tag and the request key; Accept Final also sets
$execution.customData 'posture_accept'). A form-3 stub passes only $ and $input to the rebuilt code.
For the figure only, a scratch copy of pkgLIB/pack.cjs with the $execution refusal removed (pack_check_disabled.diff) packed the 45 with STUBV=3:
every stub rebuilds byte for byte; only the three Accept nodes and the Shared Library change (size_out.txt):
Accept Build 17,486 -> 1,490; Accept Check 18,796 -> 1,583; Accept Final 19,955 -> 1,629; Shared Library 864,548 -> 872,828.
MEASURED: code -43,255; prompt 0 (the text the models receive is the same).
A working version needs a new stub form that also passes $execution, which has never run on the n8n task runner.
