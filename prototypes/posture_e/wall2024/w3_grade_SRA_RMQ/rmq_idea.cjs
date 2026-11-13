// W3 sketch for pkgRMQ: a quotation is the missed answer only when its round equals the ANSWER CHECK round AND one holds the other whole.
const W=s=>' '+String(s||'').toLowerCase().replace(/[^a-z0-9: ]+/g,' ').split(/\s+/).filter(Boolean).join(' ')+' ';
const hit=(q,qRound,acq)=>{for(const a of acq){if(a.round!==qRound)continue;const qs=W(q),as=W(a.answer);if(qs.includes(as)||(as.includes(qs)&&qs.trim().split(' ').length>=6))return a.answer;}return null;};
const t=(n,got,want)=>console.log((!!got===want?'OK  ':'FAIL'),n);
const A=[{round:'CR3',answer:'Matthew 1:22 gives its own reading of the word'}];
t('real 36156: refused',hit('Matthew 1:22 gives its own reading of the word','CR3',A),true);
t('longer quotation holding the answer: refused',hit('Matthew 1:22 gives its own reading of the word itself here','CR3',A),true);
t('six words from inside the answer: refused',hit('gives its own reading of the word','CR3',A),true);
t('another sentence of the same round: cures',hit('and the fulfilment is stated there for all to see','CR3',A),false);
t('short answer, later-round sentence holding its words: cures',hit('The conception is of the Holy Ghost in Matthew 1:20 and that source governs','CR4',[{round:'CR3',answer:'of the Holy Ghost'}]),false);
t('verse words shared with a later answer: cures',hit('before the child shall know to refuse the evil", and I answer the timing','CR4',[{round:'CR3',answer:'The verse says before the child shall know to refuse the evil and stops there'}]),false);
t('verse words shared, same round, neither holds the other: cures',hit('before the child shall know to refuse the evil, and I answer the timing','CR3',[{round:'CR3',answer:'The verse says before the child shall know to refuse the evil and stops there'}]),false);
t('LIMIT short answer, same round, other sentence holding its words: refused (wrong)',hit('The conception is of the Holy Ghost in Matthew 1:20','CR3',[{round:'CR3',answer:'of the Holy Ghost'}]),true);
