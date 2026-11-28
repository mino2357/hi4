---
node: 最適化
source: R-35
---

# 式：最適化

### E-OP01：目的の量（周期定常と判定された運転点の値）
- defines: J_opt
- uses: T_brake eta_th

```math
J(x) = T_b(x) \quad \text{または} \quad J(x) = \eta_{th}(x)
```

### E-OP02：最適な組（探し方は仕様）
- defines: x_opt
- uses: J_opt x_lo x_hi

```math
x^{*} = \operatorname*{arg\,max}_{x_{min} \le x \le x_{max}} J(x)
```
