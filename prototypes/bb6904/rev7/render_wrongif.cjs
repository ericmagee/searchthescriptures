// Revision 7 wrong-if (BB-7154): over a debate transcript (the Drive markdown the flow writes), FIRES if
// (1) the "Alternate judges" section names a seat not counted for N uncured violations, and the "Debate rule violations" table has
//     no row "Panel judge (removed): <seat>" with **UNCURED**, or its count line reports fewer not cured than the removed seats' sum;
// (2) a Standing (K-G3) row is CURED with "CORRECTED STANDING: DEFENDER <S>" for a judge, and that judge's Result row does not
//     print "corrected" with <S> beside the stored standing.
// Usage: node render_wrongif.cjs <transcript.md>
const t=require('fs').readFileSync(process.argv[2],'utf8');const fired=[];
const sec=(h)=>{const i=t.indexOf('\n## '+h);if(i<0)return '';const j=t.indexOf('\n## ',i+4);const k=t.indexOf('\n---',i+4);const e=[j,k].filter(x=>x>0);return t.slice(i,e.length?Math.min(...e):undefined);};
const alt=sec('Alternate judges'),drv=sec('Debate rule violations'),res=sec('Result');
const rem=[...alt.matchAll(/^- (.+?) was not counted \((\d+) debate rule violation/gm)].map(m=>({seat:m[1],n:+m[2]}));
const cnt=drv.match(/(\d+) violations?: (\d+) cured, (\d+) not cured/);const nc=cnt?+cnt[3]:0;
rem.forEach(r=>{const re=new RegExp('^\\| Panel judge \\(removed\\): '+r.seat.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+' \\|[^\\n]*\\*\\*UNCURED\\*\\*','m');
 if(!re.test(drv))fired.push('removed seat '+r.seat+' has no "Panel judge (removed)" UNCURED row in the violations table');});
const need=rem.reduce((a,r)=>a+r.n,0);if(nc<need)fired.push('count line says '+nc+' not cured; removed seats carry '+need);
for(const m of drv.matchAll(/^\| (Single judge: [^|]+?|Panel judge [^|]+?) \| DEFENDER STANDING \| Standing \(K-G3\) \| \*\*CURED\*\* \|[^\n]*CORRECTED STANDING: DEFENDER ([A-Z-]+)/gm)){
 const who=m[1].trim(),S=m[2];const rowKey=who.startsWith('Single judge')?'| Defense standing (single judge) |':'| '+who+' |';
 const row=res.split('\n').find(l=>l.startsWith(rowKey))||'';
 if(!(/corrected/i.test(row)&&row.includes(S)))fired.push(who+': Result row does not show the corrected standing '+S+' ("'+row.slice(0,90)+'")');}
console.log(fired.length?'FIRED: '+fired.join(' | '):'SILENT ('+rem.length+' removed seat(s); count '+(cnt?cnt[0]:'none')+')');
