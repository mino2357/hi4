#!/usr/bin/env node
/* 利用者の決定を記録する（利用者が決めたときにだけ実行する．自分の判断で実行しない）．
   使い方： npm run decide -- 採用 P-02 P-03        現象の採否（採用／不採用／候補）
            npm run decide -- 決定 Q-03 "G-05 のまま" 未決の決定（本文の「決定」の節に書く）
   日付は今日．実行の後に npm run index． */
'use strict';
const fs=require('fs'),path=require('path'),D=require('./docs.js'),{byId}=D.load(),[st,...rest]=process.argv.slice(2),today=new Date().toISOString().slice(0,10);
const put=(it,f)=>{const p=path.join(D.root,it.file);fs.writeFileSync(p,f(fs.readFileSync(p,'utf8')));console.log(it.id+' → '+st)};
const set=(s,k,v)=>s.replace(new RegExp('^'+k+':.*$','m'),(k+': '+v).trimEnd());
if(['採用','不採用','候補'].includes(st)&&rest.length){for(const id of rest){const it=byId[id];if(!it||it.kind!=='P'){console.log(id+' は現象ではない');process.exit(1)}}
 for(const id of rest)put(byId[id],s=>set(set(s,'status',st),'decided',st==='候補'?'':today))}
else if(st==='決定'&&rest.length===2){const it=byId[rest[0]];if(!it||it.kind!=='Q'){console.log(rest[0]+' は未決の項目ではない');process.exit(1)}
 put(it,s=>set(set(s,'status','決定'),'decided',today).replace(/\n## 決定\n[\s\S]*$/,'\n## 決定\n\n'+rest[1].trim()+'\n'))}
else{console.log('使い方： npm run decide -- 採用|不採用|候補 P-nn…  ／  npm run decide -- 決定 Q-nn "決めた内容"');process.exit(1)}
