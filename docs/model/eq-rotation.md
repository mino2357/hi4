---
node: 回転系
source: D-14 R-19 R-36
---

# 式：回転系と動力計

### E-D01：クランク角
- defines: theta
- uses: omega

```math
\frac{d\theta}{dt} = \omega
```

### E-D02：角速度（回転数を一定に保つ運転）
- defines: omega
- uses:
- variant: 回転=一定

```math
\frac{d\omega}{dt} = 0
```

### E-D03：角速度（回転数が自由な運転）
- defines: omega
- uses: I_eng T_g T_in T_f T_L
- kind: 釣り合い
- variant: 回転=自由

```math
I\,\frac{d\omega}{dt} = T_g + T_{in} - T_f - T_L
```

### E-D04：ガス圧によるトルク
- defines: T_g
- uses: p_cyl p_cc dVdth

```math
T_g = \sum_{n=1}^{4} (p_n - p_{cc})\,\frac{dV_n}{d\theta}
```

### E-D05：往復質量の慣性によるトルク
- defines: T_in
- uses: m_rec x_p omega

```math
T_{in} = -\sum_{n=1}^{4} m_{rec}\,\frac{d^2 x_{p,n}}{dt^2}\,\frac{dx_{p,n}}{d\theta}
```

### E-D06：摩擦のトルク（式は仕様）
- defines: T_f
- uses: omega p_cyl

```math
T_f = T_f(\omega,\ p)
```

### E-D07：動力計のトルク（回転数を保つ制御か，与えた値．制御則は仕様）
- defines: T_L
- uses: omega
- variant: 負荷=動力計

```math
T_L = \mathcal C_L(\omega - \omega_{target}) \quad \text{または} \quad T_L = T_{L,set}
```

### E-D08：車両をつないだときの負荷のトルク（走行抵抗と，車両の加速の分）
- defines: T_L
- uses: F_res m_veh v_veh r_w i_g i_f eta_dr
- variant: 負荷=車両

```math
T_L = \left(F_r + m_v\,\frac{dv}{dt}\right)\frac{r_w}{i_g\,i_f\,\eta_d}
```
