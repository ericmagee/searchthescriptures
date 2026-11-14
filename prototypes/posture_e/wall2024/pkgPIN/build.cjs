// ASK 298 pkgPIN: C2B Build (the one-time resend of the challenger's round 2, today used for barred moves) also checks each PROVEN IN [<round>] in the premise list; a press whose named round does not name its verse sends the round back once (joined with the barred-moves note when both fire).
const fs=require('fs');const [, , fin, fout]=process.argv;const W=JSON.parse(fs.readFileSync(fin,'utf8'));if(W.id!=='moMxiV4Irg1uRBZN')throw new Error('wrong workflow');
const N=W.nodes.filter(n=>n.name==='C2B Build');if(N.length!==1)throw new Error('node');let c=N[0].parameters.jsCode;const n0=c.length;if(c.includes('pkgPIN'))throw new Error('already');
const rep=(a,b)=>{if(c.split(a).length!==2)throw new Error('anchor: '+a.slice(0,60));c=c.replace(a,()=>b);};
rep("\nconst __RD=(own)=>","\n"+fs.readFileSync(__dirname+'/pin.js','utf8').trim()+"\nconst __RD=(own)=>");
rep("if(!c.applies)return pass('no round text',c);if(c.pass)return pass(","let __pin=[];try{__pin=PIN.check(X.raw,'DR2',__RD(X.raw));}catch(e){__pin=[];} /* pkgPIN, ASK 298 */\nif(!c.applies)return pass('no round text',c);if(c.pass&&!__pin.length)return pass(");
rep("const note=BAR.note(c);","const note=[c.pass?null:BAR.note(c),__pin.length?PIN.note(__pin):null].filter(Boolean).join('\\n\\n')+(c.pass?'\\nReturn the whole round; this is the only request of its kind.':''); /* pkgPIN */");
rep("why:c.hits.length+' barred sentence(s)',note,bar_check:c,","why:[c.hits.length?c.hits.length+' barred sentence(s)':null,__pin.length?__pin.length+' PROVEN IN round(s) that do not name the verse (pkgPIN)':null].filter(Boolean).join('; '),note,bar_check:c,pin_check:__pin,");
N[0].parameters.jsCode=c;fs.writeFileSync(fout,JSON.stringify(W));console.log('C2B Build',n0,'->',c.length);
