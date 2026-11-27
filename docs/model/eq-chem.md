---
node: 化学
source: D-23 D-24 R-13 R-17
---

# 式：既燃ガスの化学（筒内，管，容積で共通）

種は 10 種（$\mathrm{CO_2}$，$\mathrm{H_2O}$，$\mathrm{N_2}$，$\mathrm{O_2}$，$\mathrm{CO}$，$\mathrm{H_2}$，$\mathrm{H}$，$\mathrm{O}$，$\mathrm{OH}$，$\mathrm{NO}$）．元素の量 $b_j$（C，H，O，N）は，燃料の蒸気を除く成分から決まる．導出は D-23，D-24．

### E-R01：拘束しない平衡（反応速度の式の基準）
- defines: c_eq
- uses: T p Y g0

```math
\min_{n}\ \sum_i n_i\left[\mu_i^{\circ}(T) + \bar R T \ln\frac{x_i\,p}{p^{\circ}}\right] \qquad \text{subject to} \quad \sum_i a_{ji} n_i = b_j, \quad n_i \ge 0
```

### E-R02：拘束した平衡（CO と NO は反応速度の式で決まった量．残りの 8 種を定める）
- defines: n_rest
- uses: T p Y g0
- assumes: 既燃ガスの化学=拘束した平衡と反応速度

```math
\min_{n}\ G(T, p, n) \qquad \text{subject to} \quad \sum_i a_{ji} n_i = b_j, \quad n_{\mathrm{CO}},\ n_{\mathrm{NO}} \text{ は与えた値}, \quad n_i \ge 0
```

### E-R03：CO の反応速度
- defines: wCO
- uses: c_eq k_rate Y rho

```math
\dot w_{\mathrm{CO}} = (R_a + R_c)\left(1 - \frac{[\mathrm{CO}]}{[\mathrm{CO}]_e}\right), \qquad R_a = k_a^{+}[\mathrm{CO}]_e[\mathrm{OH}]_e, \quad R_c = k_c^{-}[\mathrm{CO}]_e[\mathrm{O_2}]_e
```

### E-R04：NO の反応速度（拡大 Zeldovich 機構．N は準定常）
- defines: wNO
- uses: c_eq k_rate Y rho

```math
\dot w_{\mathrm{NO}} = \frac{2R_1\,(1 - \alpha^2)}{1 + K\alpha}, \qquad \alpha = \frac{[\mathrm{NO}]}{[\mathrm{NO}]_e}, \quad K = \frac{R_1}{R_2 + R_3}, \quad R_1 = k_1^{+}[\mathrm{O}]_e[\mathrm{N_2}]_e, \ R_2 = k_2^{+}[\mathrm{N}]_e[\mathrm{O_2}]_e, \ R_3 = k_3^{+}[\mathrm{N}]_e[\mathrm{OH}]_e
```

### E-R05：成分の生成の速さ（CO と NO の分．残りは元素の保存から）
- defines: omega_k
- uses: wCO wNO

```math
\dot\omega_{\mathrm{CO}} = M_{\mathrm{CO}}\,\dot w_{\mathrm{CO}}, \qquad \dot\omega_{\mathrm{NO}} = M_{\mathrm{NO}}\,\dot w_{\mathrm{NO}}, \qquad \sum_k \dot\omega_k = 0
```
