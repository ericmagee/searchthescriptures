// ASK 562 draft 3 build (W1): node build581.cjs <base_engine> <base_child> <out_engine> <out_child>
// Applies edits581.cjs to the three LAY lines of the Shared Library LIB (both copies), recomputes MAP n for every entry over a changed line, resets the sha header. No LIB line is added; no node other than the two Shared Libraries changes.
const fs=require('fs'),cr=require('crypto');const {edits}=require(__dirname+'/edits562.cjs');const [BE,BC,OE,OC]=process.argv.slice(2);
const rebuild=(L,e)=>e.p.map(x=>typeof x==='number'?L[x]:typeof x[0]==='string'?x[0]:L.slice(x[0],x[1]+1).join('\n')).join('\n');
const covers=(e,i)=>e.p.some(x=>typeof x==='number'?x===i:typeof x[0]==='number'&&i>=x[0]&&i<=x[1]);
function patch(w){const n=w.nodes.find(x=>x.name==='Shared Library');const c=n.parameters.jsCode;const a=c.indexOf('\n/*LIB*/'),b=c.lastIndexOf('\n/*MAP*/'),e=c.lastIndexOf('\n/*END*/');
 const L=JSON.parse(c.slice(a+8,b));const M=JSON.parse(c.slice(b+8,e));const lay=M.LAY;if(!lay||JSON.stringify(lay.p)!=='[[3499,3557]]')throw new Error('LAY map is not [[3499,3557]]: '+JSON.stringify(lay&&lay.p));
 for(const [k,ents] of Object.entries(M))if(ents&&ents.p&&rebuild(L,ents).length!==ents.n)throw new Error('MAP '+k+' n mismatch before the change');
 const changed=[];for(const [,o,nw] of edits){const hits=[];for(let j=3499;j<=3557;j++){const k=L[j].split(o).length-1;if(k)hits.push([j,k]);}if(hits.length!==1||hits[0][1]!==1)throw new Error('old text is not once in LIB 3499-3557: '+JSON.stringify(hits));const li=hits[0][0];if(L.some((x,j)=>(j<3499||j>3557)&&x.includes(o)))throw new Error('old text also outside LAY');L[li]=L[li].replace(o,()=>nw);changed.push(li);}
 const mapChanged=[];for(const [k,ents] of Object.entries(M))if(ents&&ents.p&&changed.some(i=>covers(ents,i))){const nn=rebuild(L,ents).length;mapChanged.push(k+' '+ents.n+'->'+nn);ents.n=nn;}
 const sha=cr.createHash('sha256').update(JSON.stringify(L)).digest('hex').slice(0,16);
 const head=c.slice(0,a).replace(/library sha [0-9a-f]{16}, \d+ lines/,'library sha '+sha+', '+L.length+' lines');
 n.parameters.jsCode=head+'\n/*LIB*/'+JSON.stringify(L)+'\n/*MAP*/'+JSON.stringify(M)+c.slice(e);return {sha,lines:L.length,changed,mapChanged,len:[c.length,n.parameters.jsCode.length]};}
const E=JSON.parse(fs.readFileSync(BE)),C=JSON.parse(fs.readFileSync(BC));const re=patch(E),rc=patch(C);
fs.writeFileSync(OE,JSON.stringify(E));fs.writeFileSync(OC,JSON.stringify(C));console.log('engine',JSON.stringify(re));console.log('child',JSON.stringify(rc));
