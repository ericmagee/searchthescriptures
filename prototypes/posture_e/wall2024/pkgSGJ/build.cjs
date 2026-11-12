const fs=require('fs'),crypto=require('crypto');
const base=process.argv[2],out=process.argv[3];
const w=JSON.parse(fs.readFileSync(base));
const OLD="const ss=t.slice(m.index).split(/(?<=[.!?])[\"')\\]]?\\s|\\n/);let s=ss[0];if(s.split(/\\s+/).length<7&&ss[1])s=s+' '+ss[1];";
// pkgSGJ: the grant sentence starts at its own sentence start in the line (lead kept, at most 160 chars, cut at a word), and a short grant is joined only to the next sentence of the SAME line.
const NEW="let __ld=bf.replace(/^[\\s>*#-]*(?:\\[[A-Za-z]{1,3}\\d*\\][\\s:]*)*/,'');{const __b=[...__ld.matchAll(/[.!?][\"')\\]]?\\s+/g)];if(__b.length){const __e=__b[__b.length-1];__ld=__ld.slice(__e.index+__e[0].length);}if(__ld.length>160){__ld=__ld.slice(-160);__ld=__ld.slice(__ld.indexOf(' ')+1);}}/*pkgSGJ*/const ss=ln.slice(m.index-ls).split(/(?<=[.!?])[\"')\\]]?\\s/);let s=__ld+ss[0];if(s.split(/\\s+/).length<7&&ss[1])s=s+' '+ss[1];if(/^what i (?:grant|withdraw|concede|drop)(?: and what i (?:grant|withdraw|concede|drop))?$/.test(W(s)))continue;";
const names=["C4 Build","C4 Extract","C4G Extract","C4B Extract"];let d=0;
for(const nm of names){const n=w.nodes.find(x=>x.name===nm);const c=n.parameters.jsCode;if(c.split(OLD).length!==2)throw nm+' anchor';n.parameters.jsCode=c.replace(OLD,()=>NEW);d+=n.parameters.jsCode.length-c.length;}
fs.writeFileSync(out,JSON.stringify(w));
console.log('delta per node',(NEW.length-OLD.length),'total',d,'sha',crypto.createHash('sha256').update(fs.readFileSync(out)).digest('hex').slice(0,16));
