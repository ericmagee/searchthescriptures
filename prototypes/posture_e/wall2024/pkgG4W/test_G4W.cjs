// pkgG4W test. Run from wall2024/: node pkgG4W/test_G4W.cjs
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const sha=s=>require('crypto').createHash('sha256').update(s).digest('hex').slice(0,16);
let ok=0,bad=0;const T=(n,c,d)=>{if(c){ok++;console.log('OK   '+n);}else{bad++;console.log('FAIL '+n+(d?' -- '+d:''));}};
const P=JSON.parse(rd('pkgG4W/plan_G4W.json'));T('19 nodes',P.nodes.length===19);
for(const n of P.nodes){const b=rd('pkgG4L/patched/'+n.file),s=rd('pkgG4W/patched/'+n.file);T(n.name+': shas match',sha(b)===n.base_sha&&sha(s)===n.final_sha);
 let p=true;try{new Function('$','$input',s);}catch(e){p=false;}T(n.name+': parses; the cure check and the label both use g4Unans2024; DRV_WORDS unchanged',p&&s.includes('const __mb421=!g4Unans2024(x.line);')&&s.includes('function g4Label2024(x){return g4Unans2024(x.line)')&&s.match(/const DRV_WORDS=[^;]*;/)[0]===b.match(/const DRV_WORDS=[^;]*;/)[0]);}
const ld=f=>{const s=rd(f);const dw=s.match(/const DRV_WORDS=[^;]*;/)[0];const a=s.indexOf('function g4Unans2024');const fn=a<0?'':s.slice(a,s.indexOf('// pkgG4L (W3 2291)'));return new Function(dw+'\n'+fn+'\nreturn {DW:DRV_WORDS,U:typeof g4Unans2024==="function"?g4Unans2024:null};')();};
const N=ld('pkgG4W/patched/Panel_Cure_Check.js'),O=ld('pkgG4L/patched/Panel_Cure_Check.js');
const oldU=l=>O.DW.test(String(l||''));const newU=l=>N.U(l);
// every K-G4 item of 32973, 32980 (stored log) and 32985 (saved body)
const B=JSON.parse(rd('/mnt/project-files/wall2024/enforcer_log_body_32985.json'));const r85=(Array.isArray(B)?B:(B.p_rows||B.rows)).filter(r=>r.rule==='K-G4').map(r=>({run:'32985',seat:r.seat,item:r.item,cure_status:r.cure_status,line:r.flagged_line}));
const all=JSON.parse(rd('pkgG4W/fixture_g4_32973_32980.json')).concat(r85);
const cls=u=>u?'UNANSWERED-WITNESS':'MEANING';const changed=[];
console.log('   K-G4 items replayed: '+all.length+' (32973 '+all.filter(x=>x.run==='32973').length+', 32980 '+all.filter(x=>x.run==='32980').length+', 32985 '+all.filter(x=>x.run==='32985').length+')');
for(const x of all){const a=oldU(x.line),b=newU(x.line);if(a!==b)changed.push(x);if(a&&!b)T('no item moves from UNANSWERED-WITNESS to MEANING: '+x.run+' '+x.seat+' '+x.item,false);}
T('no item loses UNANSWERED-WITNESS',all.every(x=>!oldU(x.line)||newU(x.line)));
console.log('   items whose class changes ('+changed.length+'):');for(const x of changed)console.log('     '+x.run+' '+x.seat+' '+x.item+' ('+x.cure_status+' on the run): '+cls(oldU(x.line))+' -> '+cls(newU(x.line))+' | GROUND: '+(String(x.line).match(/GROUND:\s*([\s\S]*)$/)||[,''])[1].slice(0,160));
const key=x=>x.run+' '+x.seat+' '+x.item;const exp=['32985 chatgpt D2 vs C2','32985 chatgpt D5 vs C5','32985 sol D1 vs C1'];
T('2294 (c): chatgpt D2 vs C2, D5 vs C5 and sol D1 vs C1 in 32985 move to UNANSWERED-WITNESS',exp.every(k=>changed.some(x=>key(x)===k)),changed.map(key).join(', '));
// 2294 (a): only in the GROUND, never in a quotation
T('a phrase inside a quotation in the GROUND does not count',!N.U('D1 vs C1 (x): BROKEN -- GROUND: [DR3] says "I gave no answer to that" and the verse means more.')&&!N.U("D1 vs C1 (x): BROKEN -- GROUND: [DR3] says 'I did not answer it' and the verse means more."));
T('a phrase before GROUND (in the header or verses) does not count',!N.U('D1 vs C1 (x): BROKEN -- the side did not answer -- GROUND: the verse means more.'));
T('a line with no GROUND keeps the old class',!N.U('D1 vs C1 (x): BROKEN -- the side did not answer.')&&N.U('D1 vs C1 (x): BROKEN -- left unanswered.'));
T('each new phrase counts in the GROUND',['did not answer','does not answer','not been answered','no answer','receives no answer','gave no answer','left without answer'].every(p=>N.U('D1 vs C1 (x): BROKEN -- GROUND: the press '+p+' here.')));
T('an apostrophe inside a word does not open a quotation',N.U("D1 vs C1 (x): BROKEN -- GROUND: the challenger's reply does not answer Joseph's press."));
console.log(ok+' OK '+bad+' FAIL');process.exitCode=bad?1:0;
