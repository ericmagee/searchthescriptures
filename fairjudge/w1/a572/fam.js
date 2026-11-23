const fs=require('fs');
const nodes=[];
for(const [f,tag] of [["eng.json","E"],["child.json","C"]]){const w=JSON.parse(fs.readFileSync(f));for(const n of w.nodes){const c=n.parameters&&n.parameters.jsCode;if(c&&n.name!=='Shared Library')nodes.push({id:tag+':'+n.name,c})}}
const keyOf=t=>{let m=t.match(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/)||t.match(/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/);return m?m[1]:'~'+t.slice(0,40)};
const F={
 'A judge prompt text':/^(PART2|ANSWER|HEDGE|REFUSE|FORM|RULE_C|HEADS|PLACED)$/,
 'B model reply reader':/^(__RFX|RF|RFT|M1|M2|unm|hits|SEP|__WN|fwd|trim|back|endsSep|readEnv|mask|spans)$|^~(if\(fam==='anthropic'|if\(!e\.text|else\{const c=\(d\.cho|else if\(fam==='gemi|spans\.sort|if\(RF\|\|RFT\)|return \{text:out|if\(h\.marker|const \[s2,e2\])/,
 'C judge line parser (P.*)':/^~P[.\[]|^(rr|judgeText|readLines|ent|gi)$/,
 'D close and verdict readers':/^(fresh|RENUM|rm|dlinks|cblocks|declared|GRADE|MULTI|lists|nd|mismatch|CB|stems|sc|renum|nDecl|lim|closeLabels|vkeys|__ogrS|noteD|noteL|noteR|bold|REPORT|OWN|said|OS|QW|VERD|LISTH|report)$|^~\['|^~(for\(const m of lists|if\(best&&best|if\(hd\.length|for\(const c of labels|try\{const DL=dlinks|H\.forEach|return H\.map|for\(const p0 of t|if\(report\(s\)|for\(const s0 of p)/,
 'E barred-move check (BAR)':/^(AB|__RD|GIVE|LINE|md|rebutOk|AC|AG|so|loc|MARK|NAR|move|unq|__why|__rec|__void|__c2|__k2|__seat|__keep)$|^~(for\(const para of t|if\(!W\(R\[l|if\(!inA\(pos|if\(cur\)\{const end|for\(const k of ROUNDS|if\(m\)\{const v=IMP|if\(!cur&&|\?\{code:'b'|if\(at\)\{const tail|for\(const l of L\)\{const a=o|if\(m\[7\]\)|for\(const h of H\)\{if\(L|for\(const l of N\(text|if\(f\)out\.push|for\(const h of hits)/,
 'F verse and book tables':/^(CHL|BOOKS|citedLabels|verses|namedIn|citedRounds|premises|isVerse|isNamed)$|^~Object\.assign\(BK/,
 'G debater call and prompt':/^(sys|call|__RND|__SHT|__DIAGPREV|__cc|FAMS|__PROVE9|__orc)$|^~if\(fam==='(openrouter|gemini|anthropic)'\)?/,
 'H library loader lines':/^(__LT|__S|__L|__P|__N|REFP|LAY)$|^~(if\(__S\.length!==__N|return await new Fu)/,
 'J verse sheet and verse fetch':/^(req|plan|__SP|url|URL_MAX)$|^~(return 'VERSE SHEET|if\(!keys\.length\)return|for\(const k of keys\)\{if\(off|if\(seen\.has\('Psalms|for\(const \[g,vs\] of G|return \{url:conds|if\(ulen\+add>URL_MAX)/,
};
const res=[];
for(const [name,re] of Object.entries(F)){const per={};
 for(const n of nodes){const ls=n.c.split('\n').map(l=>l.trim()).filter(t=>t.length>=40&&re.test(keyOf(t)));if(ls.length)per[n.id]=ls.join('\n')}
 const ids=Object.keys(per);const lens=ids.map(i=>per[i].length);const tot=lens.reduce((a,b)=>a+b,0);const mx=Math.max(...lens);
 // versions: count distinct; also count nodes identical to the largest
 const vers=new Set(Object.values(per)).size;
 res.push({name,n:ids.length,vers,avg:Math.round(tot/ids.length),mx,tot,save:tot-mx-150*ids.length,ids:ids.map(x=>x.replace(/^E:/,''))})}
res.sort((a,b)=>b.save-a.save);
for(const r of res)console.log(r.name,'| nodes',r.n,'| versions',r.vers,'| per copy avg',r.avg,'max',r.mx,'| total',r.tot,'| saving',r.save,'\n   ',r.ids.join(', '));
fs.writeFileSync('families.json',JSON.stringify(res,null,1));
