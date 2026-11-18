// ASK 390: a round already marked comes back through an Extract (re-marking check)
const fs=require('fs');const wn390=new Function(fs.readFileSync(__dirname+'/wn390.js','utf8')+';return wn390;')();const R=JSON.parse(fs.readFileSync(__dirname+'/rounds.json'));
for(const [tok,col] of [['ODV1-38593','engine_r2'],['ODV1-37812','defender_r4']]){const t=R.find(x=>x.run_token.startsWith(tok))[col];const a=wn390(t),b=wn390(a.text);
 const nest=(b.text.match(/\[working note: \[working note: /g)||[]).length;const marks=s=>(s.match(/\[working note: /g)||[]).length;
 console.log(tok,col,'| marks after one pass:',marks(a.text),'| after a second pass:',marks(b.text),'| second pass notes:',b.notes.length,'| nested:',nest,'| second pass equals first:',b.text===a.text);
 for(const x of b.notes)console.log('   second-pass note:',JSON.stringify(b.text.slice(Math.max(0,b.text.indexOf('[working note: ',0)),0)),x.marker,JSON.stringify(a.text.slice(x.span[0],x.span[1])));}
