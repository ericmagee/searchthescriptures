// Inventory of line-reader regex literals in the current stack (pkgKS nodes, pkgCL's 6 gate nodes on top).
const fs=require('fs');const dir='pkgKS/patched/';const over={};for(const f of fs.readdirSync('pkgCL/patched'))over[f]='pkgCL/patched/'+f;
const re=/\/(?:\\.|\[[^\]\n]*\]|[^\/\n\\\[])+\/[gimsuy]*/g;
const kinds={COLLISION:/D\\d\+\\s[\*\+]+(?:VS|vs)/i,FORCED:/FORCED/,ANSWERCHECK:/ANSWER CHECK/,KEYSTONE:/KEYSTONE/,CORRECTED:/CORRECTED RESULT/,CONCEDED:/CONCEDED LINKS/,STANDING:/STANDING/,RETRACTED:/RETRACTED/,RESULT:/\^\\s\*RESULT|RESULT\\s\*:/};
const out={};
for(const f of fs.readdirSync(dir).sort()){const s=fs.readFileSync(over[f]||dir+f,'utf8');let m;re.lastIndex=0;
 while((m=re.exec(s))){const r=m[0];if(r.length<14)continue;for(const k in kinds){if(!kinds[k].test(r))continue;
  const before=s.slice(0,m.index);const fn=(before.match(/(?:function\s+([A-Za-z0-9_$]+)|const\s+([A-Za-z0-9_$]+)\s*=)(?![\s\S]*(?:function\s+[A-Za-z0-9_$]+|const\s+[A-Za-z0-9_$]+\s*=))/)||[]);
  const name=(before.match(/function\s+([A-Za-z0-9_$]+)[^\n]*$/m)||[])[1];const fnm=[...before.matchAll(/function\s+([A-Za-z0-9_$]+)\s*\(/g)].pop();
  (out[k]=out[k]||{});(out[k][r]=out[k][r]||new Set()).add(f.replace('.js','')+':'+(fnm?fnm[1]:'top'));}}}
for(const k in out){console.log('### '+k+' ('+Object.keys(out[k]).length+' distinct)');for(const [r,w] of Object.entries(out[k]))console.log('  '+r.slice(0,260)+'\n     in '+[...w].slice(0,6).join(', ')+(w.size>6?' (+'+(w.size-6)+')':''));}
