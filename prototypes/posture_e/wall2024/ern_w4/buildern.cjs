// Remove ernie from the panel order and alternates (operator card "Remove ernie", 15:59 CST 11-17). Base: live s257 fetchback.
const fs=require('fs');const W=JSON.parse(fs.readFileSync(process.argv[2]));
const rep=(nm,o,n)=>{const x=W.nodes.find(y=>y.name===nm);const c=x.parameters.jsCode;const k=c.split(o).length-1;if(k!==1)throw new Error(nm+' anchor count '+k+': '+o.slice(0,60));x.parameters.jsCode=c.replace(o,()=>n);};
const O="'argon','spark','ernie','ember','sonnet','qwen']; /* operator 14:47 CST 11-17";
const N="'argon','spark','ember','sonnet','qwen']; /* operator 15:59 CST 11-17 (card \"Remove ernie\"): ernie removed after it spent its whole budget reasoning in run 38450 */ /* operator 14:47 CST 11-17";
rep('Init Seats',"const ORDER0=['chatgpt','sol','sol62','haiku','hydrogen','gemini',"+O,"const ORDER0=['chatgpt','sol','sol62','haiku','hydrogen','gemini',"+N);
rep('Init Seats',"const __ALT=['haiku','hydrogen','gemini','argon','spark','ernie','ember','sonnet'];","const __ALT=['haiku','hydrogen','gemini','argon','spark','ember','sonnet']; /* operator 15:59 CST 11-17: ernie removed */");
rep('Accept Build',"const ORDER=['chatgpt','sol','sol62','haiku','hydrogen','gemini',"+O,"const ORDER=['chatgpt','sol','sol62','haiku','hydrogen','gemini',"+N);
fs.writeFileSync(process.argv[3],JSON.stringify(W));console.log('ok');
