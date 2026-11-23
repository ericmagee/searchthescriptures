// pkgBFX C1/C2 replay (W1): the range test of index 466 run with the live lbBlockText (live index 767) and with the target bfx544Block (target index 3566),
// both taken from the workflow files, on the defender round 3 (CR3 = engine_r3) of 41090 and 41736. Function-level replay of the range test only.
const fs=require('fs');const D=__dirname;const lib=f=>{const T=JSON.parse(fs.readFileSync(D+'/'+f)).nodes.find(n=>n.name==='Shared Library').parameters.jsCode;return JSON.parse(T.slice(T.indexOf('\n/*LIB*/')+8,T.lastIndexOf('\n/*MAP*/')));};
const LL=lib('live_moMxiV4Irg1uRBZN.json'),LT=lib('target_engine_bfx.json');
const OLD=new Function(LL[767]+';return lbBlockText;')();const NEW=new Function(LT[3566].replace(/ \/\*[^]*\*\/$/,'')+';return bfx544Block;')();
const range=(blk,r,j)=>{if(blk(r,j))return null;let mx=0;for(let q=1;q<j;q++)if(blk(r,q))mx=q;return mx&&j>mx?'RANGE premises 1 to '+mx:null;};
const R={41090:fs.readFileSync(D+'/cr3_41090.txt','utf8'),41736:fs.readFileSync(D+'/cr3_41736.txt','utf8')};
const out=[];
const C1=[[41090,5,'1251 sol62; 1252 chatgpt; rows 47895, 47903, 47915'],[41090,6,'1251 sol62; rows 47896, 47916'],[41736,6,'1266 sol62; 1267 chatgpt; rows 51726, 51739, 52062']];
let n=0;for(const [run,j,who] of C1){const o=range(OLD,R[run],j),t=range(NEW,R[run],j);if(t)n++;out.push('C1 '+run+' DEFENDER premise '+j+' ('+who+'): live '+(o||'no item')+' | target '+(t||'no item'));}
out.push((n===0?'PASS':'FAIL')+' C1: '+n+' RANGE items remain on the stored population');
const p=range(NEW,R[41736],7),po=range(OLD,R[41736],7);out.push('C2 plant 41736 DEFENDER premise 7: live '+(po||'no item')+' | target '+(p||'no item'));
out.push((p==='RANGE premises 1 to 6'?'PASS':'FAIL')+' C2: target raises "premises 1 to 6"');
for(const run of [41090,41736]){const h=[];for(let q=1;q<=8;q++)h.push(q+':'+(NEW(R[run],q).split('\n')[0].slice(0,40)||'-'));out.push('target blocks '+run+': '+h.join(' | '));}
fs.writeFileSync(D+'/out_replay_bfx.txt',out.join('\n')+'\n');console.log(out.join('\n'));
