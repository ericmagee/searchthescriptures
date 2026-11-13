// W2 plants on pkgSRA helper (usage: node plants_w2.cjs /mnt/project-files/wall2024/pkgSRA/helper.js)
eval(require("fs").readFileSync(process.argv[2],"utf8").replace("function sraSame","global.sraSame=function"));
const M="the angel greets the husband as David son and gives him the naming",A="It is Joseph address.";
const t=(n,v)=>console.log(n,"=>",JSON.stringify(v).slice(0,250));
t("Q1 null round",sraSame(null,"Matthew 1:20",M,A,""));
t("Q2 abbreviated pressed verse in a line",sraSame("- Matt. 1:20 gives the naming to the husband greeted as David's son here.","Matthew 1:20",M,A,""));
t("Q3 lower-case pressed verse in a line",sraSame("- matthew 1:20 gives the naming to the husband greeted as David's son here.","Matthew 1:20",M,A,""));
t("Q4 range naming the pressed verse",sraSame("- Matthew 1:18-25 gives the naming to the husband greeted as David's son here.","Matthew 1:20",M,A,""));
t("Q5 bullet LINK heading",sraSame("- **LINK 3: SUPPORTED** naming husband greets angel David son here now.","Matthew 1:20",M,A,""));
t("Q6 ANSWER CHECK-like line with MEANS:",sraSame("ANSWER CHECK: Luke 1:31 -- [CR3] -- MEANS: naming husband greets angel David son -- MEETS","Matthew 1:20",M,A,""));
t("Q7 KJV quote line on another verse",sraSame('[L1] Luke 1:31 "thou shalt call his name JESUS" naming husband greets.',"Matthew 1:20",M,A,""));
const big=Array.from({length:3000},(_,i)=>"- line "+i+" about the naming of a child by the mother here and there.").join("\n");const t0=Date.now();sraSame(big,"Matthew 1:20",M,A,"");console.log("Q8 3000-line round ms",Date.now()-t0);
