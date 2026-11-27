---
node: EGR
source: R-22
---

# 式：外部 EGR

経路は，管，管端の絞り（弁），冷却器（壁温が一定の管）で作る．新しい式は EGR 率だけ．

### E-EG01：EGR 率
- defines: x_egr
- uses: Fend

```math
x_{EGR} = \frac{\oint \dot m_{EGR}\,dt}{\sum_{n=1}^{4}\oint \dot m_{in,n}\,dt}
```
