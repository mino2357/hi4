---
node: 噴射
source: D-12 R-15
---

# 式：直噴（噴射と気化）と，scavenging の集計

### E-I01：筒内の液体の燃料
- defines: m_fl
- uses: mdot_inj mdot_ev
- kind: 釣り合い

```math
\frac{dm_{f,l}}{dt} = \dot m_{inj} - \dot m_{ev}
```

### E-I02：噴射の質量流量（噴射の期間の中だけ．逆に回る段では $0$）
- defines: mdot_inj
- uses: m_cmd th_n th_inj dth_inj omega

```math
\dot m_{inj} = \begin{cases} \dfrac{m_{inj}}{\Delta\theta_{inj}}\,\max(\omega,\ 0) & \theta_{inj} \le \theta_n < \theta_{inj} + \Delta\theta_{inj} \\[1.5ex] 0 & \text{そのほか} \end{cases}
```

### E-I03：気化の質量流量
- defines: mdot_ev
- uses: m_fl tau_ev

```math
\dot m_{ev} = \frac{m_{f,l}}{\tau_{ev}}
```

### E-I04：排気弁から出た未燃の空気
- defines: m_sc
- uses: Fend

```math
m_{sc} = \oint \dot m_{ex}\,Y_{a}\,dt
```

### E-I05：trapping ratio
- defines: TR
- uses: Fend mY_u

```math
\mathrm{TR} = \frac{\text{吸気弁が閉じた時点に筒内に残った未燃の空気の質量}}{\oint \dot m_{in}\,Y_a\,dt}
```
