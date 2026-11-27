#!/usr/bin/env node
/* 式と量で持つ要求（docs/model/）の検査．定めは docs/model/README.md．
   使い方： node tools/dev/model.js          検査して docs/model/REPORT.md を書く
            node tools/dev/model.js --check  検査し，REPORT.md が今の結果と違えば終了コード 1
            node tools/dev/model.js --impact 量の番号…   その量を使う式，その式を確かめる基準と要求を出す
   analyze(files)：files は {ファイル名: 本文}．返すのは {errors, notes, report, eqs, qs}（自己検査 model_selftest.js が使う）． */
'use strict';
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'../..'),dir=path.join(root,'docs/model');
const OLD=['R-28'];/* まだ前の形の要求 */
const list=s=>(s||'').split(/\s+/).filter(Boolean),DEFK=['未知','状態','流れ'],KINDS=[...DEFK,'入力','設定','許容'];
const rows=t=>t.split('\n').filter(l=>/^\|/.test(l)&&!/^\|\s*:?-/.test(l)).slice(1).map(l=>l.split('|').slice(1,-1).map(c=>c.trim()));
function analyze(files,reqs){const errors=[],notes=[],E=m=>errors.push(m);
 /* 木 */
 const nodes=new Set((files['tree.md']||'').split('\n').map(l=>/^\s*- (.+)$/.exec(l)).filter(Boolean).map(m=>m[1].trim()));
 /* 仮定 */
 const AS={};for(const r of rows(files['assumptions.md']||'')){AS[r[0]]={type:r[1],values:r[2].split('／').map(s=>s.trim()),chosen:r[3]};
  if(!['決定','切替'].includes(r[1]))E('assumptions.md：'+r[0]+' の種類「'+r[1]+'」は使えない');if(r[1]==='決定'&&!AS[r[0]].values.includes(r[3]))E('assumptions.md：'+r[0]+' の選んだ値「'+r[3]+'」が値の中に無い')}
 /* 量 */
 const qs={};for(const f of Object.keys(files).filter(f=>/^quantities-/.test(f)))for(const r of rows(files[f])){const q={id:r[0],tex:r[1],mean:r[2],unit:r[3],kind:r[4],node:r[5],file:f};
  if(qs[q.id])E(f+'：量 '+q.id+' が重なる');if(!KINDS.includes(q.kind))E(f+'：量 '+q.id+' の種類「'+q.kind+'」は使えない');if(!nodes.has(q.node))E(f+'：量 '+q.id+' の節点「'+q.node+'」が木に無い');qs[q.id]=q}
 /* 式 */
 const eqs=[],e_src={};for(const f of Object.keys(files).filter(f=>/^eq-/.test(f))){const t=files[f],fm=/^---\n([\s\S]*?)\n---\n/.exec(t),node=fm&&(/^node: (.+)$/m.exec(fm[1])||[])[1];
  if(!node||!nodes.has(node)){E(f+'：node が無いか，木に無い');continue}
  for(const b of t.split(/^### /m).slice(1)){const h=/^(E-[A-Z]{1,2}\d\d)：(.*)$/m.exec(b);if(!h){E(f+'：式の見出しが読めない：'+b.split('\n')[0]);continue}
   const g=k=>(new RegExp('^- '+k+': (.*)$','m').exec(b)||[])[1]||'',e={id:h[1],title:h[2],node,file:f,defines:list(g('defines')),uses:list(g('uses')),kind:g('kind'),assumes:g('assumes'),variant:g('variant'),math:/```math\n[\s\S]*?\n```/.test(b)};
   if(eqs.some(x=>x.id===e.id))E(f+'：式 '+e.id+' が重なる');if(!e.math)E(f+'：式 '+e.id+' に式（```math）が無い');eqs.push(e)}
  e_src[f]=list((/^source: (.*)$/m.exec(fm[1])||[])[1]).filter(x=>/^R-\d\d$/.test(x))}
 /* 1，2，5：式ごと */
 for(const e of eqs){for(const q of[...e.defines,...e.uses])if(!qs[q])E(e.file+'：式 '+e.id+' の量 '+q+' が量の表に無い');
  if(e.defines.length!==1)E(e.file+'：式 '+e.id+' が定める量が '+e.defines.length+' 個（1 個にする．何も定めない式は，ほかの式から導ける関係か，余分な条件）');
  for(const q of e.defines)if(qs[q]){if(!DEFK.includes(qs[q].kind))E(e.file+'：式 '+e.id+' が，種類「'+qs[q].kind+'」の量 '+q+' を定めている');else if(qs[q].node!==e.node)E(e.file+'：式 '+e.id+'（節点 '+e.node+'）が，別の節点（'+qs[q].node+'）の量 '+q+' を定めている')}
  for(const a of e.assumes.split(';').map(s=>s.trim()).filter(Boolean)){const[g,v]=a.split('=');if(!AS[g])E(e.file+'：式 '+e.id+' の仮定の組「'+g+'」が無い');else if(AS[g].type!=='決定')E(e.file+'：式 '+e.id+' の assumes に，切替の組「'+g+'」がある（variant に書く）');else if(v!==AS[g].chosen)E(e.file+'：式 '+e.id+' は「'+g+'='+v+'」を前提にしているが，決定は「'+AS[g].chosen+'」（仮定の食い違い）')}
  if(e.variant){const[g,v]=e.variant.split('=');if(!AS[g]||AS[g].type!=='切替')E(e.file+'：式 '+e.id+' の variant の組「'+g+'」が切替の組に無い');else if(!AS[g].values.includes(v))E(e.file+'：式 '+e.id+' の variant の値「'+v+'」が無い')}}
 /* 切替の形ごとに：3（定義がちょうど 1 本），4（マッチング），7（連立の組） */
 /* 切替の形：どの組も既定（値の 1 番目）にしたものと，1 つの組だけを別の値にしたもの */
 const SW=Object.keys(AS).filter(g=>AS[g].type==='切替'),dflt={};for(const g of SW)dflt[g]=AS[g].values[0];
 const forms=[{label:'',pick:dflt}];for(const g of SW)for(const v of AS[g].values.slice(1))forms.push({label:g+'='+v,pick:Object.assign({},dflt,{[g]:v})});
 const active=(e,F)=>{if(!e.variant)return true;const[g,v]=e.variant.split('=');return F.pick[g]===v};
 const rep=[],loops=new Set();
 for(const F of forms){const form=F.label||'既定',act=eqs.filter(e=>active(e,F)),used=new Set(act.flatMap(e=>[...e.defines,...e.uses])),defs={};
  for(const e of act)for(const q of e.defines)(defs[q]=defs[q]||[]).push(e.id);
  for(const q of used)if(qs[q]){const n=(defs[q]||[]).length;if(DEFK.includes(qs[q].kind)){if(n===0)E('［'+form+'］量 '+q+'（'+qs[q].mean+'）を定める式が無い');if(n>1)E('［'+form+'］量 '+q+' を定める式が '+n+' 本ある：'+defs[q].join(' '))}else if(n>0)E('［'+form+'］種類「'+qs[q].kind+'」の量 '+q+' を式 '+defs[q].join(' ')+' が定めている')}
  /* マッチング（節点ごと．宣言した defines によらず，式に現れる量だけから） */
  for(const node of nodes){const es=act.filter(e=>e.node===node),us=[...used].filter(q=>qs[q]&&qs[q].node===node&&DEFK.includes(qs[q].kind));if(!es.length&&!us.length)continue;
   const adj=es.map(e=>us.filter(q=>e.defines.includes(q)||e.uses.includes(q))),mq={},me={};
   const aug=(i,seen)=>{for(const q of adj[i])if(!seen.has(q)){seen.add(q);if(mq[q]===undefined||aug(mq[q],seen)){mq[q]=i;me[i]=q;return true}}return false};
   es.forEach((e,i)=>aug(i,new Set()));
   const overE=es.filter((e,i)=>me[i]===undefined),underQ=us.filter(q=>mq[q]===undefined);
   for(const e of overE)E('［'+form+'］節点 '+node+'：式 '+e.id+'（'+e.title+'）に対応する量が無い（式が多すぎる．ほかの式と矛盾しうる）');
   for(const q of underQ)E('［'+form+'］節点 '+node+'：量 '+q+'（'+qs[q].mean+'）に対応する式が無い（式が足りない）');
   rep.push({form,F,node,es,us})}
  /* 連立の組：状態量は既知として，定める量 → 使う量 の強連結成分 */
  const dq=Object.keys(defs).filter(q=>qs[q]&&qs[q].kind!=='状態'),G={};for(const q of dq)G[q]=[...new Set(defs[q].flatMap(id=>act.find(e=>e.id===id).uses))].filter(u=>dq.includes(u));
  let idx=0;const st=[],on={},ind={},low={};const sc=v=>{ind[v]=low[v]=idx++;st.push(v);on[v]=1;for(const w of G[v]){if(ind[w]===undefined){sc(w);low[v]=Math.min(low[v],low[w])}else if(on[w])low[v]=Math.min(low[v],ind[w])}
   if(low[v]===ind[v]){const c=[];let w;do{w=st.pop();on[w]=0;c.push(w)}while(w!==v);if(c.length>1){const t=c.sort().join(' ');if(!loops.has(t)){loops.add(t);notes.push('連立して解く組'+(F.label?'［'+F.label+'］':'')+'：'+t)}}}};
  for(const q of dq)if(ind[q]===undefined)sc(q)}
 /* 6：確かめること */
 const ks=[];for(const f of Object.keys(files).filter(f=>/^checks-/.test(f)))for(const r of rows(files[f])){const k={id:r[0],crit:r[1],type:r[2],target:list(r[3]).filter(x=>x!=='–'),text:r[4],tol:r[5],file:f};ks.push(k);
  if(!/^R-\d\d$/.test(k.crit))E(f+'：'+k.id+' の基準「'+k.crit+'」が読めない');
  for(const t of k.target)if(!eqs.some(e=>e.id===t))E(f+'：'+k.id+' の対象 '+t+' が式に無い');
  const cm=/^C (\S+)$/.exec(k.tol);if(!['A','B','–'].includes(k.tol)&&!cm)E(f+'：'+k.id+' の判定「'+k.tol+'」が読めない（A，B，C 名前，– のどれか．数を直接書かない）');if(cm&&(!qs[cm[1]]||qs[cm[1]].kind!=='許容'))E(f+'：'+k.id+' の設定「'+cm[1]+'」が，量の表の許容に無い')}
 if(reqs)for(const f of Object.keys(e_src))for(const r of e_src[f]){if(reqs[r]===undefined)continue;if(!reqs[r].includes('docs/model/'+f)&&!OLD.includes(r))E('要求 '+r+' の本文が，式のファイル docs/model/'+f+' を指していない')}
 const byT={};for(const k of ks)for(const t of k.target){const key=t+'／'+k.type;(byT[key]=byT[key]||[]).push(k)}
 for(const key of Object.keys(byT)){const tl=[...new Set(byT[key].map(k=>k.tol))];if(tl.length>1)notes.push('同じ対象と種類に，違う判定：'+key+' → '+byT[key].map(k=>k.id+'（'+k.crit+'，'+k.tol+'）').join('，'))}
 /* 覆い：確かめること 1 行が判定するのは，その行の「対象」の式（その検査が，誤りを見分けるように作られた式）．
    たどって通るだけの式は数えない（管の式は互いにつながっていて，どの検査もほとんどの式を通るので，区別にならない）．
    保存は，系の全体で 3 つ（質量，エネルギー，原子）にまとめ，釣り合いの式と状態量の式の全部を対象にする．
    どの行の対象にもならない式には，「式との一致」（基準の値を 1 組入れて，式の値と比べる）を自動で付ける． */
 const bal=eqs.filter(e=>e.kind==='釣り合い'||e.defines.some(q=>qs[q]&&qs[q].kind==='状態')).map(e=>e.id);
 const cov={};for(const k of ks)cov[k.id]=new Set(k.target);
 const cnt={};for(const e of eqs)cnt[e.id]=ks.filter(k=>cov[k.id].has(e.id)).length;
 const lone=eqs.filter(e=>cnt[e.id]===0&&!bal.includes(e.id));
 const sig={};for(const k of ks){const g=k.crit+'／'+k.type+'／'+[...k.target].sort().join(' ');(sig[g]=sig[g]||[]).push(k.id)}
 for(const g of Object.keys(sig))if(sig[g].length>1)notes.push('同じ要求・種類・対象の行が重なっている（1 つにまとめられないか）：'+sig[g].join(' ')+'（'+g+'）');
 /* 報告 */
 const o=['# 検査の結果（自動生成）','','`npm run model` が作る．手で書き換えない．定めは `README.md`．','','量 '+Object.keys(qs).length+' 個，式 '+eqs.length+' 本，確かめること '+ks.length+' 行．','','## 1. 誤り','',errors.length?errors.map(e=>'- '+e).join('\n'):'無し．','','## 2. 知らせ（誤りではない）','',notes.length?notes.map(e=>'- '+e).join('\n'):'無し．','','## 3. 節点ごとの，量と，それを定める式','','切替の形ごと．「使う式」は，その量が現れるほかの式．'];
 for(const r of rep){if(r.F.label&&!r.es.some(e=>e.variant===r.F.label))continue;o.push('','### '+r.node+'［'+r.form+'］','','| 量 | 意味 | 種類 | 定める式 | 使う式 |','| :--- | :--- | :--- | :--- | :--- |');const act=eqs.filter(e=>active(e,r.F));
  for(const q of r.us)o.push('| '+q+' '+qs[q].tex+' | '+qs[q].mean+' | '+qs[q].kind+' | '+(act.filter(e=>e.defines.includes(q)).map(e=>e.id).join(' ')||'**無し**')+' | '+(act.filter(e=>e.uses.includes(q)).map(e=>e.id).join(' ')||'–')+' |')}
 o.push('','## 4. 検査の数と，式ごとの対象','','検査は 3 種類だけ：(1) 表に書いた行（対象の式の誤りを見分けるもの），(2) 保存（系の全体で，質量，エネルギー，原子の 3 つ．釣り合いの式と状態量の式の全部が対象），(3) 式との一致（どの行の対象にもならない式だけ．基準の値を 1 組）．','',
  '数：表の行 '+ks.length+'，保存 3，式との一致 '+lone.length+'（計 '+(ks.length+3+lone.length)+'）．式 '+eqs.length+' 本のうち，表の行が対象にする式 '+eqs.filter(e=>cnt[e.id]>0).length+' 本，保存だけが対象にする式 '+eqs.filter(e=>cnt[e.id]===0&&bal.includes(e.id)).length+' 本．','','| 式 | 題 | 表の行 | 保存 | 式との一致 |','| :--- | :--- | :--- | :--- | :--- |');
 for(const e of eqs)o.push('| '+e.id+' | '+e.title+' | '+(ks.filter(k=>cov[k.id].has(e.id)).map(k=>k.id).join(' ')||'–')+' | '+(bal.includes(e.id)?'○':'')+' | '+(lone.includes(e)?'○':'')+' |');
 return{errors,notes,report:o.join('\n')+'\n',eqs,qs,ks,cov,bal,lone}}
function readAll(){const files={};for(const f of fs.readdirSync(dir))if(f.endsWith('.md')&&f!=='REPORT.md'&&f!=='README.md')files[f]=fs.readFileSync(path.join(dir,f),'utf8');
 const reqs={};for(const f of Object.keys(files))for(const m of files[f].matchAll(/\b(R-\d\d)\b/g))if(!reqs[m[1]])reqs[m[1]]=fs.readFileSync(path.join(root,'docs/requirements',m[1]+'.md'),'utf8');return{files,reqs}}
/* 承認のしるし：要求ごとに，その要求が指す式のファイルの中身と，確かめることの行から作ったハッシュ．
   承認したときに docs/model/approved.json に書く（decide.js）．承認の後で式や行が変わると，検査が知らせる． */
function reqHash(files,r){const h=require('crypto').createHash('sha1');
 for(const f of Object.keys(files).filter(f=>/^eq-/.test(f)).sort()){const m=/^source: (.*)$/m.exec(files[f]);if(m&&m[1].split(/\s+/).includes(r))h.update(f+'\n'+files[f])}
 for(const f of Object.keys(files).filter(f=>/^checks-/.test(f)).sort())for(const l of files[f].split('\n'))if(new RegExp('^\\| K-\\d+ \\| '+r+' \\|').test(l))h.update(l+'\n');
 return h.digest('hex').slice(0,16)}
const apFile=path.join(dir,'approved.json'),readAp=()=>fs.existsSync(apFile)?JSON.parse(fs.readFileSync(apFile,'utf8')):{};
function stale(files){const ap=readAp(),out=[];for(const r of Object.keys(ap).sort()){const f=path.join(root,'docs/requirements',r+'.md');if(!fs.existsSync(f))continue;
  if(/^status: 承認$/m.test(fs.readFileSync(f,'utf8'))&&ap[r]!==reqHash(files,r))out.push(r)}return out}
module.exports={analyze,readAll,dir,reqHash,readAp,apFile,stale};
if(require.main===module){const{files,reqs}=readAll(),A=analyze(files,reqs),args=process.argv.slice(2);
 if(args[0]==='--impact'){for(const q of args.slice(1)){if(!A.qs[q]){console.log(q+' は量の表に無い');continue}const es=A.eqs.filter(e=>e.defines.includes(q)||e.uses.includes(q));
   console.log(q+'（'+A.qs[q].mean+'）\n  定める式：'+(es.filter(e=>e.defines.includes(q)).map(e=>e.id).join(' ')||'–')+'\n  使う式：'+(es.filter(e=>e.uses.includes(q)).map(e=>e.id).join(' ')||'–'));
   const ks=A.ks.filter(k=>k.target.some(t=>es.some(e=>e.id===t)));console.log('  確かめること：'+(ks.map(k=>k.id).join(' ')||'–')+'\n  承認を確かめ直す要求：'+([...new Set(ks.map(k=>k.crit))].join(' ')||'–'))}process.exit(0)}

 if(args[0]==='--scope'){const node=args[1],es=A.eqs.filter(e=>e.node===node);if(!es.length){console.log('節点 '+node+' に式が無い');process.exit(1)}
  const fl=[...new Set(es.map(e=>e.file))],q=[...new Set(es.flatMap(e=>[...e.defines,...e.uses]))].sort(),ks=A.ks.filter(k=>k.target.some(t=>es.some(e=>e.id===t)));
  console.log('節点 '+node+'：読むのは次だけ\n  '+fl.map(f=>'docs/model/'+f+'（'+[...files[f]].length+' 字）').join('\n  ')+'\n  量（'+q.length+' 個．量の表のこの行だけ）：'+q.join(' ')+'\n  確かめること：'+(ks.map(k=>k.id).join(' ')||'–')+'\n  要求：'+[...new Set(fl.flatMap(f=>(/^source: (.*)$/m.exec(files[f])||[])[1].split(' ')))].join(' '));process.exit(0)}
 if(args[0]==='--tests'){const ids=args.slice(1),hit=A.ks.filter(k=>ids.some(i=>A.cov[k.id].has(i))),b=ids.some(i=>A.bal.includes(i)),l=ids.filter(i=>A.lone.some(e=>e.id===i));
  console.log('式 '+ids.join(' ')+' を変えたときに，やり直す検査：\n  表の行（'+hit.length+' ／ '+A.ks.length+'）：'+(hit.map(k=>k.id+'（'+k.crit+'，'+k.type+'）').join(' ')||'–')+'\n  保存：'+(b?'やり直す（3 つ）':'やり直さない')+'\n  式との一致：'+(l.join(' ')||'–')+'\n承認を確かめ直す要求：'+([...new Set(hit.map(k=>k.crit))].sort().join(' ')||'（表の行が無い．式のファイルの source の要求）'));process.exit(0)}
 if(args[0]==='--page'){require('./model_page.js').write(A,files,args[1],args.slice(2));process.exit(0)}
 const dst=path.join(dir,'REPORT.md');
 if(A.errors.length)console.log('[式と量の検査] 誤り '+A.errors.length+' 件\n'+A.errors.join('\n'));
 const st=stale(files);if(st.length){console.log('[式と量の検査] 承認の後で，式か確かめることが変わった要求：'+st.join(' ')+'\n  → npm run decide -- 案 '+st.join(' ')+' で戻し，変えた所を示して承認を確かめ直す');if(args.includes('--check'))process.exit(1)}
 if(args.includes('--check')){if(A.errors.length)process.exit(1);if((fs.existsSync(dst)?fs.readFileSync(dst,'utf8'):'')!==A.report){console.log('[式と量の検査] docs/model/REPORT.md が古い（npm run model で作り直す）');process.exit(1)}console.log('式と量の検査 OK（量 '+Object.keys(A.qs).length+'，式 '+A.eqs.length+'，確かめること '+A.ks.length+'）')}
 else{fs.writeFileSync(dst,A.report);console.log('docs/model/REPORT.md を書いた．誤り '+A.errors.length+'，知らせ '+A.notes.length);process.exit(A.errors.length?1:0)}}
