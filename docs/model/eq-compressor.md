---
node: コンプレッサ
source: D-15 R-25
---

# 式：コンプレッサ

### E-C01：修正流量
- defines: mdot_corr
- uses: mdot_c T01 p01 T_ref p_ref

```math
\dot m_{corr} = \dot m_c\,\frac{\sqrt{T_{01}/T_{ref}}}{p_{01}/p_{ref}}
```

### E-C02：修正回転数
- defines: N_corr
- uses: omega_tc T01 T_ref

```math
N_{corr} = \frac{\omega_{tc}}{\sqrt{T_{01}/T_{ref}}}
```

### E-C03：圧力比（等エントロピーの圧縮の出口の状態から）
- defines: Pi_c
- uses: h02s T01 p01

```math
s\big(T_{02s},\ p_{01}\Pi_c\big) = s\big(T_{01},\ p_{01}\big), \qquad h(T_{02s}) = h_{02s}
```

### E-C04：効率（流量係数の 2 次式．置いた形で，文献の式ではない）
- defines: eta_c
- uses: Phi_c Phi_opt eta_c_max eta_c_min

```math
\eta_c = \max\!\left(\eta_{c,max}\left[1 - \left(\frac{\Phi_c - \Phi_{opt}}{\Phi_{opt}}\right)^2\right],\ \eta_{c,min}\right)
```

### E-C05：流量の運動方程式
- defines: mdot_c
- uses: p01 Pi_c p2 L_c A_c
- assumes: コンプレッサの流量=状態量

```math
\frac{L_c}{A_c}\,\frac{d\dot m_c}{dt} = p_{01}\,\Pi_c - p_2
```

### E-C06：等エントロピーの圧縮の出口の比 enthalpy（揚程係数の定義）
- defines: h02s
- uses: h01 Psi_c U_c

```math
h_{02s} = h_{01} + \Psi_c\,\tfrac12 U_c^2
```

### E-C07：出口の比 enthalpy（効率の定義）
- defines: h02
- uses: h01 h02s eta_c

```math
h_{02} = h_{01} + \frac{h_{02s} - h_{01}}{\eta_c}
```

### E-C08：動力
- defines: P_c
- kind: 釣り合い
- uses: mdot_c h02 h01

```math
P_c = \dot m_c\,(h_{02} - h_{01})
```

### E-C09：翼の先端の周速
- defines: U_c
- uses: D_c omega_tc

```math
U_c = \tfrac12 D_c\,\omega_{tc}
```

### E-C10：流量係数
- defines: Phi_c
- uses: mdot_c p01 T01 D_c U_c

```math
\Phi_c = \frac{\dot m_c}{\rho_{01}\,\frac{\pi}{4} D_c^2\,U_c}, \qquad \rho_{01} = \frac{p_{01}}{R\,T_{01}}
```

### E-C11：揚程係数の曲線（Moore と Greitzer 1986 の 3 次式．逆流の側まで定義される）
- defines: Psi_c
- uses: Phi_c Psi_0 H_psi W_phi
- assumes: コンプレッサの流量=状態量

```math
\Psi_c = \Psi_0 + H\left[1 + \frac32\left(\frac{\Phi_c}{W} - 1\right) - \frac12\left(\frac{\Phi_c}{W} - 1\right)^3\right]
```
