# ASK 349 (judge notice, Eric option A 21:56 CST 11-16; text = Wall 7350 / W4 7348 item 6, unchanged)
import json,sys,hashlib
NOTICE=("PLEASE BE AWARE: This debate is part of a research project that tests what the King James text itself states. "
"For the integrity of the test: 1. Do not bring in any understanding of the Bible that you held before this debate; use only what the two debaters placed in the record. "
"2. Read each verse together with every other verse either side quoted on the same subject, precept upon precept, line upon line (Isaiah 28:10). "
"A verse that seems unclear when read alone does not overrule that collective witness, for either side's link. "
"3. Where a lexicon gloss differs from how the King James text renders the word, the King James text governs.")
HEAD,REST=NOTICE.split(": ",1)
dq=lambda s:s.replace('\\','\\\\').replace('"','\\"').replace('\n','\\n')
sq=lambda s:s.replace('\\','\\\\').replace("'","\\'").replace('\n','\\n')
lib=lambda s:json.dumps(s)[1:-1]
EDITS=[ # (name, runtime old, runtime new, encoder, expected total)
 ('A PART2 Commitment 16',"recorded against my seat.\n\nA sentence the system marks VOID",
   "recorded against my seat.\n\n### Commitment 16. "+HEAD+":\n"+REST+"\n\nA sentence the system marks VOID",'dq',10),
 ('B __METHOD_TOP head',"THE METHOD (Isaiah 28:10), the framework of this debate and of your judgment:\n",
   "THE METHOD (Isaiah 28:10), the framework of this debate and of your judgment:\n"+NOTICE+"\n",'dq',4),
 ('C send-back and gate prompts',"\n\nThis reply is not a judgment","\n\n"+NOTICE+"\n\nThis reply is not a judgment",'sq',3),
 ('D enforcer SYS',"You do not judge the debate.'","You do not judge the debate. "+NOTICE+"'",'sqraw',3),
]
w=json.load(open(sys.argv[1]))
tot={e[0]:0 for e in EDITS};touched=set()
for n in w['nodes']:
  c=n.get('parameters',{}).get('jsCode')
  if not isinstance(c,str):continue
  isl=n['name']=='Shared Library'
  for name,old,new,enc,_ in EDITS:
    if enc=='sqraw':  # anchor includes the JS closing quote: encode the text part only
      o=sq(old[:-1])+"'";nw=sq(new[:-1])+"'"
    else:
      f=dq if enc=='dq' else sq;o,nw=f(old),f(new)
    if isl:o,nw=lib(o),lib(nw)
    k=c.count(o)
    if k:c=c.replace(o,nw);tot[name]+=k;touched.add(n['name'])
  n['parameters']['jsCode']=c
for name,_,_,_,exp in EDITS:print(name,tot[name],'expected',exp,'OK' if tot[name]==exp else 'MISMATCH')
print('touched',sorted(touched))
json.dump(w,open(sys.argv[2],'w'))
print('sha',hashlib.sha256(json.dumps(w['nodes'],sort_keys=True).encode()).hexdigest()[:12])
