---
node: オリフィス
source: D-08 R-03
---

# 式：圧縮性のオリフィス

### E-O01：臨界の圧力比
- defines: r_c
- uses: gam

```math
r_c = \left(\frac{2}{\gamma + 1}\right)^{\gamma/(\gamma - 1)}
```

### E-O02：流量の関数
- defines: Psi
- uses: gam r_c

```math
\Psi(r) = \begin{cases} \sqrt{\dfrac{2\gamma}{\gamma - 1}\left(r^{2/\gamma} - r^{(\gamma+1)/\gamma}\right)} & r > r_c \\[2ex] \sqrt{\gamma}\left(\dfrac{2}{\gamma + 1}\right)^{\frac{\gamma+1}{2(\gamma-1)}} & r \le r_c \end{cases}
```
