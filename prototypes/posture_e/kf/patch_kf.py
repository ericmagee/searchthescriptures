#!/usr/bin/env python3
"""FORCED-line reader: accept doubled round brackets, a bracketed layer note after a quotation, and a reason after FAILS. Reads the committed live copy (m8/fetchback_m8.json, e2c2cabb)."""
import json, os
ROOT=os.path.dirname(os.path.abspath(__file__))
BASE=json.load(open(os.path.join(ROOT,'..','m8','fetchback_m8.json')))
OLD=r'''const KF_LINE=/^\s*(?:[-•]|\d+[.)])?\s*FORCED\s*:\s*(D\d+\s+vs\.?\s+C\d+)\s*(?:--|—|–)\s*MEANS\s*\[?\s*((?:CR|DR)[1-4])\s*\]?\s*:?\s*["“](.+?)["”]\s*(?:--|—|–)\s*ANSWER\s*\[?\s*((?:CR|DR)[1-4])\s*\]?\s*:?\s*["“](.+?)["”]\s*(?:--|—|–)\s*FAILS\s*:?\s*["“](.+?)["”]\s*\.?\s*$/i;'''
NEW=r'''const KF_LINE=/^\s*(?:[-•]|\d+[.)])?\s*FORCED\s*:\s*(D\d+\s+vs\.?\s+C\d+)\s*(?:--|—|–)\s*MEANS\s*\[{0,2}\s*((?:CR|DR)[1-4])\s*\]{0,2}\s*:?\s*["“](.+?)["”](?:\s*\([^\n]*?\))?\s*(?:--|—|–)\s*ANSWER\s*\[{0,2}\s*((?:CR|DR)[1-4])\s*\]{0,2}\s*:?\s*["“](.+?)["”](?:\s*\([^\n]*?\))?\s*(?:--|—|–)\s*FAILS\s*:?\s*["“](.+?)["”](?:\s*(?:--|—|–|\(|;|,|:)[^\n]*)?\s*\.?\s*$/i; /* judge_fix10 K-F reader: [[CR3]], a (layers) note after a quotation, and a reason after FAILS are read (ruling 411) */'''
n=0
for nd in BASE['nodes']:
    c=(nd.get('parameters') or {}).get('jsCode')
    if not c or OLD not in c: continue
    assert c.count(OLD)==1, nd['name']
    open(os.path.join(ROOT,'base',nd['name']+'.js'),'w').write(c)
    open(os.path.join(ROOT,'new',nd['name']+'.js'),'w').write(c.replace(OLD,NEW))
    n+=1
print('nodes patched',n)
