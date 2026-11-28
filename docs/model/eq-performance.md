---
node: 運転と指標
source: D-18 R-18 R-20 R-35
---

# 式：性能の指標

### E-A01：図示平均有効圧（気筒ごと）
- defines: IMEP
- uses: p_cyl dVdth Vd

```math
\mathrm{IMEP} = \frac{1}{V_d}\oint p\,dV
```

### E-A02：軸トルク（1 サイクルの平均）
- defines: T_brake
- uses: T_g T_in T_f

```math
T_b = \frac{1}{4\pi}\oint (T_g + T_{in} - T_f)\,d\theta
```

### E-A03：正味平均有効圧
- defines: BMEP
- uses: T_brake Vd

```math
\mathrm{BMEP} = \frac{4\pi\,T_b}{4 V_d}
```

### E-A04：軸出力
- defines: P_brake
- uses: T_brake omega

```math
P_b = T_b\,\bar\omega
```

### E-A05：燃料の質量流量（1 サイクルの平均）
- defines: mdot_f
- uses: m_cmd omega

```math
\dot m_f = \frac{\bar\omega}{4\pi}\sum_{n=1}^{4} m_{inj,n}
```

### E-A06：燃料消費率
- defines: BSFC
- uses: mdot_f P_brake

```math
\mathrm{BSFC} = \frac{\dot m_f}{P_b}
```

### E-A07：正味熱効率
- defines: eta_th
- uses: P_brake mdot_f LHV

```math
\eta_{th} = \frac{P_b}{\dot m_f\,H_u}
```

### E-A08：体積効率（気筒ごと）
- defines: eta_v
- uses: mY_u rho_ref Vd

```math
\eta_v = \frac{\text{吸気弁が閉じた時点に筒内に残った未燃の空気の質量}}{\rho_{ref}\,V_d}
```

### E-A09：供給した燃料の発熱量
- defines: E_fuel
- uses: m_cmd LHV

```math
E_f = H_u \sum_{n=1}^{4} m_{inj,n}
```

### E-A10：図示仕事
- defines: W_ind
- uses: p_cyl dVdth

```math
W_i = \sum_{n=1}^{4} \oint p_n\,dV_n
```

### E-A11：ポンプ仕事（排気行程と吸気行程の分）
- defines: W_pump
- uses: p_cyl dVdth th_n

```math
W_p = \sum_{n=1}^{4} \int_{\text{排気行程と吸気行程}} p_n\,dV_n
```

### E-A12：摩擦の仕事
- defines: W_fric
- uses: T_f theta

```math
W_f = \oint T_f\,d\theta
```

### E-A13：筒内の壁への熱
- defines: Q_cylw
- uses: Qw_c

```math
Q_{w,c} = \sum_{n=1}^{4} \oint \dot Q_{w,n}\,dt
```

### E-A14：管と容積の壁への熱
- defines: Q_pipew
- uses: q_w Ai Qw_V

```math
Q_{w,p} = -\oint \Big(\sum_{\text{セル}} q_w A_i + \sum_{\text{容積}} \dot Q_{w,V}\Big)\,dt
```

### E-A15：気体が持ち出す分（内訳の残り．周期定常ではエネルギーの保存から決まる）
- defines: dH_gas
- uses: E_fuel W_ind W_fric Q_cylw Q_pipew
- kind: 釣り合い

```math
E_f = (W_i - W_f) + W_f + Q_{w,c} + Q_{w,p} + \Delta H_g
```

### E-A16：タービンの仕事
- defines: W_turb
- uses: P_t

```math
W_t = \oint P_t\,dt
```
