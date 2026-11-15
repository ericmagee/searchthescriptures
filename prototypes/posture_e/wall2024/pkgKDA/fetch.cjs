const {execFileSync}=require('child_process');const fs=require('fs');const K=process.env.K;const out={};
for(const tok of ['ODV1-37113-vaaf3hwh','ODV1-37032-m7yxtyxj']){process.argv[3]=tok;delete require.cache[require.resolve('./cs.cjs')];const o=require('./cs.cjs');let rows=[];
 for(const u of o.l2_urls){const t=execFileSync('curl',['-s',u,'-H','apikey: '+K,'-H','Authorization: Bearer '+K],{maxBuffer:1e8}).toString();rows=rows.concat(JSON.parse(t));}
 out[tok]={read:o.l2_read,rows};console.log(tok,o.l2_urls.length,'urls',rows.length,'rows',o.l2_read.length,'verses');}
fs.writeFileSync('l2words.json',JSON.stringify(out));
