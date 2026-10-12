import * as A from "./v60x.ts";
import * as B from "./v61x.ts";
const t45: string = JSON.parse(Deno.readTextFileSync("t45.json"));
const ok = (c: boolean, m: string) => console.log((c ? "PASS " : "FAIL ") + m);
const stub = (id: number, n: number) => { const tag = `<END${id}>`; return "x".repeat(n - tag.length) + tag; };
const anchors: Record<number, string> = {
  45: "John 10:16; John 10:27; Matthew 15:24; Ezekiel 34:12, 34:23, 34:30-31; Ezekiel 37:22; John 11:52",
  39: "Ezekiel 34:4, 34:16, 34:23; Deuteronomy 6:4; John 10:11, 10:16",
  44: "Matthew 15:24; John 10:14; Ezekiel 37:13",
};
const lens: Record<number, number> = { 45: 2068, 39: 1324, 44: 929, 46: 328, 59: 1218, 2: 1083, 5: 898, 7: 1487, 9: 1427, 10: 744, 31: 404, 38: 354, 67: 468, 69: 363 };
const conc = (id: number, extra: any = {}) => ({ id, layer: "L1-L2", passage_anchor: anchors[id] ?? `Anchor ${id}`, hebrew_greek: id % 2 ? "hg" : null,
  conclusion_text: id === 45 ? t45 : stub(id, lens[id] ?? 500), status: "ESTABLISHED", needs_review: false, superseded_by: null, similarity: 0.5, ...extra });
const linksRaw = [[41,39,45,"supports"],[42,44,45,"supports"],[43,31,45,"supports"],[44,44,69,"supports"],[45,45,67,"limits"],[46,67,69,"same_question"],[47,38,39,"chain_next"],[48,38,45,"supports"],[49,45,59,"same_question"]];
const links = (st: string) => linksRaw.map(([id, f, t, r]) => ({ id, from_ref: f, to_ref: t, relation: r, status: st }));
// mock supabase client: honours eq status, or(from_ref.in / to_ref.in), in id
function mock(linkRows: any[], kb: any[], fail = false) {
  return { from(tbl: string) {
    const q: any = { f: [] as ((r: any) => boolean)[] };
    q.select = () => q;
    q.eq = (c: string, v: any) => { q.f.push((r: any) => r[c] === v); return q; };
    q.or = (s: string) => { const m = s.match(/from_ref\.in\.\(([^)]*)\),to_ref\.in\.\(([^)]*)\)/)!; const ids = m[1].split(",").map(Number);
      q.f.push((r: any) => ids.includes(r.from_ref) || ids.includes(r.to_ref)); return q; };
    q.in = (c: string, v: any[]) => { q.f.push((r: any) => v.includes(r[c])); return q; };
    q.then = (res: any) => { if (fail) return res({ data: null, error: { message: "boom" } });
      const src = tbl === "corpus_links" ? linkRows : kb; return res({ data: src.filter((r) => q.f.every((g: any) => g(r))), error: null }); };
    return q; } };
}
const kbAll = [31, 38, 67, 69, 45, 39, 44, 46, 59, 2, 5, 7, 9, 10].map((id) => conc(id));
// F1: no links, all four <=700 -> v61 block byte-equal to v60
const four = [46, 31, 38, 67].map((id) => conc(id));
ok(B.buildConclusionBlock(four) === A.buildConclusionBlock(four), "F1 four conclusions at 700 or under, no links: block byte-equal to v60");
const none = await B.expandLinkedConclusions(mock(links("approved"), kbAll), [conc(2), conc(5)], 6);
ok(none.length === 0, "F1b base with no links touching it: nothing added");
// F2: #45 whole
const base4 = [45, 39, 44, 59].map((id) => conc(id));
const b60 = A.buildConclusionBlock(base4), b61 = B.buildConclusionBlock(base4);
ok(b61.includes(t45) && t45.length === 2068 && t45.includes("Scope: not a census proof") && !b60.includes("Scope: not a census proof"),
  `F2 Conclusion 45 served whole in v61 (${t45.length} chars, Scope line present); v60 cut it at 700`);
