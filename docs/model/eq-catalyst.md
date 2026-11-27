---
node: 触媒
source: R-33
---

# 式：触媒（担体の温度，表面の反応，酸素の吸蔵）

気体の側は管の式で，壁温 $T_w$ が担体の温度になる（担体の温度の式は `eq-wall.md` の E-U02．気体と担体の間の熱は，管の壁の式 E-F05 の $q_w$ をそのまま使い，別の熱伝達率は置かない）．表面の反応の発熱は，別に加える項ではない：反応する成分が気体から表面へ移るときに持ち去る全 enthalpy（生成 enthalpy を含む）と，生成物が戻すものの差が，担体に入る．反応に加わる種は，CO，NO，燃料の蒸気（未燃の炭化水素），酸素．水素は，拘束した平衡（E-R02）に従うので，酸素があれば残らない．

### E-CA02：物質移動係数
- defines: km
- uses: Sh_cat Dk_g D
- variant: 触媒の反応=入

```math
k_{m,k} = \frac{Sh\,D_k}{D_h}
```

### E-CA03：表面の釣り合い（表面に溜めない）
- defines: Ys
- uses: km S_cat rho Y r_cat
- kind: 釣り合い
- variant: 触媒の反応=入

```math
k_{m,k}\,S\,\rho\,(Y_k - Y_{k,s}) = -M_k \sum_j \nu_{kj}\,r_j
```

### E-CA04：表面の反応の速さ（式は仕様．阻害の項を持つ形．出典の候補は Voltz ほか 1973）
- defines: r_cat
- uses: Ys Tw psi_ox k_cat Gam_O
- variant: 触媒の反応=入

```math
\begin{aligned}
r_1 &: \mathrm{CO} + \tfrac12\mathrm{O_2} \to \mathrm{CO_2} \\
r_2 &: \text{燃料} + \mathrm{O_2} \to \mathrm{CO_2} + \mathrm{H_2O} \\
r_3 &: \mathrm{CO} + \mathrm{NO} \to \mathrm{CO_2} + \tfrac12\mathrm{N_2} \\
r_4 &: \mathrm{Ce_2O_3} + \tfrac12\mathrm{O_2} \to 2\,\mathrm{CeO_2} \quad (\text{吸蔵}) \\
r_5 &: 2\,\mathrm{CeO_2} + \mathrm{CO} \to \mathrm{Ce_2O_3} + \mathrm{CO_2} \quad (\text{放出})
\end{aligned}
\qquad r_j = r_j\big(T_w,\ Y_{k,s},\ \psi\big)
```

### E-CA05：気体の成分の出入り（反応が切）
- defines: w_cat
- uses:
- variant: 触媒の反応=切

```math
\dot\omega_{k,cat} = 0
```

### E-CA06：気体の成分の出入り（反応が入）
- defines: w_cat
- uses: km S_cat rho Y Ys
- variant: 触媒の反応=入

```math
\dot\omega_{k,cat} = -k_{m,k}\,S\,\rho\,(Y_k - Y_{k,s})
```

### E-CA07：表面との出入りが気体から持ち去る全 enthalpy
- defines: qE_cat
- uses: w_cat h_k T

```math
\dot q_{E,cat} = \sum_k \dot\omega_{k,cat}\,h_k(T)
```

### E-CA09：酸素の吸蔵の割合
- defines: psi_ox
- uses: r_cat Gam_O
- kind: 釣り合い
- variant: 触媒の反応=入

```math
\Gamma\,\frac{d\psi}{dt} = 2\,(r_4 - r_5), \qquad 0 \le \psi \le 1
```

### E-CA10：浄化率
- defines: conv
- uses: Fend

```math
\eta_k = 1 - \frac{\oint \dot m_{k,out}\,dt}{\oint \dot m_{k,in}\,dt}
```
