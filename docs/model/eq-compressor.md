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

### E-C03：圧力比（map．式は Q-08）
- defines: Pi_c
- uses: mdot_corr N_corr

```math
\Pi_c = \Pi_c(\dot m_{corr},\ N_{corr})
```

### E-C04：効率（map．式は Q-08）
- defines: eta_c
- uses: mdot_corr N_corr

```math
\eta_c = \mathrm{H}_c(\dot m_{corr},\ N_{corr})
```

### E-C05：流量の運動方程式
- defines: mdot_c
- uses: p01 Pi_c p2 L_c A_c
- assumes: コンプレッサの流量=状態量

```math
\frac{L_c}{A_c}\,\frac{d\dot m_c}{dt} = p_{01}\,\Pi_c - p_2
```

### E-C06：等エントロピーの圧縮の出口
- defines: h02s
- uses: T01 p01 Pi_c

```math
h_{02s} = h\big(T_{02s}\big), \qquad s(T_{02s},\ p_{01}\Pi_c) = s(T_{01},\ p_{01})
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
