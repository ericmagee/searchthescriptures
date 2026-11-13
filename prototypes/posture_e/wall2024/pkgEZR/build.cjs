// node pkgEZR/build.cjs <base json> <out json>   pkgEZR: one sentence in TEXTPROOF (Oracle branch of build() in Init with Guards), ASK 153
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2]));const n=W.nodes.find(x=>x.name==='Init with Guards');const a=n.parameters.jsCode;
const OLD='outweigh many labels.";';
const ADD=' When a verse states an outcome, carry the cause the verse itself gives; never pin the outcome on a cause a nearby verse names and this one does not (Ezra 2:62: they were put from the priesthood because their register \\"was not found\\"; it does not say a name taken through a wife\'s house was refused).';
const i=a.indexOf('TEXTPROOF=');const j=a.indexOf(OLD,i);if(i<0||j<0||a.indexOf(OLD,j+1)>=0&&a.indexOf(OLD,j+1)<a.indexOf(';',j+OLD.length))throw new Error('anchor');
const b=a.slice(0,j)+'outweigh many labels.'+ADD+'";'+a.slice(j+OLD.length);n.parameters.jsCode=b;
fs.writeFileSync(process.argv[3],JSON.stringify(W));
const ev=s=>{const k=s.indexOf('TEXTPROOF=');const m=/[^\\]";/g;m.lastIndex=k+11;const e=m.exec(s).index+2;return eval(s.slice(k+10,e));};
console.log('Init with Guards code +'+(b.length-a.length)+' | TEXTPROOF prompt',ev(a).length,'->',ev(b).length,'(+'+(ev(b).length-ev(a).length)+')');
