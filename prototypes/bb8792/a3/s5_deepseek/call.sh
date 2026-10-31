#!/bin/bash
# usage: call.sh <unit__rule> <rep>  ; sends s5/in/<unit__rule>.txt to the relay, saves raw and reply
cd "$(dirname "$0")"
u=$1; r=$2
jq -Rs '{prompt: .}' < ../s5/in/$u.txt | curl -s --max-time 900 -X POST -H 'Content-Type: application/json' --data-binary @- https://truthapp.app.n8n.cloud/webhook/a3-ds-relay-bb8792-q7k2m9 > raw/${u}__r$r.json
python3 -I - raw/${u}__r$r.json out/${u}__r$r.json <<'P'
import json,sys,re
d=json.load(open(sys.argv[1])); c=(d.get('content') or '').strip()
c=re.sub(r'^```(?:json)?\s*|\s*```$','',c)
open(sys.argv[2],'w').write(c)
print(sys.argv[2], d.get('model'), d.get('finish'), (d.get('usage') or {}).get('total_tokens'))
P
