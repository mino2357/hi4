---
node: 幾何
source: D-10 R-11
---

# 式：シリンダの幾何

### E-K01：行程容積
- defines: Vd
- uses: Bore Stroke

```math
V_d = \frac{\pi}{4} B^2 S
```

### E-K02：すきま容積
- defines: Vc
- uses: Vd eps_c

```math
V_c = \frac{V_d}{\varepsilon - 1}
```

### E-K03：気筒のクランク角
- defines: th_n
- uses: theta Delta_n

```math
\theta_n = \theta - \Delta_n
```

### E-K04：ピストンの変位（スライダ・クランク）
- defines: x_p
- uses: th_n Stroke l_rod

```math
x_p = r\,(1 - \cos\theta_n) + l - \sqrt{l^2 - r^2\sin^2\theta_n}, \qquad r = \frac{S}{2}
```

### E-K05：体積
- defines: V_cyl
- uses: Vc Bore x_p

```math
V = V_c + \frac{\pi}{4} B^2 x_p
```

### E-K06：体積の微分
- defines: dVdth
- uses: Bore Stroke l_rod th_n

```math
\frac{dV}{d\theta} = \frac{\pi}{4} B^2\, r \sin\theta_n \left(1 + \frac{r\cos\theta_n}{\sqrt{l^2 - r^2\sin^2\theta_n}}\right)
```
