// ASK 444 A2 (W4): remove every comment from Alternate Build and Early Alternate Build; code tokens unchanged.
// A comment that names a model setting (reasoning, max_tokens, temperature, effort, thinking) is KEPT: the writer's reasoning guard needs the operator's words to touch such text.
// Usage: node build444a2.cjs IN.json OUT.json   (C2 printed: tokens equal, comments after, $() names equal, rebuilt source equal)
const fs=require('fs'),path=require('path');const acorn=require(path.join(__dirname,'../tools/node_modules/acorn'));
const [IN,OUT]=process.argv.slice(2);let w=JSON.parse(fs.readFileSync(IN));w=w.data&&w.data.nodes?w.data:w;
const wrap=c=>'async function VmCodeWrapper() { '+c+' }';const OFF='async function VmCodeWrapper() { '.length;
const parse=c=>{const cm=[],tk=[];acorn.parse(wrap(c),{ecmaVersion:2025,sourceType:'module',onComment:(b,t,s,e)=>{if(!/reasoning|max_tokens|temperature|effort|thinking/i.test(t))cm.push([s-OFF,e-OFF]);},onToken:t=>tk.push(t.type.label+'|'+(t.value===undefined?'':String(t.value)))});return {cm,tk};};
const names=c=>{const s=new Set();for(const m of c.matchAll(/\$\((["'])([^"']+)\1\)/g))s.add(m[2]);return [...s].sort().join(',');};
const LIB=w.nodes.find(n=>n.name==='Shared Library').parameters.jsCode;
const rebuilt=c=>{const i=c.search(/(?:const|let) __R0=/);const head=c.slice(0,i)+'\nreturn __S;';return new Function('$',head.replace(/^if\(false\)\{[^\n]*\}/m,''))(n=>({params:{jsCode:LIB}}));};
for(const nm of ['Alternate Build','Early Alternate Build']){const x=w.nodes.find(n=>n.name===nm);const c=x.parameters.jsCode;const A=parse(c);
 let out=c;for(const [s,e] of A.cm.slice().reverse()){let a=s,b=e;while(a>0&&(out[a-1]===' '||out[a-1]==='\t'))a--;
  if((a===0||out[a-1]==='\n')&&out[b]==='\n')b++;out=out.slice(0,a)+out.slice(b);}
 const B=parse(out);const r0=rebuilt(c),r1=rebuilt(out);
 console.log(nm,'| removable comments before',A.cm.length,'after',B.cm.length,'| tokens equal',JSON.stringify(A.tk)===JSON.stringify(B.tk),A.tk.length,
  '| $() names equal',names(c)===names(out),'| rebuilt source equal',r0===r1,r0.length,'| chars',c.length,'->',out.length);
 if(B.cm.length||JSON.stringify(A.tk)!==JSON.stringify(B.tk)||names(c)!==names(out)||r0!==r1)throw new Error('REFUSE '+nm);x.parameters.jsCode=out;}
fs.writeFileSync(OUT,JSON.stringify(w));
