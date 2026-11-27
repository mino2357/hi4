---
node: 容積
source: D-07 R-07
---

# 式：容積（状態が変わる容器．流速を持たない）

$j$ は，つながっている管端の面．$\dot m_j$，$\dot m_j H_j$，$\dot m_j Y_{k,j}$ は，管端の面の流束 $\hat F_{end}$ に管の断面積を掛けたもの（容積へ入る向きが正．管が失う数と同じ数）．

### E-V01：質量
- defines: m_V
- uses: Fend
- kind: 釣り合い

```math
\frac{dm}{dt} = \sum_j \dot m_j
```

### E-V02：エネルギー
- defines: me_V
- uses: Fend Qw_V
- kind: 釣り合い

```math
\frac{d(m e)}{dt} = \sum_j \dot m_j H_j + \dot Q_{w,V}
```

### E-V03：成分
- defines: mY_V
- uses: Fend
- kind: 釣り合い

```math
\frac{d(m Y_k)}{dt} = \sum_j \dot m_j Y_{k,j}
```

### E-V04：比内部エネルギー
- defines: e_V
- uses: me_V m_V

```math
e_V = \frac{m e}{m}
```

### E-V05：質量分率
- defines: Y_V
- uses: mY_V m_V

```math
Y_{k,V} = \frac{m Y_k}{m}
```

### E-V06：温度（内部エネルギーからの逆算）
- defines: T_V
- uses: e_V Y_V ek

```math
\sum_k Y_{k,V}\,e_k(T_V) = e_V
```

### E-V07：よどみ密度
- defines: rho0
- uses: m_V V_V

```math
\rho_0 = \frac{m}{V}
```

### E-V08：よどみ圧
- defines: p0
- uses: rho0 Y_V Rk T_V

```math
p_0 = \rho_0\,\Big(\sum_k Y_{k,V} R_k\Big)\,T_V
```

### E-V09：よどみ音速
- defines: a0
- uses: Y_V Rk ek T_V

```math
a_0 = \sqrt{\gamma_V R_V T_V}
```

### E-V10：壁からの熱
- defines: Qw_V
- uses: hcV AwV TwV T_V

```math
\dot Q_{w,V} = h_{c,V}\,A_{w,V}\,(T_{w,V} - T_V)
```
