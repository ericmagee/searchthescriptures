ASK 330 / 331 build (W4). Inputs for re-running the tests:
- live.json.gz: live s218 readback (versionId ffc2f775). gunzip to ../a330/live.json layout or edit paths.
- data30.json.gz: 26 stored runs (rounds + 78 judge texts) for the t330 kunxLines replay.
- sbrows.json.gz: 96 counted refused-cure rows (debate_enforcer_log, 20 days) for the t331 replay.
- tools_lib.cjs: ../tools/lib.cjs (needs acorn@8.11.3 in ../tools/node_modules).
Layout used by the scripts: a330/{live.json,data30.json,sbrows.json,verses_plant.json,af330.js,oa331.js,*.cjs}, tools/lib.cjs.
Build: node build330.cjs live.json target_330.json; node build331.cjs target_330.json target_331.json.
