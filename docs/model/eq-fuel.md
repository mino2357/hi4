---
node: 燃料
source: D-18 R-20 R-21 R-24
---

# 式：燃料の制御（噴射量，排気の温度の制限，気筒別の補正）

### E-N01：排気の温度の平均
- defines: T_exbar
- uses: Fend T

```math
\bar T_{ex} = \frac{\oint \dot m\,T\,dt}{\oint \dot m\,dt}
```

### E-N02：目標の当量比（排気の温度が上限を超えるときに上げる．制御則は仕様）
- defines: phi_t
- uses: phi_set phi_max T_exbar T_lim

```math
\phi_t = \begin{cases} \phi_{set} & \bar T_{ex} \le T_{lim} \\ \min\big(\phi_{set} + \mathcal C_T(\bar T_{ex} - T_{lim}),\ \phi_{max}\big) & \bar T_{ex} > T_{lim} \end{cases}
```

### E-N03：噴射量の指令（吸気弁が閉じた時点の筒内の空気から）
- defines: m_ref
- uses: phi_t mY_u AFst

```math
m_{ref,n} = \phi_t\,\frac{m_{a,IVC,n}}{\mathrm{AF}_{st}}
```

### E-N04：噴射量（補正と，噴射弁のばらつき）
- defines: m_cmd
- uses: m_ref c_com c_n g_n

```math
m_{inj,n} = g_n\,m_{ref,n}\,(1 + c_{com} + c_n)
```

### E-N05：共通の補正（センサの平均の値による．制御則は仕様．切ると $0$）
- defines: c_com
- uses: phi_s phi_t

```math
c_{com} = \mathcal C_{com}\big(\phi_t - \bar\phi_s\big)
```

### E-N06：気筒ごとのずれの推定（センサの出力をクランク角に同期して取る．式は仕様）
- defines: d_n
- uses: phi_s theta
- variant: 気筒別の補正=入

```math
d_n = \mathcal E_n\big(\phi_s(\theta)\big)
```

### E-N07：気筒ごとの補正（切）
- defines: c_n
- uses:
- variant: 気筒別の補正=切

```math
c_n = 0
```

### E-N08：気筒ごとの補正（入．4 気筒の平均は $0$．制御則は仕様）
- defines: c_n
- uses: d_n
- variant: 気筒別の補正=入

```math
c_n = \mathcal C_n(d_n), \qquad \sum_{n=1}^{4} c_n = 0
```
