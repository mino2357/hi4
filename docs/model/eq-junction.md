---
node: 合流部
source: D-07 R-08
---

# 式：合流部（流れの向きと枝管の角度による損失を扱う形）

容積による合流部（切替の「容積」）は，容積の式（E-V01〜E-V10）をそのまま使うので，ここに式は無い．

### E-J01：全圧の損失係数（式は仕様．出典の候補は D-22 の Bassett ほか 2003）
- defines: K_J
- uses: Fend A th_J
- variant: 合流部=向きを扱う

```math
K_{ij} = K\big(\text{流量の比},\ \text{面積の比},\ \theta_{ij}\big)
```

### E-J02：全圧の損失
- defines: dp0_J
- uses: K_J rho u
- variant: 合流部=向きを扱う

```math
\Delta p_{0,ij} = K_{ij}\,\tfrac12\,\rho\,u^2
```
