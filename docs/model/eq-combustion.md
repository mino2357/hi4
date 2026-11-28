---
node: 燃焼
source: D-11 R-13 R-14
---

# 式：燃焼（Wiebe 関数．期間は層流燃焼速度で決まり，燃える割合はその結果）

点火の時点の状態（$T_u$，$p$，$\rho_u = m_u/V_u$）を，そのサイクルの燃焼の式に使う．当量比は $\phi = \mathrm{AF}_{st}\,Y_{f,u}/Y_{a,u}$．

### E-X01：燃焼の始まり
- defines: th_s
- uses: th_ign dth_d

```math
\theta_s = \theta_{ign} + \Delta\theta_d
```

### E-X02：燃焼の期間
- defines: dth_b
- uses: C_b G_b
- assumes: サイクル変動=決定論的な結合

```math
\Delta\theta_b = C_b\,G^{1/3}
```

### E-X03：燃える割合（置かない．燃焼が終わるまでに燃えた割合．出力）
- defines: eta_b
- uses: x_b th_s dth_b th_EVO
- assumes: サイクル変動=決定論的な結合

```math
\eta_b = x_b(\theta_e), \qquad \theta_e = \min\big(\theta_s + \Delta\theta_b,\ \theta_{EVO}\big)
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

### E-X06：燃える速さ（燃焼は，Wiebe 関数が終わるか，排気弁が開くか，早いほうで終わる）
- defines: mdot_b
- uses: m_u x_b omega th_n th_s dth_b th_EVO

```math
\dot m_b = \begin{cases} m_u(\theta_s)\,\max\!\left(\dfrac{dx_b}{d\theta},\ 0\right)\max(\omega,\ 0) & \theta_s \lt \theta_n \lt \theta_e \\[1ex] 0 & \text{それ以外} \end{cases}
```

### E-X07：層流燃焼速度（Metghalchi と Keck 1982 の相関式．下限は置かない）
- defines: S_L
- uses: mY_u m_u AFst T_u p_cyl x_bIVC SL_Bm SL_B2 SL_phim T_ref p_ref

```math
S_L = \max\!\big(B_m + B_2(\phi - \phi_m)^2,\ 0\big)\left(\frac{T_u}{T_{ref}}\right)^{2.18 - 0.8(\phi - 1)}\left(\frac{p}{p_{ref}}\right)^{-0.16 + 0.22(\phi - 1)}\max\!\big(1 - 2.1\,x_{b,IVC},\ 0\big)
```

### E-X08：燃焼の期間を決める無次元の量
- defines: G_b
- uses: Stroke omega mu m_u V_u Bore S_L

```math
G = \frac{c_m\,\nu_u}{B\,S_L^2}, \qquad c_m = \frac{S\,\omega}{\pi}, \qquad \nu_u = \frac{\mu\,V_u}{m_u}
```

### E-X09：着火遅れ
- defines: dth_d
- uses: C_d G_b

```math
\Delta\theta_d = C_d\,G^{1/3}
```
