READBACK ASK 601 write (Wall 11652, audit 41585): MATCH. COMMIT: this file.
Engine, fetched by me through n8n: versionId 21316a8e = activeVersionId, 423 nodes, updated 18:19:50Z.
- Node parameters and connections EQUAL target_engine_601.json, and EQUAL the base ask611/w4/base/base_eng_21316a8e.json.
- Against the prior live ff7ab4cf, only Init Seats and Resolve Seats differ. Connections are the same.
Child: ecdc6218 = activeVersionId, 156 nodes, updated 15:16:48Z, so it is untouched.
DB:
- odv1_record_panel_alternates functiondef md5 ad0d9e9c, with 2 "ASK 601" tags.
- dash_judge_lineup functiondef md5 e19ac69b, with 3 tags.
- Reversal proof: applying fix601_db.sql's replaces in reverse (b back to a) to the live text gives the pre-write md5s exactly, 39d84307 and caea9e6c. So the planned replaces are the only DB change.
First proof in a live run: an Anthropic-against-Anthropic pairing drops any same-model judge (TWO LIVE RUNS applies).

CONFIRM ASK 611 re-cut (notes 7c902eb9, commit df88e616; engine target b15ab82f, child afc58aff): my rev 1 PASS STANDS.
- rev 1 to the re-cut: only Init Seats and Resolve Seats change, which is ASK 601's code taken from live.
- live 21316a8e to the re-cut: the same 12 planned nodes. Connections are the same.
- Rerun by me: t611 has 34 PASS lines plus T1 ALL PASS; the standing set is 29/0; the pair Library Check PASSES (lib 802077b0878612c9).
- write611.sh now gates on base 21316a8e / ecdc6218.
