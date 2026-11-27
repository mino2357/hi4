---
node: 筒内の気体
source: D-11 D-23 R-12
---

# 式：筒内の気体（未燃部と既燃部の 2 ゾーン）

弁を通る流れは，管端の面の流束 $\hat F_{end}$（シリンダへ入る向きが正）．燃焼の前は未燃部だけ，燃焼の後は既燃部だけ．燃焼の終わりに，燃え残った未燃部を既燃部に混ぜる：$m_b \leftarrow m_b + m_u$，$U_b \leftarrow U_b + U_u$，成分も同じ（未燃部は $0$ にする）．弁の流れは，その時点にあるゾーンに入れる（ガス交換の間は筒内を一様とする）．

### E-Z01：未燃部の質量
- defines: m_u
- uses: Fend mdot_ev mdot_b
- kind: 釣り合い
- assumes: 筒内のゾーン=2 ゾーン; ガス交換の混ざり方=完全混合

```math
\frac{dm_u}{dt} = \sum_v \dot m_v + \dot m_{ev} - \dot m_b
```

### E-Z02：既燃部の質量
- defines: m_b
- uses: mdot_b Fend
- kind: 釣り合い

```math
\frac{dm_b}{dt} = \dot m_b + \sum_v \dot m_v\big\rvert_{\text{既燃部だけのとき}}
```

### E-Z03：未燃部のエネルギー
- defines: U_u
- uses: p_cyl V_u Qw_u mdot_b h_u Fend mdot_ev h_fl
- kind: 釣り合い

```math
\frac{dU_u}{dt} = -p\,\frac{dV_u}{dt} - \dot Q_u - \dot m_b\,h_u + \sum_v \dot m_v H_v + \dot m_{ev}\,h_{f,l}
```

### E-Z04：既燃部のエネルギー
- defines: U_b
- uses: p_cyl V_b Qw_b mdot_b h_u Fend
- kind: 釣り合い

```math
\frac{dU_b}{dt} = -p\,\frac{dV_b}{dt} - \dot Q_b + \dot m_b\,h_u + \sum_v \dot m_v H_v\big\rvert_{\text{既燃部だけのとき}}
```

### E-Z05：未燃部の成分
- defines: mY_u
- uses: Fend mdot_ev mdot_b m_u
- kind: 釣り合い

```math
\frac{d(m_u Y_{k,u})}{dt} = \sum_v \dot m_v Y_{k,v} + \delta_{k,\text{燃料}}\,\dot m_{ev} - \dot m_b\,Y_{k,u}
```

### E-Z06：既燃部の成分（移ってきた質量のうち $y_{fc}$ の燃料と，その量論の空気が，既燃ガスに変わる）
- defines: mY_b
- uses: mdot_b mY_u m_u y_fc AFst omega_k V_b Fend
- kind: 釣り合い

```math
\frac{d(m_b Y_{k,b})}{dt} = \dot m_b\,\big(Y_{k,u} + \nu_k\,y_{fc}\big) + V_b\,\dot\omega_k + \sum_v \dot m_v Y_{k,v}\big\rvert_{\text{既燃部だけのとき}}, \qquad \sum_k \nu_k = 0
```

### E-Z07：体積の和（共通の圧力を定める）
- defines: p_cyl
- uses: V_u V_b V_cyl

```math
V_u + V_b = V
```

### E-Z08：未燃部の状態方程式
- defines: V_u
- uses: p_cyl m_u mY_u Rk T_u

```math
p\,V_u = m_u R_u T_u
```

### E-Z09：既燃部の状態方程式
- defines: V_b
- uses: p_cyl m_b mY_b n_rest T_b

```math
p\,V_b = m_b R_b T_b
```

### E-Z10：未燃部の温度
- defines: T_u
- uses: U_u m_u mY_u ek

```math
\sum_k Y_{k,u}\,e_k(T_u) = \frac{U_u}{m_u}
```

### E-Z11：既燃部の温度（組成は拘束した平衡）
- defines: T_b
- uses: U_b m_b mY_b n_rest ek
- assumes: 既燃ガスの化学=拘束した平衡と反応速度

```math
e_b\big(T_b,\ p,\ \text{組成}\big) = \frac{U_b}{m_b}
```

### E-Z12：未燃部の比 enthalpy
- defines: h_u
- uses: U_u m_u p_cyl V_u

```math
h_u = \frac{U_u + p V_u}{m_u}
```

### E-Z13：吸気弁が閉じた時点の既燃ガスの割合
- defines: x_bIVC
- uses: mY_u m_u

```math
x_{b,IVC} = \left.\frac{m_u\,(Y_{ba,u} + Y_{bf,u})}{m_u}\right\rvert_{IVC}
```
