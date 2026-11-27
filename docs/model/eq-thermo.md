---
node: 熱物性
source: D-04 R-06
---

# 式：熱物性（管と容積で共通）

### E-H01：温度（内部エネルギーからの逆算）
- defines: T
- uses: e Y ek

```math
\sum_k Y_k\,e_k(T) = e
```

### E-H02：混合気の気体定数
- defines: Rgas
- uses: Y Rk

```math
R = \sum_k Y_k R_k
```

### E-H03：状態方程式
- defines: p
- uses: rho Rgas T

```math
p = \rho R T
```

### E-H04：定積比熱
- defines: cv
- uses: Y ek T

```math
c_v = \sum_k Y_k\,\frac{de_k}{dT}
```

### E-H05：比熱比
- defines: gam
- uses: cv Rgas

```math
\gamma = \frac{c_v + R}{c_v}
```

### E-H06：音速（組成を凍結した値）
- defines: a
- uses: gam Rgas T

```math
a = \sqrt{\gamma R T}
```

### E-H07：比全 enthalpy
- defines: Htot
- uses: Etot p rho

```math
H = E + \frac{p}{\rho}
```
