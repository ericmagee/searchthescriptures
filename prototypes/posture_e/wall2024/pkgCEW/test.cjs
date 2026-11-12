// W2 pkgCEW check: the PROMPT literal of each builder, live against new, is the same text with only the four sentences inserted
// after the NOT list, once; nothing else in the node changes. Usage: node pkgCEW/test.cjs <live json> <new json>
const fs=require('fs');const g=f=>{let d=JSON.parse(fs.readFileSync(f,'utf8'));d=d.data||d;return d.workflow||d;};
const [L,K]=process.argv.slice(2,4).map(g);let ok=0,n=0;const T=(nm,c)=>{n++;if(c)ok++;console.log((c?'OK   ':'FAIL ')+nm);};
const lit=s=>{const i=s.indexOf('const PROMPT="');let j=i+14;while(!(s[j]==='"'&&s[j-1]!=='\\'))j++;return JSON.parse(s.slice(i+13,j+1));};
for(const nm of ['Close Enforcer Build','Judge Contradiction Build']){const a=L.nodes.find(x=>x.name===nm).parameters.jsCode,b=K.nodes.find(x=>x.name===nm).parameters.jsCode;
 const pa=lit(a),pb=lit(b);const k=pa.indexOf('or differs only in wording.\n')+'or differs only in wording.\n'.length;const ins=pb.slice(k,k+pb.length-pa.length);
 T(nm+': PROMPT is live PROMPT plus one insert after the NOT list ('+ins.length+' characters)',pb===pa.slice(0,k)+ins+pa.slice(k)&&/^Read a withdrawal by its meaning/.test(ins)&&ins.endsWith('left open does not.\n'));
 T(nm+': code outside PROMPT unchanged',a.replace(JSON.stringify(pa).slice(1,-1),'')===b.replace(JSON.stringify(pb).slice(1,-1),'')||a.split('const PROMPT=')[0]===b.split('const PROMPT=')[0]);
 T(nm+': insert holds the scope clause of ASK 144 option 2 ("same link or the same purpose"; "a purpose the withdrawal left open does not")',/same link or the same purpose/.test(ins)&&/a purpose the withdrawal left open does not/.test(ins));
 T(nm+': the kept-part carve-out is present',/states only what the debater kept, or rests the same conclusion on other rows, does not assert it again/.test(ins));}
const m=new Map(L.nodes.map(x=>[x.name,JSON.stringify(x)]));const dn=K.nodes.filter(x=>m.get(x.name)!==JSON.stringify(x)).map(x=>x.name);
T('mapcheck: only the two builders differ ('+dn.join(', ')+'); connections equal',dn.length===2&&JSON.stringify(L.connections)===JSON.stringify(K.connections));
console.log('checks '+ok+' of '+n);
