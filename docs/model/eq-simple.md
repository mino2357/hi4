---
node: 簡易計算
source: R-27
---

# 式：定常点の簡易計算（平均値の釣り合い）

バーは 1 サイクルの平均の量で，map の式（E-C03，E-C04，E-T06，E-T07）に平均の状態を入れて求める．

### E-M01：軸の仕事の釣り合い
- defines: omega_0
- uses: eta_m P_t P_c
- assumes: 定常点の出発点=簡易計算

```math
\eta_m\,\bar P_t\big(\omega_{tc}^{(0)}\big) = \bar P_c\big(\omega_{tc}^{(0)}\big)
```

### E-M02：流量の連続
- defines: p_boost_0
- uses: mdot_t mdot_wg mdot_c mdot_f
- assumes: 定常点の出発点=簡易計算

```math
\bar{\dot m}_t + \bar{\dot m}_{wg} = \bar{\dot m}_c + \bar{\dot m}_f
```

### E-M03：過給圧の条件
- defines: A_wg_0
- uses: p_boost_0 p_target
- assumes: 定常点の出発点=簡易計算

```math
p_{boost}^{(0)} = p_{target} \quad \text{または} \quad A_{wg}^{(0)} = 0 \ \ \big(p_{boost}^{(0)} < p_{target}\big)
```
