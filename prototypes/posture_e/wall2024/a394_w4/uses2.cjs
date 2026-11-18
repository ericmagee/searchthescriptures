// for a stub node, find uses of a name after its definition text, within the enclosing block (brace depth)
const fs=require('fs');const {unpack,rb}=require('../tools/lib.cjs');const w=JSON.parse(fs.readFileSync(__dirname+'/../rdf/fetchback_s262.json'));const {L,M}=unpack(w);
const [node,name,defSnip]=process.argv.slice(2);const s=M[node]?rb(L,M[node]):w.nodes.find(n=>n.name===node).parameters.jsCode;
let at=0;const out=[];while((at=s.indexOf(defSnip,at))>=0){let d=0,i=at;// scan forward to end of enclosing block
 for(i=at;i<s.length;i++){const ch=s[i];if(ch==='{')d++;else if(ch==='}'){d--;if(d<0)break;}}
 const blk=s.slice(at,i);const re=new RegExp('(?<![\\w$.])'+name.replace(/\$/g,'\\$')+'(?![\\w$])','g');let n=0;
 for(const m of blk.matchAll(re)){if(m.index<defSnip.length)continue;n++;out.push('  +'+m.index+': '+blk.slice(Math.max(0,m.index-300),m.index+300).replace(/\n/g,' '));}
 console.log('== '+node+' def @'+at+' block len '+blk.length+' uses '+n);at+=defSnip.length;}
console.log(out.join('\n'));
