#!/usr/bin/env node
/* 索引 docs/INDEX.md を作る（手で書き換えない）．
   使い方： node tools/dev/index.js          点検して書き出す
            node tools/dev/index.js --check  点検し，今の索引と違えば終了コード 1（npm run check） */
'use strict';
const fs=require('fs'),path=require('path'),D=require('./docs.js'),L=D.load(),errs=D.check(L),{items,byId}=L;
if(errs.length){console.log('[文書の点検] '+errs.length+' 件\n'+errs.join('\n'));process.exit(1)}
const of=k=>items.filter(i=>i.kind===k),ids=a=>a.length?a.join(' '):'–',f=it=>'`'+it.file.replace(/^docs\//,'')+'`（'+it.n+'）',t=s=>s.replace(/\|/g,'／');
const sz=it=>D.scopeSize(byId,D.scope(byId,items,it.id));
const rev=(id,key,kind)=>items.filter(i=>(!kind||i.kind===kind)&&D.list(i.fm[key]).includes(id)).map(i=>i.id);
const cnt=(k,s)=>of(k).filter(i=>i.fm.status===s).length;
const o=['# 索引（自動生成）','','`npm run index` が作る．手で書き換えない（`npm run check` が，今の断片から作ったものと同じかを調べる）．欄と点検の定めは `tools/dev/docs.js`．','',
'## 0. 使い方（読む範囲）','',
'1. 作業のはじめに読むのは `CLAUDE.md` とこの索引だけ．',
'2. 作業の対象の番号を決め，`npm run scope -- 番号…` を実行する．**出てきたファイルが，その作業で読む範囲**（対象，前提，設計の案，関わる未決）．それ以外の断片は読まない．',
'3. 範囲の外の断片が要ると分かったら，読む前に，その番号を対象の断片の欄（`requires`／`design`／`affects`）に加えるかを決める（本文に番号を書くと，欄に無ければ点検が落ちる）．',
'4. 1 つの番号の読む範囲は '+D.LIMIT.scope+' 字以下，断片 1 つは '+D.LIMIT.fragment+' 字以下（点検が調べる）．（ ）の中は字数．','',
'## 1. 現象（P）：どこまで扱うかは利用者が決める','',
'状態：候補 '+cnt('P','候補')+'，採用 '+cnt('P','採用')+'，不採用 '+cnt('P','不採用')+'．「指示」の ○ は，利用者の最初の指示（G-01）に欠かせないと考えたもの（採用とは別）．「これを前提にする」は，この項目を採らないと採れない項目．','',
'| 番号 | 現象 | 分類 | 状態 | 指示 | 重さ | 前提 | これを前提にする | 設計の案 | 要件 | ファイル | 読む範囲 |','| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | ---: |'];
for(const i of of('P'))o.push('| '+[i.id,t(i.fm.title),i.fm.group,i.fm.status+(i.fm.decided?'（'+i.fm.decided+'）':''),i.fm.instructed==='yes'?'○':'',i.fm.weight,ids(D.list(i.fm.requires)),ids(rev(i.id,'requires','P')),ids(D.list(i.fm.design)),ids(rev(i.id,'phenomena','R')),f(i),sz(i)].join(' | ')+' |');
o.push('','## 2. 設計の案（D）','','「使う現象」は，その断片を `design` に挙げている現象（不採用を除く）．「–」で「共通」でないものは，いまは使われない．「ice」は対応する `ice_2026` の項目の番号．','',
'| 番号 | 題 | 前提 | 使う現象 | ice | ファイル | 読む範囲 |','| :--- | :--- | :--- | :--- | :--- | :--- | ---: |');
for(const i of of('D')){const use=rev(i.id,'design','P').filter(p=>byId[p].fm.status!=='不採用'),dep=rev(i.id,'requires','D');
 o.push('| '+[i.id,t(i.fm.title),ids(D.list(i.fm.requires)),use.length?use.join(' '):(dep.length||!rev(i.id,'design','P').length?'共通':'–'),ids(D.list(i.fm.ice)),f(i),sz(i)].join(' | ')+' |')}
o.push('','## 3. 未決（Q）','','「決める人」が利用者のものは，利用者に確かめる（自分で決めない）．「仕様」のものは，要件が承認された後に仕様で決める．','',
'| 番号 | 題 | 状態 | 決める人 | 関わる項目 | ファイル |','| :--- | :--- | :--- | :--- | :--- | :--- |');
for(const i of of('Q'))o.push('| '+[i.id,t(i.fm.title),i.fm.status+(i.fm.decided?'（'+i.fm.decided+'）':''),i.fm.decides,ids(D.list(i.fm.affects)),f(i)].join(' | ')+' |');
o.push('','## 4. 企画（G）','','| 番号 | 題 | ファイル |','| :--- | :--- | :--- |');for(const i of of('G'))o.push('| '+[i.id,t(i.fm.title),f(i)].join(' | ')+' |');
o.push('','## 5. 要件（R）','','状態：案 '+cnt('R','案')+'，承認 '+cnt('R','承認')+'．hi4 の要件の番号は R-nn（「REQ-nn」と書いたら `ice_2026` の項目）．「案」は利用者の承認の前で，仕様と実装のもとにしない．要件がまだ無い現象は，1 節の「要件」が「–」．','','| 番号 | 題 | 状態 | もとの現象 | 前提 | 設計の案 | ファイル | 読む範囲 |','| :--- | :--- | :--- | :--- | :--- | :--- | :--- | ---: |');
for(const i of of('R'))o.push('| '+[i.id,t(i.fm.title),i.fm.status+(i.fm.decided?'（'+i.fm.decided+'）':''),ids(D.list(i.fm.phenomena)),ids(D.list(i.fm.requires)),ids(D.list(i.fm.design)),f(i),sz(i)].join(' | ')+' |');
o.push('','## 6. そのほかのファイル','','| ファイル | 字数 |','| :--- | ---: |');
const rd=p=>fs.readFileSync(path.join(D.root,p),'utf8');
for(const p of['CLAUDE.md','README.md',...fs.readdirSync(path.join(D.root,'tools/dev')).sort().map(x=>'tools/dev/'+x),...(fs.existsSync(path.join(D.root,'docs/changes'))?fs.readdirSync(path.join(D.root,'docs/changes')).sort().map(x=>'docs/changes/'+x):[])])o.push('| `'+p+'` | '+D.len(rd(p))+' |');
const text=o.join('\n')+'\n',dst=path.join(D.root,'docs/INDEX.md');
if(process.argv.includes('--check')){if((fs.existsSync(dst)?fs.readFileSync(dst,'utf8'):'')!==text){console.log('[索引] docs/INDEX.md が古い（npm run index で作り直す）');process.exit(1)}console.log('文書の点検 OK（断片 '+items.length+'），索引は最新')}
else{fs.writeFileSync(dst,text);console.log('docs/INDEX.md',D.len(text),'字')}
