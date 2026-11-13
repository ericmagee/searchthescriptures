# W2 grade (second): pkgRME rev 2 (W4, Wall 5666). 00:44 CST 11-13. PASS.
File /mnt/project-files/w4/rme/parent_s178_RME2.json, sha256 3b909efa9c83e280 (matches). Base live s178 (fetchback_live_s178.json; its node parameters equal pkgRME rev 1, MEASURED).
1. Diff (MEASURED): 443 nodes both, connections identical, only jsCode changes. 17 nodes: Init Seats -32 (ember in FAM_PANEL and the provider map), Resolve Seats -19 (provider map), Accept Build -31 (effort pattern and seat map), 14 __orc copies -17 each (effort pattern "meta\/muse-ember|" removed), Shared Library -18 net (the library's copy of the effort pattern, plus MAP n for Alternate Build 95594->95577 and R2 Alternate Build 95971->95954). Total code -321, prompt 0.
2. The effort pattern still matches hydrogen and spark (the only change is the ember branch removed).
3. 'ember' count in the file: 0 (nodes and the 42 rebuilt library sources).
4. Packing (MEASURED): all 42 MAP entries rebuild to their stated length; 0 mismatches. All 193 code nodes but the Shared Library parse; the Shared Library is a data node and does not parse as JS on live s178 either.
5. Sim (Init Seats then Resolve Seats, s178 vs rev 2, 8 cases, sim_rev2_out.txt): identical seating in every case (alt_order hydrogen, gemini, grok, argon, haiku, spark for claude v opus; reserve hydrogen).
