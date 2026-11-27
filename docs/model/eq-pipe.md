---
node: 流れ
source: D-02 D-05 D-06 R-01 R-02 R-06
---

# 式：管の中の流れ（準 1 次元の保存形と，有限体積法）

### E-P01：質量
- defines: rhoA
- uses: Fhat A Vcell
- kind: 釣り合い

```math
\mathcal V_i\,\frac{d\rho_i}{dt} = -\left(A_{i+1/2}\hat F^{(m)}_{i+1/2} - A_{i-1/2}\hat F^{(m)}_{i-1/2}\right)
```

### E-P02：運動量（断面積の項は，静止を保つ形）
- defines: rhouA
- uses: Fhat A Vcell p tau_w D

```math
\mathcal V_i\,\frac{d(\rho u)_i}{dt} = -\left(A_{i+1/2}\hat F^{(p)}_{i+1/2} - A_{i-1/2}\hat F^{(p)}_{i-1/2}\right) + p_i\,(A_{i+1/2} - A_{i-1/2}) - \mathcal V_i\,\frac{4}{D}\,\tau_{w,i}
```

### E-P03：全エネルギー
- defines: rhoEA
- uses: Fhat A Vcell q_w D qE_cat
- kind: 釣り合い

```math
\mathcal V_i\,\frac{d(\rho E)_i}{dt} = -\left(A_{i+1/2}\hat F^{(E)}_{i+1/2} - A_{i-1/2}\hat F^{(E)}_{i-1/2}\right) + \mathcal V_i\left(\frac{4}{D}\,q_{w,i} + \dot q_{E,cat,i}\right)
```

### E-P04：成分（CO と NO は気体の中の反応で変わる．触媒の中では，表面との出入りが加わる）
- defines: rhoYA
- uses: Fhat A Vcell omega_k w_cat
- kind: 釣り合い
- assumes: 組成=4 成分と CO，NO，酸素の過不足; 管の中の反応=CO と NO の反応速度

```math
\mathcal V_i\,\frac{d(\rho Y_k)_i}{dt} = -\left(A_{i+1/2}\hat F^{(k)}_{i+1/2} - A_{i-1/2}\hat F^{(k)}_{i-1/2}\right) + \mathcal V_i\left(\dot\omega_{k,i} + \dot\omega_{k,cat,i}\right), \qquad \sum_k \dot\omega_k = 0
```

### E-P05：密度
- defines: rho
- uses: rhoA A

```math
\rho = \frac{\rho A}{A}
```

### E-P06：流速
- defines: u
- uses: rhouA rhoA

```math
u = \frac{\rho u A}{\rho A}
```

### E-P07：比全エネルギー
- defines: Etot
- uses: rhoEA rhoA

```math
E = \frac{\rho E A}{\rho A}
```

### E-P08：質量分率
- defines: Y
- uses: rhoYA rhoA

```math
Y_k = \frac{\rho Y_k A}{\rho A}
```

### E-P09：比内部エネルギー
- defines: e
- uses: Etot u

```math
e = E - \tfrac12 u^2
```

### E-P10：再構成（原始変数の区分線形．勾配を制限する）
- defines: Wface
- uses: rho u p Y dx

```math
W^{L}_{i+1/2} = W_i + \tfrac12\,\phi(\Delta_{i-1/2}, \Delta_{i+1/2}), \qquad W^{R}_{i-1/2} = W_i - \tfrac12\,\phi(\Delta_{i-1/2}, \Delta_{i+1/2}), \qquad \Delta_{i+1/2} = W_{i+1} - W_i
```

### E-P11：数値流束（HLLC）
- defines: Fhat
- uses: Wface a Htot

```math
\hat F_{i+1/2} = F^{\mathrm{HLLC}}\big(W^{L}_{i+1/2},\ W^{R}_{i+1/2}\big), \qquad F = \big(\rho u,\ \rho u^2 + p,\ \rho H u,\ \rho Y_k u\big)
```

### E-P12：時間の刻み
- defines: dt
- uses: CFL dx u a

```math
\Delta t = \mathrm{CFL} \times \min_i \frac{\Delta x_i}{\lvert u_i\rvert + a_i}
```