// F3: expansion equals debate_arsenal_linked on the same base (24793 topic, 10 conclusions, links 41-49 approved)
const base10 = [45, 39, 44, 46, 59, 2, 5, 7, 9, 10].map((id) => conc(id));
const sqlNotes = [[67, "LINKED (link 45: #67 limits #45)"], [38, "LINKED (link 47: #38 runs on to #39; link 48: #38 and #45 support each other)"], [31, "LINKED (link 43: #31 and #45 support each other)"], [69, "LINKED (link 44: #44 and #69 support each other)"]];
const got = await B.expandLinkedConclusions(mock(links("approved"), kbAll), base10, B.LINK_CAP);
ok(JSON.stringify(got.map((g: any) => [g.id, g.link_note])) === JSON.stringify(sqlNotes), "F3 ids, order and notes equal debate_arsenal_linked: " + got.map((g: any) => g.id).join(","));
const got2 = await B.expandLinkedConclusions(mock(links("approved"), kbAll), base10, 2);
ok(got2.map((g: any) => g.id).join(",") === "67,38", "F3b cap 2 gives 67,38 as the SQL function does");
ok(got.every((g: any) => g.conclusion_text.length === lens[g.id] && g.linked === true && g.similarity === null), "F3c linked rows whole, marked, similarity null");
// F4
ok((await B.expandLinkedConclusions(mock(links("proposed"), kbAll), base10, 6)).length === 0, "F4 proposed links add nothing");
ok((await B.expandLinkedConclusions(mock(links("rejected"), kbAll), base10, 6)).length === 0, "F4 rejected links add nothing");
ok((await B.expandLinkedConclusions(mock(links("approved"), kbAll), base10, 0)).length === 0, "F4 cap 0 adds nothing");
let threw = false; try { await B.expandLinkedConclusions(mock(links("approved"), kbAll, true), base10, 6); } catch { threw = true; }
ok(threw, "F4 read error throws inside expand, so the handler's try/catch serves the 4 alone (handler wiring checked in source)");
// exclusions
const kbBad = kbAll.map((r) => r.id === 38 ? { ...r, needs_review: true } : r.id === 67 ? { ...r, status: "SUPERSEDED" } : r);
const ex = await B.expandLinkedConclusions(mock(links("approved"), kbBad), base10, 6);
ok(ex.map((g: any) => g.id).join(",") === "31,69", "X1 needs_review and SUPERSEDED linked rows excluded: " + ex.map((g: any) => g.id).join(","));
// prompt marks with base4 (ask-like)
const lk = await B.expandLinkedConclusions(mock(links("approved"), kbAll), base4, 6);
const blk = B.buildConclusionBlock([...base4, ...lk]);
console.log("   linked for base 45,39,44,59:", lk.map((g: any) => `${g.id} [${g.link_phrase}]`).join(" | "));
ok(blk.includes("A row marked LINKED") && (blk.match(/\[LINKED: /g) ?? []).length === lk.length, "X2 block marks each linked row and carries the rule sentence once");
ok(!B.buildConclusionBlock(base4).includes("A row marked LINKED"), "X3 no linked row, no rule sentence");
// X4: 25 eligible candidates beyond the first 20 ineligible: cap still filled from eligible rows (filter before cap)
const manyLinks: any[] = []; const manyKb: any[] = [conc(45)];
for (let i = 0; i < 25; i++) { const id = 1000 + i; manyLinks.push({ id: 100 + i, from_ref: 45, to_ref: id, relation: "supports", status: "approved" });
  manyKb.push({ ...conc(id), needs_review: i < 20 }); }
const m = await B.expandLinkedConclusions(mock(manyLinks, manyKb), [conc(45)], 6);
ok(m.map((g: any) => g.id).join(",") === "1020,1021,1022,1023,1024", "X4 ineligible candidates do not crowd out eligible ones: " + m.map((g: any) => g.id).join(","));
const big = await B.expandLinkedConclusions(mock(manyLinks, manyKb.map((r) => ({ ...r, needs_review: false }))), [conc(45)], 100);
ok(big.length === 20, "X5 cap above 20 clamps to 20: " + big.length);
