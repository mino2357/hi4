/* 文書の断片の読み込みと点検（要件より前の段階の文書：現象 P，設計の案 D，未決 Q，企画 G）．
   hi4 の要件は R-nn（「REQ-nn」は，いつも ice_2026 の項目を指す．混ぜない）．要件もここで扱う（採用された現象から書く．利用者が承認すると status が「承認」）．
   断片は docs/<種類>/<番号>.md．先頭の「---」で囲んだ欄（キー: 値．値は空白区切りの番号の並び）を機械が読む．
   load()：{items, byId, errors}．scope(id)：その番号の作業で読むファイルの並び．
   欄と値の定め，点検の規則はこのファイルの KIND と check() が唯一の定義（CLAUDE.md と docs/INDEX.md はここから説明する）． */
'use strict';
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'../..');
const KIND={
 P:{dir:'phenomena',name:'現象',keys:['id','title','group','status','decided','instructed','weight','requires','design','mentions'],
    vocab:{status:['候補','採用','不採用'],instructed:['yes','no'],weight:['小','中','大']},heads:['見えるもの','要るもの','採らないとき']},
 D:{dir:'design',name:'設計の案',keys:['id','title','requires','ice','mentions'],vocab:{},heads:[]},
 Q:{dir:'decisions',name:'未決',keys:['id','title','status','decided','decides','affects','mentions'],
    vocab:{status:['未決','決定'],decides:['利用者','仕様']},heads:['決めること','判断の材料','選択肢','決定']},
 G:{dir:'plan',name:'企画',keys:['id','title','mentions'],vocab:{},heads:[]},
 R:{dir:'requirements',name:'要件',keys:['id','title','status','decided','phenomena','requires','design','mentions'],
    vocab:{status:['案','承認']},heads:['要求','受入基準']}};
