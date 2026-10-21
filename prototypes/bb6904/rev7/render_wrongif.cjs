// Revision 7 wrong-if (BB-7154): over a debate transcript (the Drive markdown the flow writes), FIRES if
// (1) the "Alternate judges" section names a seat not counted for N uncured violations, and the "Debate rule violations" table has
//     no row "Panel judge (removed): <seat>" with **UNCURED**, or its count line reports fewer not cured than the removed seats' sum;
// (2) a Standing (K-G3) row is CURED with "CORRECTED STANDING: DEFENDER <S>" for a judge, and that judge's Result row does not
//     print "corrected" with <S> beside the stored standing;
// (3) a Conceded count (K-G1) row is CURED with "CORRECTED COUNT: <SIDE> <n>", and that judge's Result row does not print
//     "(corrected by the cure: <n> conceded)" on that side (BB-7157). Limbs 2 and 3 read the side's own part of the row.
// Usage: node render_wrongif.cjs <transcript.md>
const t=require('fs').readFileSync(process.argv[2],'utf8');const fired=[];
const sec=(h)=>{const i=t.indexOf('\n## '+h);if(i<0)return '';const j=t.indexOf('\n## ',i+4);const k=t.indexOf('\n---',i+4);const e=[j,k].filter(x=>x>0);return t.slice(i,e.length?Math.min(...e):undefined);};
const alt=sec('Alternate judges'),drv=sec('Debate rule violations'),res=sec('Result');
const rem=[...alt.matchAll(/^- (.+?) was not counted \((\d+) debate rule violation/gm)].map(m=>({seat:m[1],n:+m[2]}));
const cnt=drv.match(/(\d+) violations?: (\d+) cured, (\d+) not cured/);const nc=cnt?+cnt[3]:0;
rem.forEach(r=>{const re=new RegExp('^\\| Panel judge \\(removed\\): '+r.seat.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+' \\|[^\\n]*\\*\\*UNCURED\\*\\*','m');
 if(!re.test(drv))fired.push('removed seat '+r.seat+' has no "Panel judge (removed)" UNCURED row in the violations table');});
const need=rem.reduce((a,r)=>a+r.n,0);if(nc<need)fired.push('count line says '+nc+' not cured; removed seats carry '+need);
const rrow=(who,side)=>{const single=who.startsWith('Single judge');const key=single?'| '+(side==='DEFENDER'?'Defense':'Challenge')+' standing (single judge) |':'| '+who+' |';
 const row=res.split('\n').find(l=>l.startsWith(key))||'';if(single)return row;const i=row.indexOf('; challenge ');return side==='DEFENDER'?(i>=0?row.slice(0,i):row):(i>=0?row.slice(i):'');};
for(const m of drv.matchAll(/^\| (Single judge: [^|]+?|Panel judge [^|]+?) \| (DEFENDER|CHALLENGER) STANDING \| Standing \(K-G3\) \| \*\*CURED\*\* \|[^\n]*CORRECTED STANDING: (DEFENDER|CHALLENGER) ([A-Z-]+)/gm)){
 const who=m[1].trim(),side=m[3],S=m[4];const part=rrow(who,side);
 if(!(/corrected by the cure/i.test(part)&&part.includes(S)))fired.push(who+' ('+side+'): Result row does not show the corrected standing '+S+' ("'+part.slice(0,90)+'")');}
for(const m of drv.matchAll(/^\| (Single judge: [^|]+?|Panel judge [^|]+?) \| [^|]+ \| Conceded count \(K-G1\) \| \*\*CURED\*\* \|[^\n]*CORRECTED COUNT: (DEFENDER|CHALLENGER) (\d+)/gm)){
 const who=m[1].trim(),side=m[2],n=m[3];const part=rrow(who,side);
 if(!new RegExp('corrected by the cure:[^)]*\\b'+n+' conceded','i').test(part))fired.push(who+' ('+side+'): Result row does not show the corrected count '+n+' conceded ("'+part.slice(0,90)+'")');}
console.log(fired.length?'FIRED: '+fired.join(' | '):'SILENT ('+rem.length+' removed seat(s); count '+(cnt?cnt[0]:'none')+')');
