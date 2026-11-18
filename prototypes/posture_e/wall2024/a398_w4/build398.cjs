// ASK 398 build (Eric ruling 11-18, option 1: "Count it as graded everywhere"): the ASK 394 site 8 grade list (GRADED1) gains STANDS,
// so a "D<i> vs C<j>: STANDS" line counts as graded there too, as at sites 6 and 10. Shared Library only, one line. Offline.
// Usage: node build398.cjs IN OUT
const fs=require('fs'),cr=require('crypto'),acorn=require('../tools/node_modules/acorn');const T=require('../tools/lib.cjs');
const [IN,OUT]=process.argv.slice(2);let d=JSON.parse(fs.readFileSync(IN));if(d.data&&d.data.nodes)d=d.data;
const U=T.unpack(d);const L=U.L,M=U.M;
const OLD="const c=ri6Col2024(x,/(?!)/,['DEFENDER LINK BROKEN','CHALLENGER LINK BROKEN','UNDERDETERMINED']);if(c&&String(c[1]).toUpperCase()==='D'+n)return [c[0],c[3]];";
const NEW="const c=ri6Col2024(x,/(?!)/,['DEFENDER LINK BROKEN','CHALLENGER LINK BROKEN','UNDERDETERMINED','STANDS']);if(c&&String(c[1]).toUpperCase()==='D'+n)return [c[0],c[3]];";
const CM="/* ASK 394 site 8: a graded Dn vs C<j> line, line by line, §8 grades; [1] is the grade, as the old capture group */";
const CM2="/* ASK 394 site 8: a graded Dn vs C<j> line, line by line, §8 grades; [1] is the grade, as the old capture group; ASK 398: STANDS counts as graded (Eric ruling 11-18, option 1) */";
const hit=[];L.forEach((x,i)=>{if(x.split(OLD).length===2&&x.split(CM).length===2)hit.push(i);});
if(hit.length!==1)throw new Error('site 8 found '+JSON.stringify(hit));const li=hit[0];L[li]=L[li].replace(OLD,()=>NEW).replace(CM,()=>CM2);
const ch=[];for(const k of Object.keys(M)){const n2=T.rb(L,M[k]).length;if(n2!==M[k].n){ch.push(k);M[k].n=n2;}}
const LJ=JSON.stringify(L);const lsha=cr.createHash('sha256').update(LJ).digest('hex').slice(0,16);
const h2=U.hdr.replace(/library sha [0-9a-f]{16}, (\d+) lines/,()=>'library sha '+lsha+', '+L.length+' lines');if(h2===U.hdr)throw new Error('hdr');
d.nodes.find(n=>n.name==='Shared Library').parameters.jsCode=h2+'\n/*LIB*/'+LJ+'\n/*MAP*/'+JSON.stringify(M)+U.tail;
const P=s=>acorn.parse(s,{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});for(const k of Object.keys(M))P(T.rb(L,M[k]));
fs.writeFileSync(OUT,JSON.stringify(d));console.log('site 8 L'+li,'| MAP lengths changed',ch.length,ch.join(', '),'| lib sha',lsha);
