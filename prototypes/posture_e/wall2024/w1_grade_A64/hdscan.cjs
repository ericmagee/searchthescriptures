// Lines in stored round texts that the A1N header test reads as a LINK header: true headers vs prose lines.
const fs=require('fs');const P='/mnt/project-files/wall2024/';const hd=l=>(l.match(/^[\s>*#_-]*LINK\s+(\d+)\b/i)||[])[1];
let tru=0,pro=0;const ex=[];
for(const e of fs.readdirSync(P).filter(x=>/^ex\d+_full\.json$/.test(x))){const s=fs.readFileSync(P+e,'utf8');const seen=new Set();
 // round texts live in many node outputs; take unique long strings that carry LINK headers
 JSON.parse(s,(k,v)=>{if(typeof v==='string'&&v.length>2000&&/^[\s>*#_-]*LINK\s+\d+/im.test(v)&&!seen.has(v)){seen.add(v);}return v;});
 const lines=new Set();for(const v of seen)for(const l of v.split('\n'))if(hd(l)!==undefined)lines.add(l.trim());
 for(const l of lines){if(/^[\s>*#_-]*LINK\s+\d+\s*(\*\*)?\s*[:.(—-]|^[\s>*#_-]*LINK\s+\d+\s*$/i.test(l)||/^[#*\s]*LINK\s+\d+\s*[:—-]/i.test(l)||/^#+\s*LINK/i.test(l)||/^\*\*LINK\s+\d+[^*]*\*\*/i.test(l))tru++;else{pro++;if(ex.length<25)ex.push(e+' | '+l.slice(0,140));}}}
console.log('header-like lines: header form',tru,'prose form',pro);console.log(ex.join('\n'));
