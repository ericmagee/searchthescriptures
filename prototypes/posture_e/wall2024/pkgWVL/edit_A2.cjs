module.exports=s=>{const R=(a,b)=>{const k=s.split(a).length-1;if(k!==1)throw 'anchor x'+k+': '+a;s=s.replace(a,()=>b);};
R("if(!W.length)continue;let hd='?';","if(!W.length)continue;for(const ps of [0,1]){let hd='?';");
R("let hit=null;for(const cl of ","let hit=null;if(!ps)for(const cl of ");
R("if(!hit)continue;const cq=","if(!hit&&ps&&j===0){const lt=ss[0].match(new RegExp('^\\\\[L\\\\d\\\\]\\\\s+('+LIST+')\\\\s*:(?!\\\\d)')),n0=(ss[0].match(own)||[])[1]||hd;if(lt&&find(w,lt[1])>=0&&!out.some(c=>c.side===sd&&c.n===n0&&c.why.includes('] withdrew '+w.ref+' or')))hit=ss[0];} /* pkgWVL: second pass; a layer row \"[L3] <verses>:\" of the close names the verse as a layer of the link, unless that verse and link are already named */ if(!hit)continue;const cq=");
R("break;}}}}\n return out;","break;}}}}}\n return out;");return s;};
