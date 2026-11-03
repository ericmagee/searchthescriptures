// judge_fix9 S3 measurement on the stored runs: every press under PRESSED WITH parsed (PROVEN / PROVEN BY REFERENCE / UNPROVEN), and the
// ledger's NOT NAMED lists, base (live cb4b94e0) against new. The stored presses carry a reference and a quotation only (no MEANS sentence),
// so they parse UNPROVEN by format: the figures measure the old format, not the debaters.
const fs=require('fs');const D=__dirname+'/../';const RE_END='\n return {parse,keys,book,BK,BOOKS};})();';
const PWL=v=>{const s=fs.readFileSync(D+v+'/Panel Build.js','utf8');const r=s.indexOf('const REFP=(()=>');const e9=s.indexOf('// ======== end judge_fix9 libraries ========');const h9=e9<0?'':s.slice(0,e9);return new Function(h9+'\n'+(r>=0?s.slice(r,s.indexOf(RE_END,r)+RE_END.length):'')+s.slice(s.indexOf('const PWL='),s.indexOf('\nconst LEDGER='))+';return PWL;')();};
const P0=PWL('base'),P1=PWL('new');
for(const n of process.argv.slice(2).length?process.argv.slice(2):['32284','32293','32302','32306']){const r=JSON.parse(fs.readFileSync(D+'data/run'+n+'.json'));
 const F={cr1:r.claude_r1,gr1:r.engine_r1,cr2:r.claude_r2,gr2:r.engine_r2,cr3:r.engine_r3,dr3:r.challenger_r3,cr4:r.defender_r4||null};
 const b=P0.judgeBlock(F).split('\n'),w=P1.judgeBlock(F).split('\n');const nn=L=>L.filter(l=>/^premise \d+/.test(l)).map(l=>(l.match(/NOT NAMED: (.*)$/)||[])[1]||'');
 const stat=L=>{let pr=0,pv=0,br=0,up=0;for(const l of L.filter(l=>/^premise \d+/.test(l))){const m=l.match(/(\d+) verse\(s\) carried under PRESSED WITH; (\d+) PROVEN, (\d+) PROVEN BY REFERENCE/);if(m){pr+=+m[1];pv+=+m[2];br+=+m[3];}}return {presses:pr,proven:pv,byRef:br,unproven:pr-pv-br};};
 const s=stat(w);const bn=nn(b),wn=nn(w);const cnt=a=>a.filter(x=>x&&!/^none$/.test(x)).reduce((k,x)=>k+x.split(', ').length,0);
 console.log(`RUN ${n}: presses within the cap ${s.presses}: PROVEN ${s.proven}, PROVEN BY REFERENCE ${s.byRef}, UNPROVEN ${s.unproven} | ledger NOT NAMED verses: base ${cnt(bn)}, new ${cnt(wn)}`);}
