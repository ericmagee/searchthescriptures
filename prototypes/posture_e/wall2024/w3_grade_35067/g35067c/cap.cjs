const H=require('./harness.cjs');
for(const v of ['128','130']){const lib=H.libFor(v);const s=H.src(lib,'Judge Enforcer Build');
 console.log(v,'len',s.length,'marker',s.includes("OTHER LINES ON THIS VERSE"),'eaw_blk',s.includes('eaw_blk'));
 for(const m of s.matchAll(/not_checked/g)){console.log('  nc@',m.index,s.slice(Math.max(0,m.index-120),m.index+100).replace(/\n/g,' '));break;}
 const i=s.search(/\b(MAXCALLS|maxCalls|MAXC|CAP)\b/);console.log('  cap idx',i,i>=0?s.slice(i-60,i+160).replace(/\n/g,' '):'');
 const j=s.indexOf('<10');console.log('  <10',j>=0?s.slice(j-120,j+120).replace(/\n/g,' '):'');
}
