// W2 second reading of W3 efficiency items 1-2 (35067): where do the cache-missing requests first differ from the request whose cache they should read?
const fs=require('fs');const X=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/ex35067_full.json','utf8'));const rd=(X.data||X).resultData.runData;
const items=n=>{const r=rd[n]||[];const o=[];for(const x of r)for(const br of (x.data&&x.data.main)||[])for(const it of br||[])o.push(it.json);return o;};
const bodies={};for(const n of Object.keys(rd))items(n).forEach((j,i)=>{const b=j&&(j.body&&j.body.messages?j.body:(j.messages?j:null));if(b)(bodies[n]=bodies[n]||[])[i]=b;});
console.log('nodes with a request body:',Object.keys(bodies).filter(n=>/Panel|Send Back|Synthesis|Verdict|Cure|Diagnostic|Gate|Judge/i.test(n)).map(n=>n+'('+bodies[n].length+')').join(', '));
const ser=b=>JSON.stringify(b.messages);
const firstDiff=(a,b)=>{let i=0;const n=Math.min(a.length,b.length);while(i<n&&a[i]===b[i])i++;return i;};
const desc=(b)=>{const k=Object.keys(b).filter(k=>k!=='messages');return k.map(x=>x+'='+JSON.stringify(b[x]).slice(0,80)).join(' ');};
const show=(la,a,lb,b)=>{const sa=ser(a),sb=ser(b);const d=firstDiff(sa,sb);
 // which message index holds position d in a
 let pos=1,mi=-1;for(let i=0;i<a.messages.length;i++){const s=JSON.stringify(a.messages[i]);if(d<pos+s.length){mi=i;break;}pos+=s.length+1;}
 console.log('--',la,'vs',lb,'| serialized lengths',sa.length,sb.length,'| common prefix',d,'chars | differs inside message',mi,(a.messages[mi]||{}).role,'| at:',JSON.stringify(sa.slice(Math.max(0,d-80),d+60)),' vs ',JSON.stringify(sb.slice(Math.max(0,d-80),d+60)));
 console.log('   params A:',desc(a));console.log('   params B:',desc(b));
 console.log('   cache_control in A messages:',(sa.match(/cache_control/g)||[]).length,'B:',(sb.match(/cache_control/g)||[]).length);};
module.exports={bodies,show,items};
if(require.main===module){
 const pick=(re,i)=>{const n=Object.keys(bodies).find(k=>re.test(k));return n?[n+'#'+i,bodies[n][i]]:[null,null];};
 const P=pick(/^Panel Judges Prep$/,0),SB=pick(/^Send Back Build$/,0);
 const PCn=Object.keys(bodies).filter(k=>/Panel Cure/i.test(k));console.log('Panel Cure body nodes:',PCn.join(', '));
 if(PCn.length){const PC=[PCn[0]+'#0',bodies[PCn[0]][0]];show(P[0],P[1],PC[0],PC[1]);}
 show(P[0],P[1],SB[0],SB[1]);
 const S=Object.keys(bodies).filter(k=>/Synthesis|Verdict|^Cure|Diagnostic/i.test(k));console.log('single judge body nodes:',S.join(', '));
}
if(require.main===module){
 const get=(n,i)=>{const it=items(n)[i||0];return it&&it.cure&&it.cure.body;};
 const SBb=bodies['Send Back Build'];
 for(let k=1;k<=3;k++){const cb=get('Panel Cure Build '+k);if(!cb){console.log('no cure body',k);continue;}
  const roles=cb.messages.map(m=>m.role+':'+(typeof m.content==='string'?'str '+m.content.length:'arr '+JSON.stringify(m.content).length+(JSON.stringify(m.content).includes('cache_control')?' +cc':''))).join(' | ');
  console.log('Panel Cure Build',k,'model',cb.model,'| messages:',roles);
  const sb=SBb.find(b=>b.model===cb.model);if(sb)show('Send Back Build ('+sb.model+')',sb,'Panel Cure Build '+k,cb);
  const pj=bodies['Panel Judges Prep'].find(b=>b.model===cb.model);if(pj)show('Panel Judges Prep ('+pj.model+')',pj,'Panel Cure Build '+k,cb);}
 for(const n of ['Synthesis Judge Route','Verdict Judge Route','Cure Build','Diagnostic Judge Route','Synthesis Build','Verdict Build','Diagnostic Build']){const it=items(n)[0];if(!it){console.log('no node',n);continue;}const b=(it.cure&&it.cure.body)||it.body||it;console.log(n,'keys',Object.keys(it).slice(0,8).join(','),'| body messages:',b.messages?b.messages.map(m=>m.role+':'+(typeof m.content==='string'?'str '+m.content.length:'arr')).join(' | '):'none',b.model||'');}
}
