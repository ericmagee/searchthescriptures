// pkgRCK (W1, Wall 2741): a premise that an applied change (send-back or gate) ADDS to a count is read by K-UNX / K-UNX-A / E-ASM,
// the same test the first count gets. A count-line change that newly raises one of them is NOT APPLIED (a LIVE gate item kind), so the
// judge answers it at the gate: KEEP (the premise stays out) or a CHANGE whose count names the layer the block lacks. Side-neutral.
// Base: live s22 fetch-back (5a710187 line). Each anchor asserted exactly once per node.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const SRC=process.argv[2]||'/mnt/project-files/wall2024/fetchback_live_s22.json';
const OUT=path.join(__dirname,'out');fs.mkdirSync(OUT,{recursive:true});
const W0=JSON.parse(fs.readFileSync(SRC,'utf8'));const W=W0.data||W0;
const K0="function kunxLines(text,ptext){const items=[],marks=[];if(typeof text!=='string'||typeof ptext!=='string')return {items,marks};let R;try{R=ciRounds(ptext);}catch(e){return {items,marks};}";
const K1="function kunxLines(text,ptext){const items=[],marks=[];if(typeof text!=='string'||!(typeof ptext==='string'||(ptext&&typeof ptext==='object')))return {items,marks};let R;try{R=typeof ptext==='string'?ciRounds(ptext):ptext;}catch(e){return {items,marks};} /* pkgRCK: also takes the rounds object */";
const A0=" if(!map.size&&!items.length&&!resTo)return null;\n const T=build(map);const P=rcLines(T);const col=P.col;";
const RCK=" {/* pkgRCK (W1 2741; 33249 sol S28/G8): a count change that newly raises K-UNX is not applied */if(RD&&typeof RD==='object'&&Object.keys(RD).length&&map.size){const L9={DEFENDER:'CONCEDED LINKS',CHALLENGER:'CHALLENGER CONCEDED LINKS'};\n  const b9=new Set(kunxLines(text,RD).items.map(x=>x.link));const T9=build(map);const n9=kunxLines(T9,RD).items.filter(x=>!b9.has(x.link));\n  if(n9.length){const P9=rcLines(T9);for(const sd of ['DEFENDER','CHALLENGER']){const nw=n9.filter(x=>x.side===sd);const y=P9.cn[L9[sd]];if(!nw.length||!y)continue;\n   for(const [o,c] of [...map]){if(nrm(c.to)!==nrm(y.raw))continue;map.delete(o);items.push({sid:c.sid,kind:'NOT APPLIED',why:'the change to '+L9[sd]+' newly counts '+nw.map(x=>x.link.replace(sd+' ','')).join(' and ')+' UNEXHIBITED, and K-UNX reads the new count as it reads the first one: '+nw.map(x=>x.link+': '+x.why).join('; ')+'. KEEP leaves the count as it was; a CHANGE must name in the count the layer the block lacks (pkgRCK)',to:String(c.to||''),lines:[o],trial:true});}}}}}\n";
const G0="live:GATE_STATUS[kind]==='LIVE'});";const G1="live:GATE_STATUS[kind]==='LIVE'&&!x.trial,trial:!!x.trial});";
const N0="else if(x.kind==='NOT APPLIED'){const dup=";
const N1="else if(x.kind==='NOT APPLIED'&&(()=>{const g=grpOf(x.gid);return ((R2.R1&&R2.R1.items)||[]).some(z=>z&&z.trial&&g.includes(z.sid));})()){const z=((R2.R1&&R2.R1.items)||[]).find(z=>z&&z.trial&&grpOf(x.gid).includes(z.sid));cured=true;why='TRIAL (pkgRCK, record-only; no seat removed): the count change '+z.sid+' on this line is not applied, so the count stays as first written: '+String(z.why||'').slice(0,300);} /* pkgRCK */\n  "+N0;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);const cnt=(s,a)=>s.split(a).length-1;
let nk=0,na=0;const rep=[];
for(const n of W.nodes){const c=n.parameters&&n.parameters.jsCode;if(typeof c!=='string')continue;let t=c;
 if(t.includes('function kunxLines(')){if(cnt(t,K0)!==1)throw new Error('K0 anchor x'+cnt(t,K0)+' in '+n.name);t=t.replace(K0,()=>K1);nk++;}
 if(t.includes('function sbApply2024(')){for(const [a,b] of [[A0,RCK+A0],[G0,G1],[N0,N1]]){if(cnt(t,a)!==1)throw new Error('anchor x'+cnt(t,a)+' in '+n.name+': '+a.slice(0,40));t=t.replace(a,()=>b);}na++;}
 if(t!==c){rep.push(n.name+' '+sha(c)+' -> '+sha(t));n.parameters.jsCode=t;fs.writeFileSync(path.join(OUT,n.name.replace(/[^A-Za-z0-9]+/g,'_')+'.js'),t);}}
if(nk!==22||na!==6)throw new Error('expected 22 kunxLines and 6 sbApply nodes, got '+nk+'/'+na);
fs.writeFileSync(path.join(OUT,'workflow_RCK.json'),JSON.stringify(W0));
console.log('pkgRCK: '+rep.length+' nodes changed ('+nk+' kunxLines, '+na+' sbApply)');rep.forEach(r=>console.log('  '+r));
