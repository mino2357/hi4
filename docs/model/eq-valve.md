---
node: 弁
source: D-10 R-11
---

# 式：弁の揚程と開口面積

### E-L01：揚程（形 $\lambda$ は 2 階微分まで連続．式は仕様）
- defines: L_v
- uses: th_n th_o phi_cam dth_v L_max

```math
L_v = L_{max}\,\lambda\!\left(\frac{\theta_n - \theta_o - \varphi}{\Delta\theta_v}\right), \qquad \lambda(0) = \lambda(1) = 0, \quad \max\lambda = 1
```

### E-L02：幾何学的な開口面積（同じ動きの弁をまとめる）
- defines: Av_v
- uses: L_v d_v n_v

```math
A_v = n_v\,\min\!\left(\pi d_v L_v,\ \frac{\pi}{4} d_v^2\right)
```
