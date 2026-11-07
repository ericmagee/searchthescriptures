// pkgGSL2 tests. Run from wall2024/: node pkgGSL2/test_GSL2.cjs
const {harness,rd,D}=require('../pkgGSL/harness.cjs');let ok=0,bad=0;const out=[];const T=(n,c,x)=>{out.push((c?'OK   ':'FAIL ')+n+(x?'\n     '+x:''));c?ok++:bad++;};
const B=f=>rd('pkgGSL2/base/'+f),P=f=>rd('pkgGSL2/patched/'+f);const rows=j=>(j.gate_rows||[]).map(r=>r.seat+' '+r.item+' '+r.cure_status);const S=o=>JSON.stringify(o);
const plan=JSON.parse(rd('pkgGSL2/plan_GSL2.json')),asm=JSON.parse(rd('pkgASM/plan_ASM.json'));
T('A1 the 6 bases are the pkgASM finals',plan.nodes.every(n=>{const a=asm.nodes.find(z=>z.name===n.name);return a&&a.final_sha===n.base_sha;}));
const call=JSON.parse(rd(D+'33222_Alt_Gate_Call_openrouter.json'));const it=(d=>{const r=Array.isArray(d)?d[0]:d;return ((r.data&&r.data.main)||r.main)[0];})(call);
const G4='GATE: G4 || CHANGE TO: CONCEDED LINKS: 4 -- premise 3 UNEXHIBITED (Isaiah 8:8 unanswered);';
const mod=(from,to)=>{const s=JSON.stringify(it);if(s.split(from).length!==2)throw new Error('control anchor');return JSON.parse(s.split(from).join(to));};
// parity on the real runs
{const H=harness('33222');const b=H(B('Alt_Gate_Record.js'),'Alt Gate Call openrouter')[0].json,p=H(P('Alt_Gate_Record.js'),'Alt Gate Call openrouter')[0].json;
 T('B1 33222 Alt Gate Record: patched output equals base; grok G1-G4 CURED',S(p)===S(b)&&rows(p).every(r=>/ CURED$/.test(r)),rows(p).join('; '));}
for(const RUN of ['33222','33218']){const H=harness(RUN);const b=H(B('Gate_Record.js'),'Gate Call openrouter')[0].json,p=H(P('Gate_Record.js'),'Gate Call openrouter')[0].json;
 T('B2 '+RUN+' Gate Record: patched output equals base',S(p)===S(b),rows(b).join('; '));}
// W3 2731 item 4: the PSG control (G4 regrades the unnamed premise 1, refused), where G3 is applied on the same line
{const c1=mod(G4,'GATE: G4 || CHANGE TO: CONCEDED LINKS: 5 -- premise 1 UNEXHIBITED (Matthew 1:2 unanswered); premise 3 UNEXHIBITED (Isaiah 8:8 unanswered);');
 const H=harness('33222',{'Alt Gate Call openrouter':c1});const b=H(B('Alt_Gate_Record.js'),'Alt Gate Call openrouter')[0].json,p=H(P('Alt_Gate_Record.js'),'Alt Gate Call openrouter')[0].json;
 const st=(j,g)=>((j.gate_rows||[]).find(r=>new RegExp('^'+g+' ').test(r.item))||{}).cure_status;
 T('C1 base (PSG+UNXA+ASM): G1 and G2 UNCURED although G3 rewrote their line (the gap)',st(b,'G1')==='UNCURED'&&st(b,'G2')==='UNCURED'&&st(b,'G3')==='CURED',rows(b).join('; '));
 T('C2 pkgGSL2: G1 and G2 CURED (superseded by the applied G3), G3 CURED, G4 still UNCURED (refused)',st(p,'G1')==='CURED'&&st(p,'G2')==='CURED'&&st(p,'G3')==='CURED'&&st(p,'G4')==='UNCURED',rows(p).join('; '));
 const w=(S(p).match(/the later gate change G\d+ of this judge rewrote the same line[^"]{0,60}/g)||[]);T('C3 the reason names G3, the applied change',w.length>0&&w.every(x=>/change G3 /.test(x)),w.slice(0,2).join(' | '));}
// D: the PSG control with G3 also refused (it regrades premise 1 too). G2 is then the last applied change of the line (CURED in base too).
{const S0=S(it);const gl=g=>(S0.match(new RegExp('GATE: '+g+' \\|\\| CHANGE TO: [^\\\\]*'))||[''])[0];const bad1=(g,v)=>gl(g).replace(/CONCEDED LINKS: (\d)/,'CONCEDED LINKS: 5 -- premise 1 UNEXHIBITED ('+v+' unanswered); $1x');
 const run=gs=>{let s=S0.split(G4).join('GATE: G4 || CHANGE TO: CONCEDED LINKS: 5 -- premise 1 UNEXHIBITED (Matthew 1:2 unanswered); premise 3 UNEXHIBITED (Isaiah 8:8 unanswered);');for(const g of gs)s=s.split(gl(g)).join(bad1(g,'Genesis 4:25'));
  const H=harness('33222',{'Alt Gate Call openrouter':JSON.parse(s)});const r={};for(const v of ['base','patched']){const j=H((v==='base'?B:P)('Alt_Gate_Record.js'),'Alt Gate Call openrouter')[0].json;r[v]={j,st:g=>((j.gate_rows||[]).find(x=>new RegExp('^'+g+' ').test(x.item))||{}).cure_status};}return r;};
 const d1=run(['G3']);const w1=(S(d1.patched.j).match(/the later gate change G\d+ of this judge rewrote the same line/g)||[]);
 T('D1 G3 and G4 refused: G2 applied (CURED in base and patched); G1 CURED under pkgGSL2 by the applied G2, G3 and G4 UNCURED',d1.base.st('G2')==='CURED'&&d1.patched.st('G2')==='CURED'&&d1.patched.st('G1')==='CURED'&&d1.patched.st('G3')==='UNCURED'&&d1.patched.st('G4')==='UNCURED'&&w1.length>0&&w1.every(x=>/G2 /.test(x)),rows(d1.patched.j).join('; '));
 const d2=run(['G2','G3']);
 T('D2 negative: G2, G3 and G4 refused: no later applied change, so no row is cured by supersession; base and patched give the same rows',S(rows(d2.base.j))===S(rows(d2.patched.j))&&!/the later gate change G\d+ of this judge rewrote/.test(S(d2.patched.j)),rows(d2.patched.j).join('; '));}
const txt=out.join('\n')+'\n'+ok+' OK, '+bad+' FAIL\n';require('fs').writeFileSync('pkgGSL2/test_GSL2.txt',txt);console.log(txt);process.exit(bad?1:0);
