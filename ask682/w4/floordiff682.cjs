// ASK 682: compare the live floor with candidate A (no clause-search actor: the person must stand right before the mind verb)
const fs=require('fs');const src=fs.readFileSync(__dirname+'/d4build_66ba992d.js','utf8');const oldFb=fs.readFileSync(__dirname+'/floor_old_fallback.txt','utf8');
const mk=code=>{const a=code.indexOf('const PRS=(()=>{');const b=code.indexOf('const RND=F=>',a);const body=code.slice(a+16,b);
 const REFP={keys:(t)=>[...String(t).matchAll(/((?:[1-3] )?[A-Z][a-z]+) (\d+):(\d+)/g)].map(m=>({key:m[1]+' '+m[2]+':'+m[3],pos:m.index}))};
 return new Function('REFP','lbFoot',body+'\nreturn {parse,entries,classify};')(REFP,()=>[]);};
const OLD=mk(src),NEW=mk(src.replace(oldFb,'/* ASK 682: no clause-search actor */'));
const rows=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));let n=0,diff=0;
for(const r of rows){for(const k of ['cr1','cr2','cr3','dr1','dr2','dr3']){const t=String(r[k]||'');
 for(const seg of t.split(/PRESSED WITH\s*:/i).slice(1)){const s=seg.split(/\n\s*\n|\n\s*\d+\.\s+LINK/)[0];
  for(const e of OLD.entries(s)){n++;const a=OLD.classify(e,{},'DR2',null),b=NEW.classify(NEW.parse(e.text),{},'DR2',null);
   if(a.cls!==b.cls){diff++;console.log('DIFF',r.id.slice(0,8),k,e.ref,a.cls,'->',b.cls,'| means:',e.means,'| old why:',a.why);}}}}}
console.log('presses',n,'changed',diff);
{let fo=0,fn=0;for(const r of rows)for(const k of ['cr1','cr2','cr3','dr1','dr2','dr3'])for(const seg of String(r[k]||'').split(/PRESSED WITH\s*:/i).slice(1)){const s=seg.split(/\n\s*\n|\n\s*\d+\.\s+LINK/)[0];for(const e of OLD.entries(s)){if(/WALL-2024 floor/.test(OLD.classify(e,{},'DR2',null).why||''))fo++;if(/WALL-2024 floor/.test(NEW.classify(NEW.parse(e.text),{},'DR2',null).why||''))fn++;}}console.log('floor UNPROVEN old',fo,'new',fn);}
