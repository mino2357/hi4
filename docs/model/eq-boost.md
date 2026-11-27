---
node: 過給圧
source: D-18 R-27
---

# 式：過給圧の制御

### E-B01：過給圧（1 サイクルの平均）
- defines: p_boost
- uses: p_st

```math
\bar p_{boost} = \frac{1}{T}\oint p_{st}\,dt
```

### E-B02：ウェイストゲートの面積（制御則．式は仕様）
- defines: A_wg
- uses: p_boost p_target

```math
A_{wg} = \mathcal C\big(\bar p_{boost} - p_{target}\big), \qquad 0 \le A_{wg} \le A_{wg,\max}
```
