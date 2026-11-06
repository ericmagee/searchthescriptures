# pkgSBS: send-back silence counts in drv_uncured (W3 2274; silence rule, Eric 2026-11-05 21:18 CST, Wall 2185). Run from wall2024/.
# A send-back item the judge left with no written answer (the reply came back, and no line of it names the item's S number) adds 1 to that
# seat's drv_uncured and sets alt_needed, as an uncured gate item does. Not counted: a failed call (transport, not silence), and an item whose
# S number the reply names on a line the reader could not parse (written, so not silence; recorded as WRITTEN, NOT READ).
# Nodes: Send Back Record (base pkgSBP/patched) and its clone Alt Send Back Record (base pkgALT/patched); Alternate Merge (Alt Apply, base
# pkgALT/patched) names the silent send-back items in an alternate's unseat line.
import hashlib,json
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()[:16]
E_SBR=[
 ("const R=$input.all().map(x=>x.json);const rows=[...ns];const errors=[];const tally={KEEP:0,CHANGE:0,'NO ANSWER':0};const shown=[];",
  "const R=$input.all().map(x=>x.json);const rows=[...ns];const errors=[];const tally={KEEP:0,CHANGE:0,'NO ANSWER':0};const shown=[];const SIL={}; /* pkgSBS: seat -> silent S numbers */"),
 ("(b.items||[]).forEach((it,k)=>{const a=A[it.sid];const ans=a?a.ans:'NO ANSWER';tally[ans]++;",
  "(b.items||[]).forEach((it,k)=>{const a=A[it.sid];const ans=a?a.ans:'NO ANSWER';tally[ans]++;\n  const named=!a&&!err&&new RegExp('\\\\bS\\\\s*'+String(it.sid).replace(/^S/i,'')+'(?!\\\\d)').test(T2);const silent=!a&&!err&&!named;if(silent)(SIL[b.seat]=SIL[b.seat]||[]).push(it.sid); /* pkgSBS (W3 2274): silence counts; a written but unread answer does not */"),
 ("cure_reason:'SEND-BACK '+ans+(a&&a.to?' TO: '+a.to.slice(0,600):'')+(a&&a.why?' -- '+a.why.slice(0,600):'')+' | ENFORCER: '+String(it.reason).slice(0,600)+' (ruling 428; the judge keeps the decision)',at:T});});});",
  "cure_reason:'SEND-BACK '+ans+(a&&a.to?' TO: '+a.to.slice(0,600):'')+(a&&a.why?' -- '+a.why.slice(0,600):'')+' | ENFORCER: '+String(it.reason).slice(0,600)+' (ruling 428; the judge keeps the decision)'+(silent?' | SILENT: no written answer; counted in drv_uncured (silence rule, WALL-2024 2274)':named?' | WRITTEN, NOT READ: the reply names '+it.sid+' but no SENDBACK line could be read; not silence, not counted':''),at:T});});});\n"
  "let bodies=null,anySil=false;const silent_counted=[]; /* pkgSBS: add each seat's silent items to its drv_uncured, as Gate Record does for uncured gate items */\n"
  "if(Object.keys(SIL).length){bodies=(Array.isArray(PASS.bodies)?PASS.bodies:$('Panel Cure Check').first().json.bodies).slice();\n"
  " for(const [seat,sids] of Object.entries(SIL)){const i=bodies.findIndex(x=>{try{return JSON.parse(x).payload.judge_seat===seat;}catch(e){return false;}});if(i<0)continue;const bb=JSON.parse(bodies[i]);const p=bb.payload;\n"
  "  p.drv_uncured=(p.drv_uncured||0)+sids.length;anySil=true;silent_counted.push({seat,items:sids});\n"
  "  p.verdict_raw=p.verdict_raw+'\\n[AUDIT v40: SEND-BACK SILENCE -- SEAT: '+seat+'; ITEMS: '+sids.join(', ')+'; no written answer to '+(sids.length===1?'this send-back item':'these send-back items')+'; counted in drv_uncured (silence rule, WALL-2024 2274). REVIEW THIS ROW.]';bodies[i]=JSON.stringify(bb);}}"),
 ("return [{json:{...PASS,sendback:{skipped:false,calls:B.length,not_sent:ns.length,tally,errors},sb_rows:rows,sb_items:shown}}];",
  "return [{json:{...PASS,...(bodies?{bodies}:{}),alt_needed:!!PASS.alt_needed||anySil,sendback:{skipped:false,calls:B.length,not_sent:ns.length,tally,errors,silent_counted},sb_rows:rows,sb_items:shown}}];"),
]
E_AM=[
 ("const un=((GR&&GR.gate_rows)||[]).filter(x=>x.seat===s.seat&&x.cure_status==='UNCURED'&&/counted in drv_uncured/.test(String(x.cure_reason||''))).map(x=>'E-GATE '+x.item);",
  "const un=((GR&&GR.gate_rows)||[]).filter(x=>x.seat===s.seat&&x.cure_status==='UNCURED'&&/counted in drv_uncured/.test(String(x.cure_reason||''))).map(x=>'E-GATE '+x.item)\n   .concat(((SBR&&SBR.sendback&&SBR.sendback.silent_counted)||[]).filter(x=>x.seat===s.seat).flatMap(x=>x.items.map(i=>'SEND-BACK '+i+' (no written answer)'))); /* pkgSBS */"),
]
plan={'nodes':[]}
for name,src,E in [('Send Back Record','pkgSBP/patched/Send_Back_Record.js',E_SBR),('Alt Send Back Record','pkgALT/patched/Alt_Send_Back_Record.js',E_SBR),('Alternate Merge','pkgALT/patched/Alternate_Merge.js',E_AM)]:
    o=open(src).read();s=o
    for a,b in E:
        if name=='Alt Send Back Record':a=a.replace("$('Panel Cure Check')","$('Alt Seated')");b=b.replace("$('Panel Cure Check')","$('Alt Seated')")
        assert s.count(a)==1,(name,a[:60]);s=s.replace(a,b)
    f=src.split('/')[-1];open('pkgSBS/patched/'+f,'w').write(s)
    plan['nodes'].append({'file':f,'name':name,'base':src,'base_sha':sha(o),'final_sha':sha(s),'edits':len(E)})
json.dump(plan,open('pkgSBS/plan_SBS.json','w'),indent=1);print(json.dumps(plan))
