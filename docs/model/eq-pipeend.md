---
node: 管端
source: D-09 R-03
---

# 式：管端（絞りを介した容器．閉端と開放端を含む）

添字 $i$ は端のセル，$b$ は管端，$t$ は喉，$0$ は容器．$u$ は端へ向かう向きを正．端の近くで $\gamma$ を一定とした形で書く（Q-05）．流出は $u_b > 0$，流入は $u_b < 0$．

### E-E01：開口の比
- defines: psi
- uses: Cd Av A
- assumes: 管端のモデル=特性曲線と定圧モデル

```math
\psi = \frac{C_d A_v}{A_p}
```

### E-E02：管の内側から届く特性曲線
- defines: u_b
- uses: rho_b p_b u a gam

```math
u_b + \frac{2 a_b}{\gamma - 1} = u_i + \frac{2 a_i}{\gamma - 1}, \qquad a_b = \sqrt{\gamma p_b/\rho_b}
```

### E-E03：管端のエントロピー（流出）と，管端のエネルギー（流入）
- defines: rho_b
- uses: p_b u_b rho p a0 gam

```math
\begin{cases} \dfrac{p_b}{\rho_b^{\gamma}} = \dfrac{p_i}{\rho_i^{\gamma}} & u_b > 0 \\[2ex] \dfrac{a_0^2}{\gamma - 1} = \dfrac{a_b^2}{\gamma - 1} + \dfrac{u_b^2}{2} & u_b < 0 \end{cases}
```

### E-E04：喉までの等エントロピー
- defines: rho_t
- uses: p_t p_b rho_b p0 rho0 gam u_b

```math
\frac{p_t}{\rho_t^{\gamma}} = \begin{cases} p_b/\rho_b^{\gamma} & u_b > 0 \\ p_0/\rho_0^{\gamma} & u_b < 0 \end{cases}
```

### E-E05：喉のエネルギー
- defines: u_t
- uses: rho_t p_t rho_b p_b u_b a0 gam

```math
\frac{a_t^2}{\gamma - 1} + \frac{u_t^2}{2} = \begin{cases} \dfrac{a_b^2}{\gamma - 1} + \dfrac{u_b^2}{2} & u_b > 0 \\[2ex] \dfrac{a_0^2}{\gamma - 1} & u_b < 0 \end{cases}, \qquad a_t = \sqrt{\gamma p_t/\rho_t}
```

### E-E06：質量
- defines: p_b
- uses: rho_b u_b rho_t u_t psi
- kind: 釣り合い

```math
\rho_b\,\lvert u_b\rvert = \psi\,\rho_t\,u_t
```

### E-E07：喉の条件（亜音速は圧力，チョークは音速）
- defines: p_t
- uses: p0 p_b u_t rho_t u_b gam

```math
\begin{cases} p_t = p_0 \ (u_b > 0), \quad p_t = p_b \ (u_b < 0) & u_t < a_t \\ u_t = a_t & \text{チョーク} \end{cases}
```

### E-E08：管端の面の流束
- defines: Fend
- uses: rho_b u_b p_b Y gam

```math
\hat F_{end} = \left(\rho_b u_b,\ \ \rho_b u_b^2 + p_b,\ \ \rho_b u_b \left(\frac{\gamma}{\gamma - 1}\frac{p_b}{\rho_b} + \frac{u_b^2}{2}\right),\ \ \rho_b u_b\,Y_k^{\text{風上}}\right)
```
