---
node: インタークーラ
source: R-28
---

# 式：インタークーラ

中心部は，水力直径が小さく，壁温が冷却側の温度に等しい管（管と壁の式）．入口と出口のタンクは容積．新しい式は冷却の効率だけ．

### E-IC01：冷却の効率（温度は，質量流量で重みを付けた 1 サイクルの平均）
- defines: eta_ic
- uses: T Tw Fend

```math
\varepsilon_{IC} = \frac{\bar T_{in} - \bar T_{out}}{\bar T_{in} - T_w}
```
