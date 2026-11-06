// pkgNHQ test. Run from wall2024/: node pkgNHQ/test_NHQ.cjs   (needs /mnt/project-files/wall2024/inputs/33060_Panel_Cure_Normalize_1.json for the rounds)
const fs=require('fs');const rd=f=>fs.readFileSync(f,'utf8');const crypto=require('crypto');const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const {execSync}=require('child_process');
let ok=0,bad=0;const T=(n,c,d)=>{console.log((c?'OK  ':'FAIL')+' '+n+(d?'\n     '+d:''));c?ok++:bad++;};
const plan=JSON.parse(rd('pkgNHQK/plan_NHQ.json'));
T('22 nodes; base shas = '+plan.base+', final shas = pkgNHQK/patched',plan.nodes.length===22&&plan.nodes.every(n=>sha(rd(plan.base+'/'+n.file))===n.base_sha&&sha(rd('pkgNHQK/patched/'+n.file))===n.final_sha));
const lib=pkg=>{const s=rd(pkg+'/patched/Panel_Cure_Check.js');return new Function('$','$input',s.slice(0,s.indexOf("const PP=$('Panel Payloads')"))+'\nreturn {cureVerdicts,nhqFull:typeof nhqFull==="function"?nhqFull:null,krulCure};')(()=>{throw 0},null);};
const A=lib(plan.base.replace(/\/patched$/,'')),B=lib('pkgNHQK');
const FX=JSON.parse(rd('pkgNHQ/fixture_33060.json'));
const R=JSON.parse(rd('/mnt/project-files/wall2024/inputs/33060_Panel_Cure_Normalize_1.json'))[0].main[0].map(x=>x.json).map(x=>x.cure&&x.cure.rounds).find(Boolean);
const items=FX.items.map(({id,want,...x})=>x);const reply={ok:true,text:FX.reply};
const va=A.cureVerdicts(items,reply,null,R),vb=B.cureVerdicts(items,reply,null,R);
FX.items.forEach((it,i)=>{T('33060 row '+it.id+' sol '+it.rule+' '+it.link+': base '+va[i].status+', pkgNHQ '+vb[i].status+' (want '+it.want+')',vb[i].status===it.want,vb[i].why);});
T('row 7881 was UNCURED on the base (the fault reproduces)',va[0].status==='UNCURED');
const f81=B.nhqFull(FX.items[0].line,R);
T('nhqFull on row 7881 returns the whole [DR4] sentence, ending "carries a father; I keep the drop I made there."',f81.length===1&&/carries a father; I keep the drop I made there\.$/.test(f81[0]),f81[0]&&f81[0].slice(0,90)+' ... '+f81[0].slice(-60));
const f83=B.nhqFull(FX.items[1].line,R);
T('nhqFull on row 7883 finds "I concede the point on ek (out of)." in [CR2] (markdown *ek* aside), and the item stays UNCURED',f83.length===1&&f83[0]==='I concede the point on ek (out of).',JSON.stringify(f83));
T('unit: a line with no round label, or a quote not in the round, gives no full sentence (every test as before)',B.nhqFull('LINK 1: "no label here at all, twelve+"',R).length===0&&B.nhqFull('[CR2] LINK 1: "this sentence is in no round of the debate."',R).length===0);
T('unit: K-CON reads the cut LATER quotation from the round',(()=>{const x={rule:'K-CON',link:'VERIFIED CONTRADICTION CHALLENGER DR3 to DR4',line:'[DR4] the record shows: EARLIER [DR3] "x y z w v u t s r q." -- LATER [DR4] "C2: NARROWED TO: the sign\'s own frame, bounded by \'before the child'};
 const t='CONTRADICTION: [DR4] "carries a father; I keep the drop I made there."';const a=A.krulCure(x,t,R,''),b=B.krulCure(x,t,R,'');return a&&b&&a.st==='UNCURED'&&b.st==='CURED';})());
// corpus: the logged NOT HELD cures, base vs pkgNHQ (corpus/replay_cure.cjs; output saved in pkgNHQK/replay_cure_out.txt)
const out=execSync('node corpus/replay_cure.cjs '+plan.base.replace(/\/patched$/,'')+' pkgNHQK',{maxBuffer:64<<20}).toString();fs.writeFileSync('pkgNHQK/replay_cure_out.txt',out);
const rows=p=>{const o=[];let h='';for(const l of out.split('\n')){const m=l.match(/^(\S+) (\d+ \S+): cure items/);if(m){h=m[1]===p?m[2]:null;continue;}if(h&&/^     /.test(l))o.push(h+' '+l.trim());}return o;};
const ra=rows(plan.base.replace(/\/patched$/,'')),rb=rows('pkgNHQK');const ch=[];ra.forEach((a,i)=>{if(a!==rb[i])ch.push(a.split(' -- ')[0]+'  =>  '+rb[i].split(' -- ')[0].replace(/^.*?: (?=(UN)?CURED)/,''));});
T('corpus cure replay: '+ra.length+' rows each; '+ch.length+' change, all UNCURED -> CURED (none lost)',ra.length===rb.length&&ch.every(c=>/: UNCURED\s+=>\s+CURED/.test(c)),ch.join('\n     '));
T('the changes are exactly 33014 chatgpt and sol K-W CHALLENGER DR3 LINK 3 #1 (line "I grant no row states Mary\'s house." spans into the next sentence; both judges quote the flagged sentence whole)',ch.length===2&&ch.every(c=>/^33014 (chatgpt|sol) +K-W CHALLENGER DR3 LINK 3 #1:/.test(c)));
console.log(ok+' OK, '+bad+' FAIL');
