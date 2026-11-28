---
node: 音
source: R-34
---

# 式：排気音と吸気音（管端を点音源とみなす）

計算は実時間より遅いので，計算した波形を記録してから再生する．

### E-SN01：聞く位置の音圧（質量の湧き出しの点音源．自由な空間．距離だけ遅れる）
- defines: p_snd
- uses: Fend A r_mic c_amb

```math
p'(t) = \sum_{e \in \{\text{尾管の出口},\ \text{吸気口}\}} \frac{1}{4\pi r_e}\,\frac{d\dot m_e}{dt}\bigg\rvert_{t - r_e/c_0}
```

### E-SN02：再生する波形（周期定常の 1 サイクルを，実際の長さ $4\pi/\omega$ で繰り返す）
- defines: s_snd
- uses: p_snd p_fs f_smp omega

```math
s_n = \operatorname{clip}\!\left(\frac{p'(n/f_s)}{p_{fs}},\ -1,\ 1\right)
```

### E-SN03：音圧レベル
- defines: L_p
- uses: p_snd

```math
L_p = 20\log_{10}\frac{p'_{rms}}{20\ \mu\text{Pa}}
```
