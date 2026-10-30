const fs=require('fs');const F=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const LF='\n';eval(fs.readFileSync(process.env.PWLF||(__dirname+'/pwl_new.js'),'utf8').replace('const PWL=','globalThis.PWL='));
const c=PWL.cList({dr3:F.dr3});process.stdout.write(PWL.judgeBlock(F)+(c?'\n\n'+c:''));
