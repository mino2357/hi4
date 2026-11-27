---
node: 燃焼
source: D-11 R-13 R-14
---

# 式：燃焼（Wiebe 関数．期間と燃える割合は筒内の状態で決まる）

### E-X01：燃焼の始まり
- defines: th_s
- uses: th_ign

```math
\theta_s = \theta_{ign}
```

### E-X02：燃焼の期間（式は仕様．Q-14）
- defines: dth_b
- uses: x_bIVC mY_u m_u T_u V_u omega
- assumes: サイクル変動=決定論的な結合

```math
\Delta\theta_b = \Delta\theta_b\big(x_{b,IVC},\ \phi,\ T_u,\ \rho_u,\ \omega\big)
```

### E-X03：燃える割合（部分燃焼と失火．式は仕様．Q-14）
- defines: eta_b
- uses: x_bIVC mY_u m_u T_u V_u omega
- assumes: サイクル変動=決定論的な結合

```math
\eta_b = \eta_b\big(x_{b,IVC},\ \phi,\ T_u,\ \rho_u,\ \omega\big), \qquad 0 \le \eta_b \le 1
```

### E-X04：燃えた割合（Wiebe 関数）
- defines: x_b
- uses: th_n th_s dth_b a_W m_W
- assumes: 燃焼の進み方=Wiebe 関数

```math
x_b = 1 - \exp\!\left[-a_W\left(\frac{\theta_n - \theta_s}{\Delta\theta_b}\right)^{m_W + 1}\right]
```

### E-X05：燃える燃料の割合
- defines: y_fc
- uses: mY_u m_u AFst

```math
y_{fc} = \min\!\left(Y_{f,u},\ \frac{Y_{a,u}}{\mathrm{AF}_{st}}\right)
```

### E-X06：燃える速さ
- defines: mdot_b
- uses: eta_b m_u x_b omega

```math
\dot m_b = \eta_b\,m_u(\theta_s)\,\max\!\left(\frac{dx_b}{d\theta},\ 0\right)\max(\omega,\ 0)
```
