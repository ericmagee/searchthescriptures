import sys,glob
B=sys.argv[1]
def sub(path,old,new,count=1):
    s=open(path).read(); assert s.count(old)==count,(path,old[:70],s.count(old)); open(path,'w').write(s.replace(old,new))
LIB=[f for f in sorted(glob.glob(B+'/new11/*.js')) if 'function cureFound(q,txt)' in open(f).read()]
anchor="const cureCorrLine=(seat,orig,c)=>"
add=("// THE DEBATE FIXED rev 7, DoD 10 record half (ruled BB-7508 (i)): BB-7417 defect 3 stands, so a side whose count or standing items are not\n"
"// all CURED is not written; when the reply holds one CORRECTED COUNT for that side, one AUDIT line records the count and the items not cured.\n"
"function cureCountHeld(reply,v,cs,seat){const o=cureLines(reply&&reply.ok?reply.text:'');const lines=[];\n"
" for(const side of ['DEFENDER','CHALLENGER']){if(cs&&cs[side])continue;const ns=[...new Set(o.count.filter(c=>c.side===side).map(c=>c.n))];if(ns.length!==1)continue;\n"
"  const nc=(v||[]).filter(x=>x.side===side&&(x.rule==='K-G1'||x.rule==='K-G3'||x.rule==='K-G6'||x.rule==='K-G7'||x.rule==='K-G8')&&x.status!=='CURED');if(!nc.length)continue;\n"
"  lines.push('[AUDIT v21: CORRECTED COUNT NOT WRITTEN -- '+(seat?'SEAT: '+seat+'; ':'')+'SIDE: '+side+'; CORRECTED COUNT: '+ns[0]+'; NOT CURED: '+cureSafe(nc.map(x=>x.rule+' '+(x.rule==='K-G3'?x.side+' STANDING':x.link)).join(', '))+'; written only when every count or standing item of the side is CURED (BB-7417)]');}\n"
" return lines;}\n")
for f in LIB: sub(f,anchor,add+anchor)
sub(B+'/new11/Cure_Check.js',".concat(cc?[cureCorrLine(null,base.verdict_tag,cc)]:[]).concat(csl).join('\\n')",".concat(cc?[cureCorrLine(null,base.verdict_tag,cc)]:[]).concat(csl).concat(cureCountHeld(r?r.reply:null,v,cs,null)).join('\\n')")
sub(B+'/new11/Panel_Cure_Check.js'," const cs=cureSet(r?r.reply:null,v);if(cs){b.payload.verdict_raw=b.payload.verdict_raw+'\\n'+cureSetApply(b.payload,cs,s.seat).join('\\n');s.corrected_standing=cs;}",
 " const cs=cureSet(r?r.reply:null,v);if(cs){b.payload.verdict_raw=b.payload.verdict_raw+'\\n'+cureSetApply(b.payload,cs,s.seat).join('\\n');s.corrected_standing=cs;}\n {const ch=cureCountHeld(r?r.reply:null,v,cs,s.seat);if(ch.length)b.payload.verdict_raw=b.payload.verdict_raw+'\\n'+ch.join('\\n');}")
sub(B+'/new11/Alternate_Merge.js',"  const cs=cureSet(c?c.reply:null,v);if(cs)b.payload.verdict_raw=b.payload.verdict_raw+'\\n'+cureSetApply(b.payload,cs,a.seat).join('\\n');}",
 "  const cs=cureSet(c?c.reply:null,v);if(cs)b.payload.verdict_raw=b.payload.verdict_raw+'\\n'+cureSetApply(b.payload,cs,a.seat).join('\\n');\n  {const ch=cureCountHeld(c?c.reply:null,v,cs,a.seat);if(ch.length)b.payload.verdict_raw=b.payload.verdict_raw+'\\n'+ch.join('\\n');}}")
print(len(LIB),'lib copies; 3 call sites')
