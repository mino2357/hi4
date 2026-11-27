---
node: センサ
source: R-23
---

# 式：A/F センサ（限界電流式）

### E-AF01：定常のポンプ電流（拡散層を通る各種の流束から．式は仕様）
- defines: Ip_ss
- uses: Y p T D_i

```math
I_{p,ss} = k(p, T)\sum_i \nu_i\,D_i\,x_i, \qquad \nu_{\mathrm{O_2}} = 1, \quad \nu_{\mathrm{CO}} = \nu_{\mathrm{H_2}} = -\tfrac12
```

### E-AF02：応答（検出室と保護カバーの中の気体の入れ替わり）
- defines: Ip
- uses: Ip_ss tau_s

```math
\frac{dI_p}{dt} = \frac{I_{p,ss} - I_p}{\tau_s}
```

### E-AF03：出力から換算した当量比（希薄の完全燃焼の組成で，気体の当量比に一致するように定める．式は仕様）
- defines: phi_s
- uses: Ip

```math
\phi_s = \Phi_s(I_p)
```
