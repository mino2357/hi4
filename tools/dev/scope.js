#!/usr/bin/env node
/* 読む範囲：番号を与えると，その作業で読むファイルを出す（定めは docs.js の scope）．
   使い方： npm run scope -- P-23 [D-09 …]     表で出す
            npm run scope -- P-23 --files      ファイルの名前だけ（1 行に 1 つ） */
'use strict';
const D=require('./docs.js'),{items,byId}=D.load(),args=process.argv.slice(2),want=args.filter(a=>!a.startsWith('--'));
if(!want.length){console.log('使い方： npm run scope -- 番号…（番号は docs/INDEX.md）');process.exit(1)}
const out=[],has=new Set();
for(const id of want){if(!byId[id]){console.log(id+' は無い（docs/INDEX.md を見る）');process.exit(1)}for(const s of D.scope(byId,items,id))if(!has.has(s.id)){has.add(s.id);out.push(s)}}
if(args.includes('--files')){console.log([...D.ALWAYS,...out.map(s=>byId[s.id].file)].join('\n'));process.exit(0)}
for(const id of want){const it=byId[id],fm=it.fm;console.log(id+'：'+fm.title+(fm.status?'［'+fm.status+(fm.decides?'．決める人：'+fm.decides:'')+'］':''))}
console.log('\n読む（この順．このほかの断片は読まない）：');
for(const p of D.ALWAYS)console.log('  '+p.padEnd(26)+'       いつも');
let n=0;for(const s of out){const it=byId[s.id];n+=it.n;console.log('  '+it.file.padEnd(26)+String(it.n).padStart(6)+' '+s.why+(it.fm.status?'［'+it.fm.status+'］':''))}
console.log('合計 '+n+' 字（上限 '+D.LIMIT.scope+'／番号）');
const men=new Set();for(const s of out)for(const m of D.list(byId[s.id].fm.mentions))if(!has.has(m))men.add(m);
if(men.size)console.log('名前が出てくるだけ（読まない）：'+[...men].sort().join(' '));
