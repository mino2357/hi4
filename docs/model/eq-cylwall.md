---
node: 筒内の壁
source: D-11 R-13
---

# 式：筒内の壁への熱

### E-Y01：熱伝達率（Woschni．式と定数は仕様）
- defines: h_wo
- uses: Bore p_cyl T_u T_b m_u m_b omega Stroke

```math
h_w = h_w\big(B,\ p,\ \bar T,\ w\big)
```

### E-Y02：壁への熱（全体）
- defines: Qw_c
- uses: h_wo A_wc T_wc T_u T_b m_u m_b

```math
\dot Q_w = h_w A_{w,c}\,(\bar T - T_{w,c}), \qquad \bar T = \frac{m_u T_u + m_b T_b}{m_u + m_b}
```

### E-Y03：未燃部の分（配り方は仕様）
- defines: Qw_u
- uses: Qw_c V_u V_b T_u T_b T_wc

```math
\dot Q_u = \chi_u\,\dot Q_w
```

### E-Y04：既燃部の分
- defines: Qw_b
- uses: Qw_c Qw_u

```math
\dot Q_b = \dot Q_w - \dot Q_u
```
