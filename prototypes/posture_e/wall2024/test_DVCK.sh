#!/bin/bash
# Offline checks of merged_DVCK (D+VC+K on live 7599a747). Usage: bash test_DVCK.sh <live_7599 fetch json>. Writes nothing live.
set -u; L=$(readlink -f "$1"); H=$(cd "$(dirname "$0")" && pwd); T=$(mktemp -d); cd "$H"
echo "== manifest: live_sha = fetch, final_sha = file, all parse"; node verify_DVCK_manifest.cjs "$L" | tail -1
python3 - "$L" "$T/overlay.json" <<'PY'
import json,sys;L=json.load(open(sys.argv[1]));M=json.load(open('merged_DVC/manifest.json'));names={x['name'] for x in M['nodes']}
for n in L['workflow']['nodes']:
    if n['name'] in names: n['parameters']['jsCode']=open('merged_DVC/'+n['name'].replace(' ','_')+'.js').read()
json.dump(L,open(sys.argv[2],'w'))
PY
echo "== test_K on the D+VC overlay"; node pkgK/test_K.cjs "$T/overlay.json" | tail -1
echo "== pkgK/patched equals merged_DVCK"; for f in pkgK/patched/*.js; do cmp -s "$f" "merged_DVCK/$(basename $f)" || echo "DIFF $f"; done; echo done
cp -r pkgVC "$T/vc"; for f in "$T"/vc/patched/*.js; do cp "merged_DVCK/$(basename $f)" "$f"; done
echo "== test_VC on merged texts"; (cd "$T/vc" && node test_VC.cjs "$L" | tail -1)
mkdir -p "$T/p2/pkgVC/patched"; cp pkgVC/test_P2b.cjs pkgVC/fixture_32949_chatgpt.json "$T/p2/pkgVC/"; cp merged_DVCK/Panel_Cure_Check.js "$T/p2/pkgVC/patched/"
echo "== test_P2b on merged Panel Cure Check"; (cd "$T/p2" && node pkgVC/test_P2b.cjs | tail -1)
mkdir -p "$T/d"; cp -r pkgD pkgA fixtures "$T/d/"; for f in "$T"/d/pkgD/patched/*.js; do cp "merged_DVCK/$(basename $f)" "$f"; done; cp test_D_on_DVCK.cjs "$T/d/pkgD/test_D.cjs"
echo "== test_D (12 headings) on merged texts; expect only X4 to fail"; (cd "$T/d" && node pkgD/test_D.cjs "$L" | grep -v '^OK'; echo "OK count: $(node pkgD/test_D.cjs "$L" | grep -c '^OK')")
rm -rf "$T"
