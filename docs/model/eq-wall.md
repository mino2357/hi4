---
node: 壁
source: D-03 R-04 R-05 R-09 R-10
---

# 式：壁面の摩擦と熱伝達

### E-F01：Reynolds 数
- defines: Re
- uses: rho u D mu

```math
Re = \frac{\rho \lvert u\rvert D}{\mu}
```

### E-F02：摩擦係数
- defines: f
- uses: Re kf fRe

```math
f = k_f \times \begin{cases} (f\,Re)_{lam}/Re & Re < 2300 \\ 0.0791\,Re^{-1/4} & Re \ge 2300 \end{cases}
```

### E-F03：壁面のせん断応力
- defines: tau_w
- uses: f rho u

```math
\tau_w = f\,\tfrac12\,\rho\,u\,\lvert u\rvert
```

### E-F04：熱伝達率（Reynolds–Colburn の相似．下限は層流の Nusselt 数 3.66）
- defines: h_c
- uses: f rho u cv Rgas Pr kh mu D

```math
h_c = k_h \times \max\!\left(\frac{f}{2}\,\rho \lvert u\rvert c_p\,Pr^{-2/3},\ \ 3.66\,\frac{c_p\,\mu}{Pr\,D}\right), \qquad c_p = c_v + R
```

### E-F05：壁からの熱流束
- defines: q_w
- uses: h_c Tw T

```math
q_w = h_c\,(T_w - T)
```

### E-U00：壁温（固定）
- defines: Tw
- uses:
- variant: 壁温=固定

```math
\frac{dT_w}{dt} = 0
```

### E-U01：壁温（壁の熱容量）
- defines: Tw
- uses: Cw q_w Ai he Ae Tamb
- kind: 釣り合い
- variant: 壁温=熱容量

```math
C_w\,\frac{dT_w}{dt} = -q_w A_i - h_e A_e\,(T_w - T_{amb})
```
