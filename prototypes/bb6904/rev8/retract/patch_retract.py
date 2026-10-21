# Worker_A3 step 3d (BB-7330): RETRACTED replaces the cure keyword WITHDRAWN; CORRECTED RESULT; counted verdict = corrected result.
# Each anchor must occur exactly once in a node or the script refuses that node. Usage: python3 -I patch_retract.py <in_dir> <out_dir> [only]
import sys,os,glob
src,dst=sys.argv[1],sys.argv[2];only=sys.argv[3] if len(sys.argv)>3 else None
RULE_OLD='+"WITHDRAWN: D<n> vs C<m> withdraws your BROKEN grade on that line; a withdrawn line is not a BROKEN line, so that one line cures every item flagged on it (layer, count, pressing). A STATEMENT line never withdraws anything.\\n"'
RULE_NEW='+"RETRACTED: D<n> vs C<m> retracts your BROKEN grade on that line; a retracted line is not a BROKEN line, so that one line cures every item flagged on it (layer, count, pressing). A retraction counts only beside one CORRECTED RESULT line: your CLAUSE tag as it stands after your retractions, and that result is the one counted. A STATEMENT line never retracts anything.\\n"'
SHARED=[
 ('[CR1], [CR2] or [CR3]); or with WITHDRAWN for that link. "','[CR1], [CR2] or [CR3]); or with RETRACTED for that link. "'),
 ('(rounds as for K-G1), or with WITHDRAWN for that link. "','(rounds as for K-G1), or with RETRACTED for that link. "'),
 ('or with one WITHDRAWN line for each BROKEN link of that side.";','or with one RETRACTED line for each BROKEN link of that side.";'),
 ('+"WITHDRAWN: D<n> vs C<m>\\n"','+"RETRACTED: D<n> vs C<m>\\n"\n +"CORRECTED RESULT: <BROKEN-1 | BROKEN-2 | PARTIAL-1 | PARTIAL-2 | PARTIAL-3 | HELD-1>\\n"'),
 (RULE_OLD,RULE_NEW),
 ('A link not on a WITHDRAWN line is not withdrawn.','A link not on a RETRACTED line is not retracted.'),
 ('const CURE_KEY=/^(RESTATED|WITHDRAWN|CORRECTED COUNT|','const CURE_KEY=/^(RESTATED|RETRACTED|CORRECTED RESULT|CORRECTED COUNT|'),
 ('const o={restated:[],withdrawn:[],','const o={restated:[],withdrawn:[],result:[],'),
 ("if(k[1]==='WITHDRAWN'&&(m=r.match(/^D(\\d+)\\s+vs\\.?\\s+C(\\d+)$/i)))o.withdrawn.push({link:cureId(m[1],m[2]),line:l});",
  "if(k[1]==='RETRACTED'&&(m=r.match(/^D(\\d+)\\s+vs\\.?\\s+C(\\d+)$/i)))o.withdrawn.push({link:cureId(m[1],m[2]),line:l});\n  else if(k[1]==='CORRECTED RESULT'&&(m=r.match(/^(BROKEN-1|BROKEN-2|PARTIAL-1|PARTIAL-2|PARTIAL-3|HELD-1)$/)))o.result.push({tag:m[1],word:m[1].split('-')[0],line:l});"),
 ("const wd=new Set(o.withdrawn.map(w=>U(w.link)));",
  "const wd=new Set(o.result.length===1?o.withdrawn.map(w=>U(w.link)):[]); // BB-7330: a retraction counts only beside exactly one CORRECTED RESULT line\n const rxNoRes=new Set(o.result.length!==1?o.withdrawn.map(w=>U(w.link)):[]);"),
 ("if(!reply||!reply.ok)return res('UNCURED','cure call failed: '+(reply?reply.why:'no reply'),null);",
  "if(!reply||!reply.ok)return res('UNCURED','cure call failed: '+(reply?reply.why:'no reply'),null);\n  if(x.link&&rxNoRes.has(U(x.link)))return res('UNCURED','RETRACTED without exactly one CORRECTED RESULT line',o.withdrawn.filter(w=>U(w.link)===U(x.link)).map(w=>w.line));"),
 ("if(x.rule==='K-G4'){if(wd.has(U(x.link)))return res('CURED','withdrawn',","if(x.rule==='K-G4'){if(wd.has(U(x.link)))return res('CURED','retracted',"),
 ("if(x.rule==='K-B'){if(wd.has(U(x.link)))return res('CURED','withdrawn',","if(x.rule==='K-B'){if(wd.has(U(x.link)))return res('CURED','retracted',"),
 ("if(x.rule==='K-G1'){if(wd.has(U(x.link)))return res('CURED','withdrawn',","if(x.rule==='K-G1'){if(wd.has(U(x.link)))return res('CURED','retracted',"),
 ("no PRESSED line, no WITHDRAWN line, and no statement","no PRESSED line, no RETRACTED line, and no statement"),
 ("' and no WITHDRAWN line for '+x.link,lines);","' and no RETRACTED line for '+x.link,lines);"),
 ("' and no WITHDRAWN line',null);","' and no RETRACTED line',null);"),
 ("'no WITHDRAWN line for '+miss.join(', ')","'no RETRACTED line for '+miss.join(', ')"),
 ("return res('CURED','withdrawn: '+need.join(', '),wl);}","return res('CURED','retracted: '+need.join(', '),wl);}"),
 ("const cureSafe=",
  "// BB-7330 (option 2, the operator's \"2\" at 14:51 CDT): where a RETRACTED line cured an item, the seat is counted on its one CORRECTED RESULT.\n"
  "function cureCorrected(reply,v){const o=cureLines(reply&&reply.ok?reply.text:'');if(o.result.length!==1)return null;\n"
  " if(!(v||[]).some(x=>x.status==='CURED'&&/^retracted/.test(x.why||'')))return null;return {tag:o.result[0].tag,word:o.result[0].word,links:[...new Set(o.withdrawn.map(w=>w.link))]};}\n"
  "const cureCorrLine=(seat,orig,c)=>'[AUDIT v21: CORRECTED RESULT -- '+(seat?'SEAT: '+seat+'; ':'')+'ORIGINAL: '+orig+'; COUNTED: '+c.word+' ('+c.tag+'); RETRACTED: '+c.links.join(', ')+']';\n"
  "const cureSafe="),
 ("statement:lines&&lines.length?lines.join(' / '):null,kinds:kinds||[]};};",
  "statement:(l=>l&&l.length?l.join(' / '):null)(status==='CURED'&&/^retracted/.test(why||'')&&o.result.length===1?(lines||[]).concat([o.result[0].line]):lines),kinds:kinds||[]};}; // BB-7330: a cure by retraction shows its CORRECTED RESULT line"),
 ("if(miss.length)return res('UNCURED',(sv[0]==='SELF-SUPPORTED'?'standing kept SELF-SUPPORTED; ':'')+'no RETRACTED line for '+miss.join(', ')",
  "if(miss.length)return res('UNCURED',(sv[0]==='SELF-SUPPORTED'?'standing kept SELF-SUPPORTED; ':'')+(miss.some(l=>rxNoRes.has(l))?'RETRACTED without exactly one CORRECTED RESULT line; ':'')+'no counted RETRACTED line for '+miss.join(', ')"),
]
SITE={
 'Panel_Cure_Check.js':[(".join('\\n');bodies[i]=JSON.stringify(b);});",
   ".join('\\n');\n const cc=cureCorrected(r?r.reply:null,v);if(cc){b.payload.verdict_raw=b.payload.verdict_raw+'\\n'+cureCorrLine(s.seat,b.payload.verdict_tag,cc);b.payload.verdict_tag=cc.word;s.corrected=cc;}\n bodies[i]=JSON.stringify(b);});")],
 'Alternate_Merge.js':[(".concat(cureProse(a.seat,c?c.reply:null)).join('\\n');}",
   ".concat(cureProse(a.seat,c?c.reply:null)).join('\\n');\n  const cc=cureCorrected(c?c.reply:null,v);if(cc){b.payload.verdict_raw=b.payload.verdict_raw+'\\n'+cureCorrLine(a.seat,b.payload.verdict_tag,cc);b.payload.verdict_tag=cc.word;}}")],
 'Cure_Check.js':[("return [{json:{...base,independent_verdict_raw:base.independent_verdict_raw+'\\n\\n'+cureReport(null,v).concat(cureProse(null,r?r.reply:null)).join('\\n'),",
   "const cc=cureCorrected(r?r.reply:null,v);\nreturn [{json:{...base,...(cc?{verdict_tag:cc.word}:{}),independent_verdict_raw:base.independent_verdict_raw+'\\n\\n'+cureReport(null,v).concat(cureProse(null,r?r.reply:null)).concat(cc?[cureCorrLine(null,base.verdict_tag,cc)]:[]).join('\\n'),")]}
os.makedirs(dst,exist_ok=True);bad=0
for f in sorted(glob.glob(os.path.join(src,'*.js'))):
    b=os.path.basename(f);s=open(f,encoding='utf8').read()
    if only and b!=only:
        open(os.path.join(dst,b),'w',encoding='utf8').write(s);continue
    for o,n in SHARED+SITE.get(b,[]):
        c=s.count(o)
        if c!=1: print('REFUSED',b,c,o[:70]);bad+=1;break
        s=s.replace(o,n)
    else:
        # comment lines only: the keyword in the comments that describe the rule (no code line is touched here)
        s='\n'.join((l.replace('WITHDRAWN','RETRACTED').replace('not withdrawn','not retracted') if l.lstrip().startswith('//') else l) for l in s.split('\n'))
        open(os.path.join(dst,b),'w',encoding='utf8').write(s)
print('refused',bad)
