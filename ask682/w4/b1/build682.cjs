// ASK 682 build b1 rev 2: remove the floor's clause-search actor fallback in all 4 copies.
// D4 Build, Panel Build, Build Independent Verdict: plain text. Shared Library: LIB line 64, then each MAP entry's n and the header sha are recomputed (Library Check, ASK 422a).
const fs=require('fs');const crypto=require('crypto');const md5=s=>crypto.createHash('md5').update(s).digest('hex');const sha=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
const W=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const plain=fs.readFileSync(__dirname+'/../floor_old_fallback.txt','utf8');
const MARK='/* ASK 682: no clause-search actor (a mind-verb claim is read only when the person stands in the two words before the verb) */';
const rep=[];
for(const name of ['D4 Build','Panel Build','Build Independent Verdict']){const n=W.nodes.find(x=>x.name===name);const s=n.parameters.jsCode;const t=s.split(plain).join(MARK);
 rep.push({node:name,hits:s.split(plain).length-1,left:t.split(plain).length-1,before:md5(s),after:md5(t)});n.parameters.jsCode=t;try{new Function('$','$input','$json',t);rep[rep.length-1].parses=true;}catch(e){rep[rep.length-1].parses=String(e);}}
{const n=W.nodes.find(x=>x.name==='Shared Library');const T=n.parameters.jsCode;const a=T.indexOf('\n/*LIB*/'),b=T.lastIndexOf('\n/*MAP*/'),c=T.lastIndexOf('\n/*END*/');
 const L=JSON.parse(T.slice(a+8,b)),M=JSON.parse(T.slice(b+8,c));const build=(L,M,k)=>M[k].p.map(e=>typeof e==='number'?L[e]:typeof e[0]==='string'?e[0]:L.slice(e[0],e[1]+1).join('\n')).join('\n');
 for(const k of Object.keys(M)){const S=build(L,M,k);if(S.length!==M[k].n)throw new Error('base MAP '+k+' n mismatch');}
 const idx=L.map((l,i)=>l.includes(plain)?i:-1).filter(i=>i>=0);const L2=L.map(l=>l.split(plain).join(MARK));const M2=JSON.parse(JSON.stringify(M));const changed=[];
 for(const k of Object.keys(M2)){const S=build(L2,M2,k);if(S.length!==M2[k].n){changed.push(k);M2[k].n=S.length;}if(S.includes(plain))throw new Error('left in '+k);try{new Function('$','$input','$json','$node',S);}catch(e){throw new Error('parse '+k+': '+e.message);}}
 const libJson=JSON.stringify(L2);const oldSha=(T.match(/library sha ([0-9a-f]{16})/)||[])[1];const baseSha=sha(JSON.stringify(L)).slice(0,16);const newSha=sha(libJson).slice(0,16);
 let head=T.slice(0,a).replace('library sha '+oldSha,'library sha '+newSha);const T2=head+'\n/*LIB*/'+libJson+'\n/*MAP*/'+JSON.stringify(M2)+'\n/*END*/'+T.slice(c+8);
 const plainLeft=T2.split(plain).length-1,escLeft=T2.split(JSON.stringify(plain).slice(1,-1)).length-1;
 rep.push({node:'Shared Library',lib_lines:idx,map_entries_n_changed:changed.length,header_sha_old:oldSha,base_sha_recomputed:baseSha,header_sha_new:newSha,left_plain:plainLeft,left_escaped:escLeft,before:md5(T),after:md5(T2),len_before:T.length,len_after:T2.length,map_tail_same:T.slice(c)===T2.slice(T2.lastIndexOf('\n/*END*/'))});n.parameters.jsCode=T2;}
const others=W.nodes.filter(n=>!['D4 Build','Panel Build','Build Independent Verdict','Shared Library'].includes(n.name)).filter(n=>{const s=JSON.stringify(n.parameters);return s.includes(plain)||s.includes(JSON.stringify(plain).slice(1,-1));}).map(n=>n.name);
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log(JSON.stringify({rep,other_nodes_with_fallback:others,target_md5:md5(fs.readFileSync(process.argv[3],'utf8'))},null,1));
