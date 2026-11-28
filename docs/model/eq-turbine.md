---
node: タービン
source: D-16 D-25 R-26 R-29
---

# 式：タービン（single-scroll と twin-scroll）

### E-T01：膨張比
- defines: pi_t
- uses: p03 p4
- variant: タービンの入口=single

```math
\pi_t = \frac{p_{03}}{p_4}
```

### E-T02：修正回転数
- defines: N_corr_t
- uses: omega_tc T03 T_ref
- variant: タービンの入口=single

```math
N_{corr,t} = \frac{\omega_{tc}}{\sqrt{T_{03}/T_{ref}}}
```

### E-T03：等エントロピーの落差
- defines: dh_s
- uses: h03 T03 p03 p4
- variant: タービンの入口=single

```math
\Delta h_s = h_{03} - h\big(T_{4s}\big), \qquad s(T_{4s},\ p_4) = s(T_{03},\ p_{03})
```

### E-T04：等エントロピーの膨張の速度
- defines: C_s
- uses: dh_s
- variant: タービンの入口=single

```math
C_s = \sqrt{2\,\Delta h_s}
```

### E-T05：周速
- defines: U
- uses: D_t omega_tc

```math
U = \tfrac12 D_t\,\omega_{tc}
```

### E-T06：効率（速度比の 2 次式．広く使われる形だが，出典はこの場では開いて確かめられていない）
- defines: eta_t
- uses: U C_s eta_t_max nu_opt
- assumes: タービンの特性=準定常
- variant: タービンの入口=single

```math
\eta_t = \max\!\left(\eta_{t,max}\left[1 - \left(\frac{\nu - \nu_{opt}}{\nu_{opt}}\right)^2\right],\ 0\right), \qquad \nu = \frac{U}{C_s}
```

### E-T07：流量（翼車の絞り．スクロールの出口の絞りと直列）
- defines: mdot_t
- uses: A_r p_m T03 p4
- assumes: タービンの特性=準定常
- variant: タービンの入口=single

```math
\dot m_t = A_r\,\frac{p_m}{\sqrt{R T_{03}}}\,\Psi\!\left(\frac{p_4}{p_m}\right)
```

### E-T08：仕事率
- defines: P_t
- uses: eta_t mdot_t dh_s
- variant: タービンの入口=single

```math
P_t = \eta_t\,\dot m_t\,\Delta h_s
```

### E-T09：出口へ入る全 enthalpy
- defines: Hd_t_out
- kind: 釣り合い
- uses: mdot_t h03 P_t
- variant: タービンの入口=single

```math
\dot H_{t,out} = \dot m_t\,h_{03} - P_t
```

### E-T10：スクロールの出口と翼車の間の圧力（single-scroll．絞りの流量 = 翼車の流量）
- defines: p_m
- uses: A_n p03 T03 mdot_t
- variant: タービンの入口=single

```math
2A_n\,\frac{p_{03}}{\sqrt{R T_{03}}}\,\Psi\!\left(\frac{p_m}{p_{03}}\right) = \dot m_t
```

### E-W01：絞り 1（twin-scroll）
- defines: mdot_1
- uses: A_n p01s T01s p_m H_m
- variant: タービンの入口=twin

```math
\dot m_1 = \begin{cases} A_n\,\dfrac{p_{01}}{\sqrt{R T_{01}}}\,\Psi\!\left(\dfrac{p_m}{p_{01}}\right) & p_{01} \ge p_m \\[2ex] -A_n\,\dfrac{p_m}{\sqrt{R T_m}}\,\Psi\!\left(\dfrac{p_{01}}{p_m}\right) & p_{01} < p_m \end{cases}
```

### E-W02：絞り 2（twin-scroll）
- defines: mdot_2
- uses: A_n p02s T02s p_m H_m
- variant: タービンの入口=twin

```math
\dot m_2 = \begin{cases} A_n\,\dfrac{p_{02}}{\sqrt{R T_{02}}}\,\Psi\!\left(\dfrac{p_m}{p_{02}}\right) & p_{02} \ge p_m \\[2ex] -A_n\,\dfrac{p_m}{\sqrt{R T_m}}\,\Psi\!\left(\dfrac{p_{02}}{p_m}\right) & p_{02} < p_m \end{cases}
```

### E-W03：翼車の流量（twin-scroll）
- defines: mdot_t
- uses: A_r p_m H_m p4
- variant: タービンの入口=twin

```math
\dot m_r = A_r\,\frac{p_m}{\sqrt{R T_m}}\,\Psi\!\left(\frac{p_4}{p_m}\right)
```

### E-W04：共通の空間の質量の釣り合い（twin-scroll）
- defines: p_m
- kind: 釣り合い
- uses: mdot_1 mdot_2 mdot_t
- variant: タービンの入口=twin

```math
\dot m_1 + \dot m_2 = \dot m_r
```

### E-W05：共通の空間の全 enthalpy（twin-scroll）
- defines: H_m
- kind: 釣り合い
- uses: mdot_1 mdot_2 H1s H2s
- variant: タービンの入口=twin

```math
H_m = \frac{\sum_{i \in \mathcal I} \dot m_i H_i}{\sum_{i \in \mathcal I} \dot m_i}, \qquad \mathcal I = \{ i : \dot m_i > 0 \}
```

### E-W06：等エントロピーの落差 1（twin-scroll）
- defines: dh_s1
- uses: H1s T01s p01s p4
- variant: タービンの入口=twin

```math
\Delta h_{s,1} = h(T_{01}) - h(T_{4s,1}), \qquad s(T_{4s,1},\ p_4) = s(T_{01},\ p_{01})
```

### E-W07：等エントロピーの落差 2（twin-scroll）
- defines: dh_s2
- uses: H2s T02s p02s p4
- variant: タービンの入口=twin

```math
\Delta h_{s,2} = h(T_{02}) - h(T_{4s,2}), \qquad s(T_{4s,2},\ p_4) = s(T_{02},\ p_{02})
```

### E-W08：仕事率（twin-scroll．仮定）
- defines: P_t
- uses: mdot_1 mdot_2 mdot_t dh_s1 dh_s2 U
- assumes: タービンの特性=準定常
- variant: タービンの入口=twin

```math
P_t = \sum_{i \in \mathcal I} \eta_t\!\left(\frac{U}{\sqrt{2\Delta h_{s,i}}}\right) \dot m_i\,\frac{\dot m_r}{\sum_{j \in \mathcal I} \dot m_j}\,\Delta h_{s,i}
```

### E-W09：出口へ入る全 enthalpy（twin-scroll）
- defines: Hd_t_out
- kind: 釣り合い
- uses: mdot_t H_m P_t
- variant: タービンの入口=twin

```math
\dot H_{t,out} = \dot m_r\,H_m - P_t
```
