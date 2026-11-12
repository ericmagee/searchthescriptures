// W2 grade of W1's pkgMSO: diff s151 vs package, then run the guard line alone (as built into the Merge Seat source) on cases.
const fs=require('fs');const L=f=>JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+f,'utf8'));const A=L('fetchback_live_s151.json'),B=L('parent_s151_MSO.json');
const src=(W,e)=>{const T=W.nodes.find(z=>z.name==='Shared Library').parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');const Lb=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));return M[e].p.map(x=>typeof x==='number'?Lb[x]:typeof x[0]==='string'?x[0]:Lb.slice(x[0],x[1]+1).join('\n')).join('\n');};
const dn=A.nodes.filter(n=>JSON.stringify(n)!==JSON.stringify(B.nodes.find(m=>m.name===n.name))).map(n=>n.name);console.log('nodes',A.nodes.length,B.nodes.length,'differ:',dn.join(', '),'| connections equal:',JSON.stringify(A.connections)===JSON.stringify(B.connections));
console.log('Shared Library size',A.nodes.find(z=>z.name==='Shared Library').parameters.jsCode.length,'->',B.nodes.find(z=>z.name==='Shared Library').parameters.jsCode.length);
for(const e of ['Alternate Merge Seat','R2 Alternate Merge Seat']){const x=src(A,e),y=src(B,e);let i=0;while(x[i]===y[i])i++;let j=0;while(x[x.length-1-j]===y[y.length-1-j])j++;console.log(e,x.length,'->',y.length,'(+'+(y.length-x.length)+') inserted:',JSON.stringify(y.slice(i,y.length-j)).slice(0,160)+'...');}
const S=src(B,'Alternate Merge Seat');const g0=S.indexOf("try{if($('Alternate Cure Normalize').isExecuted)");const g1=S.indexOf('/* pkgMSO',g0);const G=S.slice(g0,g1);
const it=(k,f)=>({json:{cure:{who:'alternate',k},...(f?{fum:{}}:{}),reply:{}}});
const guard=(runs,input)=>{const $=n=>({isExecuted:runs.length>0,all:(o,r)=>{if(r>=runs.length)throw new Error('no run');return runs[r];}});return new Function('$','$input',G+'\nreturn "GO";')($,{all:()=>input});};
const T=(id,runs,input,want)=>{const r=guard(runs,input);console.log((r===want||(want==='STOP'&&Array.isArray(r)&&!r.length)?'OK  ':'BAD ')+id+' -> '+(Array.isArray(r)?'STOP':r));};
const r0=[it(0,true),it(1,false)],r1=[it(0,false)];
T('G1 split: grok(k0) delivery from run 1',[r0,r1],r1,'GO');
T('G2 split: argon(k1) delivery from run 0, after run 1',[r0,r1],[it(1,false)],'STOP');
T('G3 split: argon delivered before grok follow-up ran',[r0],[it(1,false)],'STOP');
T('G4 no split, one delivery holding both',[[it(0,false),it(1,false)]],[it(0,false),it(1,false)],'GO');
T('G5 one alternate, with follow-up (34852 shape)',[[it(0,true)],[it(0,false)]],[it(0,false)],'GO');
T('G6 both need follow-up, one delivery from run 1',[[it(0,true),it(1,true)],[it(0,false),it(1,false)]],[it(0,false),it(1,false)],'GO');
T('G7 skip item (no k)',[[{json:{cure:{who:'alternate',skip:'x'}}}]],[{json:{cure:{who:'alternate',skip:'x'}}}],'GO');
T('G8 Normalize not run',[],[it(0,false)],'GO');
T('G9 RISK: run-1 item keyed to the wrong alternate (itemMatching fallback)',[r0,[it(1,false)]],[it(1,false)],'GO');
