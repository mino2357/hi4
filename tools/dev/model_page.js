/* 承認用のページ：式の断片（docs/model/）から，数式を組んだ HTML を作る（手で書き写さない）．
   使い方： node tools/dev/model.js --page 出力.html [節点…]   節点を省くと全部．
   数式の中の「<」「&」は，HTML として解釈されないように置き換える． */
'use strict';
const fs=require('fs');
const tex=s=>s.replace(/&/g,'&amp;').replace(/</g,'\\lt ').replace(/>/g,'\\gt ');
const inl=s=>s.replace(/\$([^$]+)\$/g,(m,x)=>'\\('+tex(x)+'\\)').replace(/`([^`]+)`/g,'<code>$1</code>');
function write(A,files,out,nodes){const want=nodes.length?nodes:[...new Set(A.eqs.map(e=>e.node))],o=[];
 o.push('<title>過給の式</title>','<meta name="claude:viewport-fit-sides" content="cover">','<style>',
 ':root{--bg:#fbfcfd;--fg:#17212b;--mute:#566575;--line:#d5dde5;--soft:#eef2f6;--accent:#0b5c8a;--body:"Hiragino Sans","Noto Sans JP","Yu Gothic UI",system-ui,sans-serif;--mono:ui-monospace,Menlo,Consolas,monospace}',
 '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#12171c;--fg:#e4eaf0;--mute:#9babb9;--line:#2c3742;--soft:#1b232b;--accent:#6cb8e6;color-scheme:dark}}',
 ':root[data-theme="dark"]{--bg:#12171c;--fg:#e4eaf0;--mute:#9babb9;--line:#2c3742;--soft:#1b232b;--accent:#6cb8e6;color-scheme:dark}',
 'body{background:var(--bg);color:var(--fg);font-family:var(--body);font-size:16px;line-height:1.8;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:28px 56px}',
 'main{max-width:46rem;margin:0 auto;display:flex;flex-direction:column;gap:12px}h1{font-size:1.5rem;line-height:1.35;margin:0}h2{font-size:1.2rem;margin:24px 0 0;padding-top:16px;border-top:1px solid var(--line)}h3{font-size:1rem;margin:12px 0 0;color:var(--accent)}p,ul{margin:0}ul{padding-left:1.3em}',
 '.eq{overflow-x:auto;padding:4px 0}.tw{overflow-x:auto}table{border-collapse:collapse;width:100%;min-width:30rem;font-size:.9rem;line-height:1.55}th,td{text-align:left;vertical-align:top;padding:6px 9px;border-bottom:1px solid var(--line)}th{background:var(--soft);white-space:nowrap}',
 '.m{color:var(--mute);font-size:.88rem}code{font-family:var(--mono);font-size:.88em}.tag{display:inline-block;background:var(--soft);padding:0 7px;margin-right:6px;font-size:.82rem}mjx-container{color:var(--fg)}','</style>',
 "<script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script>",
 '<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.js"></script>','<main>',
 '<h1>過給の式（承認用．式の断片から自動で作ったページ）</h1>',
 '<p class="m">式の正本は <code>docs/model/eq-*.md</code>．どの式にも「式との一致」が，釣り合いの式と状態量の式には「保存」が，自動で確かめることとして付く．ここに並べる「確かめること」は，それ以外のものだけ．</p>',
 '<p class="m">判定：A は丸めの上界 \\(\\lvert r\\rvert\\le c\\,\\gamma_N S\\)，B は収束の次数 \\(p_{obs}\\ge p-\\delta\\)，C は名前を付けた設定，– は数で判定しないもの．自動で付く「式との一致」と「保存」は A．</p>');
 for(const node of want){const es=A.eqs.filter(e=>e.node===node);if(!es.length)continue;o.push('<h2>'+node+'</h2>');
  const q=[...new Set(es.flatMap(e=>[...e.defines,...e.uses]))].filter(x=>A.qs[x]);
  o.push('<div class="tw"><table><tr><th>記号</th><th>意味</th><th>単位</th><th>種類</th></tr>'+q.map(x=>'<tr><td>'+inl(A.qs[x].tex)+'</td><td>'+inl(A.qs[x].mean)+'</td><td>'+A.qs[x].unit+'</td><td>'+A.qs[x].kind+'</td></tr>').join('')+'</table></div>');
  for(const e of es){const blk=files[e.file].split(/^### /m).find(b=>b.startsWith(e.id+'：'))||'',m=/```math\n([\s\S]*?)\n```/.exec(blk),ks=A.ks.filter(k=>k.target.includes(e.id));
   o.push('<h3>'+e.id+'　'+inl(e.title)+'</h3>','<p class="m">'+(e.variant?'<span class="tag">'+e.variant+'</span>':'')+(e.kind?'<span class="tag">'+e.kind+'</span>':'')+(e.assumes?'<span class="tag">前提：'+e.assumes+'</span>':'')+'定める量：'+e.defines.map(x=>A.qs[x]?inl(A.qs[x].tex):x).join(' ')+'</p>','<div class="eq">\\['+tex(m?m[1]:'')+'\\]</div>');
   if(ks.length)o.push('<ul>'+ks.map(k=>'<li><b>'+k.type+'</b>（'+k.id+'，'+k.crit+'）：'+inl(k.text)+'　<span class="tag">判定 '+(k.tol.startsWith('C ')?'C：'+inl(A.qs[k.tol.slice(2)].tex):k.tol)+'</span>'+'</li>').join('')+'</ul>')}}
 o.push('</main>');fs.writeFileSync(out,o.join('\n')+'\n');console.log(out+' を書いた（式 '+A.eqs.filter(e=>want.includes(e.node)).length+' 本）')}
module.exports={write};
