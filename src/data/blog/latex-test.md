---
author: miuo
pubDatetime: 2026-04-16T17:35:00Z
title: LaTeX 公式测试
featured: false
draft: false
tags:
  - latex
  - math
  - test
description: 用来测试站内 LaTeX 公式渲染是否正常，包括行内公式、块级公式、矩阵和多行公式。
---

这是一篇专门用来测试站内 LaTeX 渲染的文章。

## 行内公式

最经典的质能方程是 $E = mc^2$。

二次方程求根公式：

$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

欧拉恒等式：

$e^{i\pi} + 1 = 0$

## 块级公式

高斯积分：

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

黎曼ζ函数：

$$
\zeta(s) = \sum_{n=1}^{\infty}\frac{1}{n^s}
$$

## 多行公式

麦克斯韦方程组：

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\left(\mathbf{J} + \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}\right)
\end{aligned}
$$

## 矩阵

$$
A =
\begin{bmatrix}
1 & 2 & 3 \\
0 & 1 & 4 \\
5 & 6 & 0
\end{bmatrix}
$$

## 极限与求和

$$
\lim_{n \to \infty}\left(1 + \frac{1}{n}\right)^n = e
$$

$$
\sum_{k=1}^{n} k = \frac{n(n+1)}{2}
$$

## 分段函数

$$
f(x)=
\begin{cases}
x^2, & x \ge 0 \\
-x, & x < 0
\end{cases}
$$

## 组合测试

如果设向量 $\mathbf{v} = (x, y, z)$，那么它的长度为：

$$
\|\mathbf{v}\| = \sqrt{x^2 + y^2 + z^2}
$$

如果上面这些都能正常显示，说明站内 LaTeX 基本已经接好了。
