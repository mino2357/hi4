#!/usr/bin/env node
/* 式と量の検査（model.js）の自己検査：今の文書にわざと食い違いを入れ，検査がそれを見つけることを確かめる．
   文書そのものは書き換えない（読み込んだ本文の写しを変える）．使い方： node tools/dev/model_selftest.js */
'use strict';
const M=require('./model.js'),{files,reqs}=M.readAll();
const base=M.analyze(files,reqs);if(base.errors.length){console.log('もとの文書に誤りがある．先に直す：\n'+base.errors.join('\n'));process.exit(1)}
const rep=(f,a,b)=>F=>{if(!F[f].includes(a))throw new Error('自己検査の置き換えの相手が無い：'+f+'：'+a);F[f]=F[f].replace(a,b)};
const add=(f,t)=>F=>{F[f]+=t};
const cut=(f,id)=>F=>{const p=F[f].split(/^(?=### )/m),n=p.length;F[f]=p.filter(b=>!b.startsWith('### '+id+'：')).join('');if(F[f].split(/^(?=### )/m).length!==n-1)throw new Error('自己検査：式 '+id+' が無い')};
const T=[
 ['余分な条件（旧案「2 つの入口の間に流れが無い」）を式として加える',add('eq-turbine.md','\n### E-W10：2 つの入口の間に流れが無い\n- defines:\n- uses: mdot_1 mdot_2\n- variant: タービンの入口=twin\n\n```math\n\\dot m_1 \\ge 0,\\ \\dot m_2 \\ge 0\n```\n'),['式 E-W10 が定める量が 0 個','式 E-W10（2 つの入口の間に流れが無い）に対応する量が無い'],'errors'],
 ['式の仮定を，決定と違う値にする',rep('eq-compressor.md','- assumes: コンプレッサの流量=状態量','- assumes: コンプレッサの流量=圧力比から逆算'),['仮定の食い違い'],'errors'],
 ['同じ量を 2 本の式で定める',add('eq-compressor.md','\n### E-C09：動力（別の式）\n- defines: P_c\n- uses: mdot_c h02s h01 eta_c\n\n```math\nP_c = \\dot m_c (h_{02s} - h_{01})/\\eta_c\n```\n'),['量 P_c を定める式が 2 本ある'],'errors'],
 ['量を定める式を消す',cut('eq-turbine.md','E-W05'),['量 H_m（twin-scroll：共通の空間の比全 enthalpy）を定める式が無い','に対応する式が無い（式が足りない）'],'errors'],
 ['定義していない量を使う',rep('eq-shaft.md','- uses: I_tc eta_m P_t P_c','- uses: I_tc eta_m P_t P_c x_rg'),['量 x_rg が量の表に無い'],'errors'],
 ['許容値を数で直接書く',rep('checks-turbo.md','| eps_int |','| 1e-6 |'),['K-06 の許容「1e-6」が，量の表の許容に無い'],'errors'],
 ['確かめることの対象に，無い式を書く',rep('checks-turbo.md','| K-07 | R-26 | 極限 | E-G01 |','| K-07 | R-26 | 極限 | E-G09 |'),['K-07 の対象 E-G09 が式に無い'],'errors'],
 ['同じ対象と種類に，違う許容値を掛ける',add('checks-turbo.md','| K-16 | R-25 | 極限 | E-C05 | 別の許容 | eps_int |\n'),['同じ対象と種類に，違う許容値：E-C05／極限'],'notes'],
 ['要求の本文が式のファイルを指していない',F=>{F.__req=r=>r.replace('docs/model/eq-shaft.md','docs/model/eq-xxx.md')},['要求 R-27 の本文が，式のファイル docs/model/eq-shaft.md を指していない'],'errors'],
 ['入力の量を式で定める',rep('eq-boost.md','- defines: p_boost\n','- defines: p_st\n'),['種類「入力」の量 p_st を定めている'],'errors'],
];
let bad=0;for(const[name,mut,want,where]of T){const F=Object.assign({},files);mut(F);const RQ=Object.assign({},reqs);if(F.__req){for(const k of Object.keys(RQ))RQ[k]=F.__req(RQ[k]);delete F.__req}const A=M.analyze(F,RQ),out=A[where].join('\n'),miss=want.filter(w=>!out.includes(w));
 console.log((miss.length?'FAIL':'PASS')+'  '+name+(miss.length?'\n      見つからなかった：'+miss.join('／')+'\n      出たもの：'+(out||'（無し）'):''));if(miss.length)bad++}
console.log(bad?'自己検査 FAIL '+bad+' 件':'自己検査 PASS（'+T.length+' 件．どの食い違いも検出された）');process.exit(bad?1:0);
