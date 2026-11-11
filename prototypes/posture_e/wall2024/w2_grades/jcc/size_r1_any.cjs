// W2: measure R1 and R3 wording in the two Build nodes of live s116 (no build, no file written to the shared folder)
const fs=require('fs');const w=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/'+(process.argv[2]||'fetchback_live_s116.json')+''));const W=(w.data||w).workflow||(w.data||w);
const R1=" Read each sentence within its own block, as that block narrowed or granted it; a contradiction must stand between the two sentences' own words, not between words your reason adds.";
const R3=", or holds again, on its rows, what the side dropped only as a bare statement";
for(const nm of ['Judge Contradiction Build','Close Enforcer Build']){const s=W.nodes.find(n=>n.name==nm).parameters.jsCode;const k='or differs only in wording.';const i=s.indexOf(k);
 const q=s.lastIndexOf('`',i)>s.lastIndexOf("'",i)?'`':s[s.lastIndexOf("'",i)]; // which string delimiter encloses
 const esc=t=>q==="'"?t.replace(/'/g,"\\'"):t;
 const r1=s.slice(0,i+k.length)+esc(R1)+s.slice(i+k.length);const r3=s.slice(0,i)+'or differs only in wording'+esc(R3)+'.'+s.slice(i+k.length);const r13=r3.slice(0,r3.indexOf(k.slice(0,-1)+esc(R3)+'.')+(k.slice(0,-1)+esc(R3)+'.').length)+esc(R1)+r3.slice(r3.indexOf(k.slice(0,-1)+esc(R3)+'.')+(k.slice(0,-1)+esc(R3)+'.').length);
 let ok=[r1,r3,r13].map(x=>{try{new Function('$','$input','return (async()=>{\n'+x+'\n})');return 'parses'}catch(e){return 'ERR '+e.message}});
 console.log(nm,'| count of the anchor:',s.split(k).length-1,'| delimiter',q,'| code delta R1',r1.length-s.length,'R3',r3.length-s.length,'R1+R3',r13.length-s.length,'|',ok.join(','));}
console.log('DeepSeek-read text: R1 +'+R1.length+' per node; R3 +'+R3.length+' per node');
