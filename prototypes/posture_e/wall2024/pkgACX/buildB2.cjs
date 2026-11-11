// pkgACX option B rev 2: the anti-cheat note says it breaks no link and is not a confirmed closing contradiction. Panel Build and Build Independent Verdict.
const fs=require('fs');const P=JSON.parse(fs.readFileSync('/mnt/project-files/wall2024/fetchback_live_s120.json'));
const OLD="The close sentence is disregarded; grade";const NEW="The close sentence is disregarded (this note by itself breaks no link; only a pair listed under CONFIRMED CLOSING CONTRADICTIONS is confirmed); grade";
let d=0;for(const nm of ['Panel Build','Build Independent Verdict']){const N=P.nodes.find(n=>n.name===nm);const s=N.parameters.jsCode;if(s.split(OLD).length!==2)throw new Error('anchor '+nm);const ns=s.replace(OLD,NEW);new Function('$','$input','return (async()=>{'+ns+'})');N.parameters.jsCode=ns;d+=ns.length-s.length;console.log(nm,'+'+(ns.length-s.length));}
console.log('total +'+d);fs.writeFileSync('/mnt/project-files/wall2024/parent_s120_ACXB2.json',JSON.stringify(P));
