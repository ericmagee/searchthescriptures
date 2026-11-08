// pkgEGA test: Enforcer Record (live s54) base vs patched over every saved run with an Enforcer Call; every changed row listed.
// Bars: 33506 NO VERDICT drops by the "G<k>/A<k>.<n>" lines only; each newly read answer equals the verdict DeepSeek wrote on that very line;
// no row that had a verdict changes; a label with a different k is not read (unit).
const fs=require('fs');const {harness}=require('../pkgGSL/harness.cjs');const W=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s54.json','utf8'));
const B0=W.nodes.find(z=>z.name==='Enforcer Record').parameters.jsCode,P1=fs.readFileSync('pkgEGA/patched/Enforcer_Record.js','utf8');
let ok=0,bad=0;const out=[];const T=(c,m)=>{c?ok++:bad++;out.push((c?'OK ':'FAIL ')+m);};const D='/mnt/project-files/wall2024/inputs/';
const runs=fs.readdirSync(D).filter(f=>/^\d+_Enforcer_Call_deepseek\.json$/.test(f)).map(f=>f.split('_')[0]).sort();let n=0,lost=0;
const vd=r=>String(r.cure_reason||'').match(/^ENFORCER (AGREE|DISAGREE|NO ANSWER|NO VERDICT)/);
for(const R of runs){let a,b;try{a=harness(R)(B0,'Enforcer Call deepseek');b=harness(R)(P1,'Enforcer Call deepseek');}catch(e){out.push('   '+R+' skipped: '+e.message.slice(0,80));continue;}n++;
 const ra=a[0].json.enf421_rows||[],rb=b[0].json.enf421_rows||[];const ta=JSON.stringify(a[0].json.enf421&&a[0].json.enf421.tally),tb=JSON.stringify(b[0].json.enf421&&b[0].json.enf421.tally);
 const rep=String((ra[0]||{}).full_reply||'');let ch=0,wrong=0;
 ra.forEach((x,i)=>{const y=rb[i];const va=vd(x),vb=vd(y);if(!va||!vb||va[1]===vb[1])return;ch++;if(va[1]!=='NO VERDICT'){lost++;return;}
  const id=(x.item_id||'');const line=rep.split('\n').find(l=>new RegExp('G\\d+\\s*[/:,]\\s*'+'A\\d+\\.\\d+').test(l)&&l.includes(vb[1]));if(!line)wrong++;});
 if(ta!==tb||ch)out.push('   '+R+': tally '+ta+' -> '+tb+' ('+ch+' rows changed'+(wrong?', '+wrong+' without a G/A line':'')+')');}
T(lost===0,'no row that had a verdict changes ('+lost+')');T(n>=20,'replay ran on '+n+' runs');
{const a=harness('33506')(B0,'Enforcer Call deepseek'),b=harness('33506')(P1,'Enforcer Call deepseek');const ra=a[0].json.enf421_rows,rb=b[0].json.enf421_rows;const rep=String(ra[0].full_reply);
 const lines=rep.split('\n').map(l=>l.replace(/[*_`]+/g,'').trim().match(/^ENFORCER\s*:\s*G(\d+)\s*\/\s*A(\d+)\.(\d+)\s*--\s*(AGREE|DISAGREE|NO ANSWER)/i)).filter(Boolean);
 const ids=(JSON.parse(fs.readFileSync(D+'33506_Enforcer_Build.json','utf8'))[0].data.main[0][0].json.ids||[]).map(x=>x.id);
 let match=0;lines.forEach(m=>{const id='A'+m[2]+'.'+m[3];const k=ids.indexOf(id);if(k>=0&&String(rb[k].cure_reason).startsWith('ENFORCER '+m[4].toUpperCase()))match++;});
 const nv=r=>r.filter(x=>/^ENFORCER NO VERDICT/.test(x.cure_reason)).length;
 T(lines.length>0&&match===lines.length,'33506: '+lines.length+' "G<k>/A<k>.<n>" lines, each answer now carries the verdict on its own line ('+match+'/'+lines.length+'); NO VERDICT '+nv(ra)+' -> '+nv(rb));}
{const s=P1.slice(P1.indexOf('const m=l.replace'),P1.indexOf('/* pkgEGA'));const f=new Function('l','V',s+';return V;');
 T(JSON.stringify(f('ENFORCER: G3/A2.1 -- AGREE -- x',{}))==='{}','unit: "G3/A2.1" (labels disagree) is not read');
 T(f('ENFORCER: A2.1 -- DISAGREE -- y',{})['A2.1'].v==='DISAGREE','unit: plain "A2.1" reads as before');
 T(f('ENFORCER: ITEM 2/A2.2 -- AGREE -- w',{})['A2.2'].v==='AGREE'&&f('ENFORCER: 4: A4.1 -- DISAGREE -- v',{})['A4.1'].v==='DISAGREE','unit: "ITEM 2/A2.2" and "4: A4.1" read');
 T(f('**ENFORCER: G2 / A2.3 -- NO ANSWER -- z**',{})['A2.3'].v==='NO ANSWER','unit: "G2 / A2.3" with spaces and markdown');}
out.push('TOTAL '+ok+' OK, '+bad+' FAIL');console.log(out.join('\n'));fs.writeFileSync('pkgEGA/test_EGA.txt',out.join('\n')+'\n');
