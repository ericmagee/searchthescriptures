#!/usr/bin/env python3
"""ASK 463: after a verified n8n write, record one audit_log row through rpc log_audit_event (SECURITY DEFINER, anon EXECUTE).
Called by tools/restw.py and tools/libw.py only after their readback passed. The row lists every removed, added and changed node
and every changed connection key, from the prewrite against the fetchback, with the card that authorized the write.
Key (ASK 466 step 2): env SUPABASE_SERVICE_KEY, required; the public key no longer executes log_audit_event. Never written to repo or memory. On failure it prints the SQL to run by hand
and exits 3 (fatal=True), or returns None so a caller can finish its other writes and exit 3 at the end; a missing row is never silent."""
import json,os,sys,urllib.request
URL='https://bhffmkginddovmdcpnty.supabase.co/rest/v1/rpc/log_audit_event'
KEY=os.environ.get('SUPABASE_SERVICE_KEY','')
js=lambda x:json.dumps(x,sort_keys=True)

def diff(pre,back):
  A={n['name']:n for n in pre['nodes']};B={n['name']:n for n in back['nodes']}
  rm=sorted(set(A)-set(B));add=sorted(set(B)-set(A))
  ch=sorted(k for k in set(A)&set(B) if js({x:v for x,v in A[k].items() if x not in('position',)})!=js({x:v for x,v in B[k].items() if x not in('position',)}))
  ca,cb=pre.get('connections',{}),back.get('connections',{})
  cc=sorted(k for k in set(ca)|set(cb) if js(ca.get(k))!=js(cb.get(k)))
  return rm,add,ch,cc

def notes(seat,card,pre,back,extra=''):
  rm,add,ch,cc=diff(pre,back)
  return ('%s: n8n write on the operator card "%s". Workflow %s (%s) version %s to %s, %d to %d nodes, published %s. Removed: %s. Added: %s. Changed: %s. Connections changed from: %s.%s'
    %(seat,card,back.get('name'),back.get('id'),pre.get('versionId'),back.get('versionId'),len(pre['nodes']),len(back['nodes']),
      back.get('activeVersionId')==back.get('versionId'),', '.join(rm) or 'none',', '.join(add) or 'none',', '.join(ch) or 'none',', '.join(cc) or 'none',
      (' '+extra) if extra else ''))

def post(title,text,fatal=True):
  if not KEY:
    q=text.replace("'","''");print('AUDIT ROW NOT WRITTEN (no SUPABASE_SERVICE_KEY). Run by hand:\nselect log_audit_event(\'%s\', \'%s\', \'n8n\');'%(title,q))
    if fatal:sys.exit(3)
    return None
  body=json.dumps({'session_title':title,'notes':text,'engine':'n8n'}).encode()
  r=urllib.request.Request(URL,data=body,method='POST',headers={'apikey':KEY,'Authorization':'Bearer '+KEY,'Content-Type':'application/json'})
  try:
    rid=json.load(urllib.request.urlopen(r,timeout=60));print('AUDIT ROW',rid);return rid
  except Exception as e:
    q=text.replace("'","''");print('AUDIT ROW NOT WRITTEN (%s). Run by hand:\nselect log_audit_event(\'%s\', \'%s\', \'n8n\');'%(e,title,q))
    if fatal:sys.exit(3)
    return None

if __name__=='__main__':
  # manual use: audit_row.py <title> <seat> <card> <prewrite.json> <fetchback.json> [--dry]
  t,seat,card,p,b=sys.argv[1:6];n=notes(seat,card,json.load(open(p)),json.load(open(b)))
  print(n) if '--dry' in sys.argv else post(t,n)
