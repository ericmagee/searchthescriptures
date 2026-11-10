# pkgABH (W4): restore the pkgE4 head on the Alternate Build stub

## Fault (found by the dry regrade of 34108, execution 34299, Wall 3863)
Alternate Build stopped: "Cannot read properties of undefined (reading 'map')". Its source reads `const PP=$input.first().json` (Panel Payloads' output).
Since pkgE4, Get Early Alternate (an HTTP call to get_early_alternate) sits between Alternate Needed? and Alternate Build, so $input is the database reply.
pkgE4's stub head passed Alternate Needed? as $input and matched early replies all or nothing. That head was dropped at s80 (W4's write of XK rev 2):
prewrite_s80_XK.json (live s79) has it; prewrite_s81 (live s80) and every version since do not. Effect: since s80 any run where a seat needs an alternate stops at Alternate Build.
pkgSTB did not cause it: the rebuilt source is byte-equal in s91 and s94.

## Change (1 node: Alternate Build stub; no source line, no connection, no log row)
After the length-check line, the plain run line is replaced by the 7 lines of the s79 pkgE4 head (ab_s79_stub.js), with its __M renamed __EM (form 3 stubs use __M for the map entry).
The future pack tool e4_rebase.cjs keeps the live tail after the length check, so the head stays on later packs.

## Build
    node pkgABH/build_ABH.cjs /mnt/project-files/wall2024/fetchback_live_s97.json pkgABH/ab_s79_stub.js pkgABH/parent_s97_ABH.json
Refuses if the head is already there or the tail is not the plain run line.

## Proof: probe_ABH.txt, 7 OK, on the stored node outputs of execution 34299 (/mnt/project-files/wall2024/ex34299_full.json)
- live s97 stub fails as the execution did; the ABH stub runs (1 item: haiku for luna).
- ABH output equals the rebuilt source run with Alternate Needed? as $input (the stored early row is for chatgpt with another hash, so all or nothing gives today's output).
- planted matching early row: the call carries early_all and the early reply; one wrong hash, an empty RPC reply, or Get Early Alternate not run: today's output.

## Manual part
Alternate Build (pkgE4, restored by pkgABH): the stub runs the library source with Alternate Needed? as its input (Get Early Alternate sits between them), then uses the early alternate replies only when every alternate call has a matching early reply (same removed seat, same payload hash); otherwise the normal alternate call runs.
