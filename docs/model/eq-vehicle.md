---
node: 車両
source: R-36
---

# 式：車両（シャシーダイナモメーター）

変速比は固定で，クラッチはつながったまま，タイヤはすべらないとする．

### E-VH01：車速
- defines: v_veh
- uses: omega r_w i_g i_f

```math
v = \frac{\omega\,r_w}{i_g\,i_f}
```

### E-VH02：走行抵抗（転がり抵抗と空気抵抗．勾配は無い）
- defines: F_res
- uses: m_veh C_rr CdA rho_amb v_veh

```math
F_r = m_v\,g\,C_{rr} + \tfrac12\,\rho_0\,C_d A_f\,v^2
```

### E-VH03：駆動力
- defines: F_drv
- uses: T_g T_in T_f i_g i_f eta_dr r_w

```math
F_d = (T_g + T_{in} - T_f)\,\frac{i_g\,i_f\,\eta_d}{r_w}
```
