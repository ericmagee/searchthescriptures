const fs=require('fs');const [IN,NODE,OUT]=process.argv.slice(2);let w=JSON.parse(fs.readFileSync(IN));w=w.workflow||w.data||w;
const n=w.nodes.find(x=>x.name===NODE);if(!n||!n.parameters.jsCode)throw new Error('no Code node '+NODE);n.parameters.jsCode="throw new Error('gate plant');\n"+n.parameters.jsCode;fs.writeFileSync(OUT,JSON.stringify(w));console.log('planted throw in',NODE,'->',OUT);
