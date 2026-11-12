const fs=require('fs');const w=JSON.parse(fs.readFileSync(__dirname+'/parent_s154_OPC.json','utf8'));
const base=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s154.json','utf8'));
let ok=0,bad=0;const T=(c,m)=>{c?ok++:(bad++,console.log('FAIL',m));};
for(const name of ['Close Enforcer Record','Judge Contradiction Record']){
  const c=w.nodes.find(x=>x.name===name).parameters.jsCode;
  try{new Function('$','$input',c);T(true);}catch(e){T(false,name+' syntax '+e.message);}
  const b=base.nodes.find(x=>x.name===name).parameters.jsCode;
  T(c.replace(/\n  if\(\[row\.earlier_q,row\.closing_q\][^\n]*pkgOPC\)'\);/,'')===b,name+' only change');
}
const c=w.nodes.find(x=>x.name==='Close Enforcer Record').parameters.jsCode;
const g=c.match(/\n  (if\(\[row\.earlier_q,row\.closing_q\][^\n]*pkgOPC\)'\);)/)[1];
const guard=new Function('side','row','f',g+';return f;');
const LN=new Function('return '+c.match(/const LN=(\/.*?\/i);/)[1])();
// stored replay
const rows=JSON.parse(fs.readFileSync(__dirname+'/stored_closecon.json','utf8'));
let conf=0,flip=[];for(const r of rows){const m=r.line.match(LN);if(!m)continue;if(m[4].toUpperCase()!=='CONFIRMED')continue;conf++;const side=m[2].toUpperCase();const f=guard(side,{earlier_q:m[6],closing_q:m[8]},[]);if(f.length)flip.push(r.id+' '+r.rt);}
console.log('stored CONFIRMED parsed',conf,'changed by pkgOPC',flip.length,flip.join(', '));
T(flip.length===1&&flip[0].startsWith('32054'),'stored: only 32054 changes');
// plants
const P=[
 ['CHALLENGER',"The defender's own contradiction: In round 1 ...","OPPONENT'S CONTRADICTIONS: NONE.",1],
 ['CHALLENGER',"I keep C6.","OPPONENT’S CONTRADICTIONS: NONE.",1],
 ['DEFENDER',"The challenger's own contradiction: C2 says ...","OPPONENT'S CONTRADICTIONS: NONE.",1],
 ['DEFENDER',"The challengers contradiction stands","I keep D1.",1],
 ['DEFENDER',"I drop the claim that the feminine pronoun by itself excludes a father.","I keep D1 through D6 as declared.",0],
 ['DEFENDER',"The defender's own contradiction is none.","I keep D1.",0], // own side named: not opponent
 ['CHALLENGER',"I drop the limb that a contradiction exists in Luke.","I keep C1 whole.",0],
 ['DEFENDER',"LINK 2: NARROWED TO: x","Nothing is conceded or narrowed.",0],
 ['CHALLENGER',"OPPONENT'S CONTRADICTION: the defender says X","I keep C2.",1],
];
for(const [s,e,cq,exp] of P){const f=guard(s,{earlier_q:e,closing_q:cq},[]);T((f.length>0)===!!exp,'plant '+s+' | '+e+' | '+cq);}
console.log('PASS',ok,'FAIL',bad);
