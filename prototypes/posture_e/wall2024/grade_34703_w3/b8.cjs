const {RD,out,fs}=require('./x.cjs');
const body=JSON.parse(out('Replay Rows')[0].json.body);
for(const r of body.p_rows){console.log('\n=== ',r.judge_seat,'len',r.verdict_raw.length);
 const raw=r.verdict_raw.replace(/\\n/g,'\n').replace(/\\"/g,'"');fs.writeFileSync('raw_'+r.judge_seat+'.txt',raw);
 const L=raw.split('\n');
 for(const l of L){const t=l.trim();if(/^(RESULT|CLAUSE|KEYSTONE|DEFENDER CHAIN MARK|CHALLENGER CHAIN MARK|DEFENSE STANDING|CHALLENGE STANDING|FORCED)/.test(t)||(/^D\d+ vs C\d+/.test(t)))console.log('   |',t.slice(0,250))}
 let c={};for(const l of L){const m=l.match(/\[AUDIT (v\d+)/);if(m)c[m[1]]=(c[m[1]]||0)+1}console.log('   audit counts',JSON.stringify(c));
 for(const l of L)if(/AUDIT/.test(l)&&/v52|v25|KEYSTONE|SUPERSEDED LINE|v38|CLOSE-CONTRADICTION|pkgGUB|pkgGCC|CURE COUNT|pkgVPD|pkgVP4/.test(l))console.log('   M|',l.trim().slice(0,600));
}