const LIMIT={fragment:8000,scope:30000};   /* 字数の上限：断片 1 つ，1 つの番号の読む範囲の合計 */
const ALWAYS=['CLAUDE.md','docs/INDEX.md'];  /* どの作業でも読む */
const IDRE=/\b[PDQGR]-\d\d\b/g,kindOf=id=>id[0],list=s=>(s||'').split(/\s+/).filter(Boolean),len=s=>[...s].length;
function load(){const items=[],errors=[],byId={};
 for(const k of Object.keys(KIND)){const K=KIND[k],dir=path.join(root,'docs',K.dir);if(!fs.existsSync(dir))continue;
  for(const f of fs.readdirSync(dir).sort()){const file='docs/'+K.dir+'/'+f,e=m=>errors.push(file+'：'+m),text=fs.readFileSync(path.join(dir,f),'utf8');
   const m=/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/.exec(text);if(!m){e('先頭の欄（---）が無い');continue}
   const fm={},order=[];for(const l of m[1].split('\n')){const r=/^([a-z]+):(?: (.*))?$/.exec(l);if(!r){e('欄の行が読めない：'+l);continue}fm[r[1]]=(r[2]||'').trim();order.push(r[1])}
   if(order.join()!==K.keys.join())e('欄の並びが違う（正：'+K.keys.join(' ')+'）');
   const it={kind:k,file,fm,body:m[2],n:len(text),id:fm.id};
   if(f!==fm.id+'.md'||!new RegExp('^'+(K.prefix||k)+'-\\d\\d$').test(fm.id||''))e('id がファイルの名前と合わない');
   if(!fm.title)e('title が空');
   for(const v of Object.keys(K.vocab))if(!K.vocab[v].includes(fm[v]))e(v+' の値「'+fm[v]+'」は使えない（'+K.vocab[v].join('／')+'）');
   if(!m[2].startsWith('# '+fm.id+'：'))e('本文が「# '+fm.id+'：題」で始まっていない');
   const hs=[...m[2].matchAll(/^## (.*)$/gm)].map(x=>x[1]);if(K.heads.length&&hs.join()!==K.heads.join())e('見出し（##）が定めと違う（正：'+K.heads.join('，')+'）');
   if(it.n>LIMIT.fragment)e('字数 '+it.n+' が上限 '+LIMIT.fragment+' を超える（分ける）');
   if(!text.endsWith('\n')||text.endsWith('\n\n'))e('末尾の改行は 1 つ');
   items.push(it);if(byId[fm.id])e('id が重なる');byId[fm.id]=it}}
 return{items,byId,errors}}
/* 前提（requires）をたどった集まり（自分を含まない） */
function closure(byId,id,key){const seen=new Set(),go=i=>{for(const r of list(byId[i]&&byId[i].fm[key]))if(!seen.has(r)){seen.add(r);go(r)}};go(id);seen.delete(id);return[...seen].sort()}
/* 読む範囲：その番号の断片，前提（たどる），現象ならその設計の案（とその前提），その番号に関わる未決と決定．返すのは {id, why}[] */
function scope(byId,items,id){const out=[],has=new Set(),add=(i,why)=>{if(byId[i]&&!has.has(i)){has.add(i);out.push({id:i,why})}},it=byId[id];
 add(id,'対象');
 if(it.kind==='P'){for(const r of closure(byId,id,'requires'))add(r,'前提の現象');for(const d of list(it.fm.design)){add(d,'設計の案');for(const r of closure(byId,d,'requires'))add(r,'設計の案の前提')}}
 if(it.kind==='D')for(const r of closure(byId,id,'requires'))add(r,'前提');
 if(it.kind==='R'){for(const r of closure(byId,id,'requires'))add(r,'前提の要件');for(const p of list(it.fm.phenomena))add(p,'もとの現象');for(const d of list(it.fm.design)){add(d,'設計の案');for(const r of closure(byId,d,'requires'))add(r,'設計の案の前提')}}
 if(it.kind==='P')for(const q of items)if(q.kind==='R'&&list(q.fm.phenomena).includes(id))add(q.id,'この現象の要件');
 if(it.kind==='Q')for(const a of list(it.fm.affects))add(a,'決定が関わる項目');
 const ids=new Set(out.map(o=>o.id));for(const q of items)if(q.kind==='Q'&&list(q.fm.affects).some(a=>ids.has(a)))add(q.id,q.fm.status==='未決'?'関わる未決':'関わる決定');
 return out}
const scopeSize=(byId,sc)=>sc.reduce((a,o)=>a+byId[o.id].n,0);
/* 断片をまたぐ点検 */
function check(L){const{items,byId,errors}=L,E=(it,m)=>errors.push(it.file+'：'+m);
 for(const it of items){const fm=it.fm,decl=new Set([it.id,...list(fm.requires),...list(fm.design),...list(fm.affects),...list(fm.phenomena)]);
  for(const k of['requires','design','affects','mentions','phenomena'])for(const r of list(fm[k])){if(!byId[r])E(it,k+' の '+r+' が無い');
   if(k==='phenomena'&&byId[r]&&(byId[r].kind!=='P'||byId[r].fm.status!=='採用'))E(it,'phenomena は採用の現象だけ（'+r+'）');
   if(k==='requires'&&kindOf(r)!==it.kind)E(it,'requires は同じ種類の番号だけ（'+r+'）');if(k==='design'&&r[0]!=='D')E(it,'design は D だけ（'+r+'）')}
  const inBody=new Set(it.body.match(IDRE)||[]),men=new Set(list(fm.mentions));
  for(const r of inBody)if(!decl.has(r)&&!men.has(r))E(it,'本文の '+r+' が欄に無い（読む必要があれば requires／design／affects，名前を挙げるだけなら mentions）');
  for(const r of men)if(!inBody.has(r)||decl.has(r))E(it,'mentions の '+r+' は要らない');
  if(fm.requires!==undefined&&closure(byId,it.id,'requires').includes(it.id)&&list(fm.requires).length)E(it,'requires が循環している');
  if('decided' in fm){const open=['候補','未決','案'].includes(fm.status);if(open&&fm.decided)E(it,'決まっていないのに decided がある');if(!open&&!/^\d{4}-\d\d-\d\d$/.test(fm.decided))E(it,'status「'+fm.status+'」には decided（YYYY-MM-DD）が要る')}
  if(it.kind==='P'&&fm.status==='採用')for(const r of list(fm.requires))if(byId[r]&&byId[r].fm.status!=='採用')E(it,'採用だが，前提の '+r+' が「'+byId[r].fm.status+'」（利用者に確かめる）');
  if(it.kind==='Q'){const d=it.body.split('\n## 決定\n')[1]||'';if((fm.status==='未決')!==(d.trim()==='（未決）'))E(it,'status と「決定」の節が合わない')}
  if(byId[it.id]===it){const n=scopeSize(byId,scope(byId,items,it.id));if(n>LIMIT.scope)E(it,'読む範囲 '+n+' 字が上限 '+LIMIT.scope+' を超える（断片を分けるか，requires を見直す）')}}
 return errors}
module.exports={kindOf,root,KIND,LIMIT,ALWAYS,list,len,load,closure,scope,scopeSize,check};
