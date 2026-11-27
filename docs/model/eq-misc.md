---
node: スロットルと再循環弁
source: R-30
---

# 式：スロットルの動きと再循環弁

### E-TH01：スロットルの開口の比（閉じる過渡．形は仕様）
- defines: psi_th
- uses: t_th

```math
\psi_{th} = \psi_{th}(t;\ t_{th})
```

### E-TH02：再循環弁の面積（開く条件は仕様：スロットルの前後の圧力差，または指令）
- defines: A_rv
- uses: A_rv_max p2 p_st

```math
A_{rv} = \begin{cases} A_{rv,max} & \text{開く条件が成り立つ} \\ 0 & \text{そのほか} \end{cases}
```

### E-TH03：再循環弁の流量（コンプレッサの出口側から入口側へ）
- defines: mdot_rv
- uses: A_rv p2 p01 T01 h02

```math
\dot m_{rv} = A_{rv}\,\frac{p_2}{\sqrt{R T_2}}\,\Psi\!\left(\frac{p_{01}}{p_2}\right)
```
