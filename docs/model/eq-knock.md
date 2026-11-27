---
node: ノック
source: D-13 R-16
---

# 式：ノックの指標と点火時期

### E-Q01：自着火の遅れ（Douaud と Eyzat の形．定数は仕様）
- defines: tau_ig
- uses: p_cyl T_u ON

```math
\tau_{ig} = C(\mathrm{ON})\,p^{-n}\exp\!\left(\frac{B}{T_u}\right)
```

### E-Q02：ノックの指標（Livengood–Wu．吸気弁が閉じた時点から積分する）
- defines: I_K
- uses: tau_ig

```math
\frac{dI_K}{dt} = \frac{1}{\tau_{ig}}
```

### E-Q03：点火時期（MBT と，ノックの限界のうち，遅い方．前のサイクルまでの指標から，サイクルをまたいで決める）
- defines: th_ign
- uses: I_K x_b

```math
\theta_{ign} = \max\big(\theta_{MBT},\ \theta_{KL}\big), \qquad \theta_{KL}:\ I_K < 1 \text{ が燃焼の終わりまで成り立つ，最も進んだ時期}
```
