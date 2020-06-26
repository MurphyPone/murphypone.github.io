---
title: "ML 4: Kit & Kaboodle"
date: "2020-06-26"
description: "Sutton, Barto, Bhoag"
path: "/blog/ml-5"
---
<style> .n { visibility: hidden; } </style>

# Index 

- [Introduction](#intro)
    - [Glossary](#gl) 
- [Chapter 1: The Reinforcement Learning Problem](#ch1)

# <a name="intro" class="n"></a> Introduction

Notes from Sutton & Barto's "[Reinforcement Learning: an Introduction"](https://web.stanford.edu/class/psych209/Readings/SuttonBartoIPRLBook2ndEd.pdf).

## <a name="gl" class="n"></a> Glossary 

> "Capital letters are used for random variables and major algorithm variables. Lower case letters are used for the values of random variables and for scalar functions. Quantities that are required to be real-valued vectors are written in bold and in lower case (even if random variables)."

| Variable | Meaning |
|----------|---------|
| $s$ | state |
| $a$ | action |
| $\mathcal{S}$ | set of all nonterminal states |
| $\mathcal{S}^{+}$ | set of all states, including the terminal state |
| $\mathcal{A}(s)$ | set of possible in state $s$ |
| $\mathcal{R}$ | set of possible rewards |
| $t$ | discrete time step |
| $T$ | final time step of an episode |
| $S_t$ | state at $t$ |
| $A_t$ | action at $t$ |
| $R_t$ | reward at $t$, dependent, like $S_t$, on $A_{t-1}$ and $S_{t-1}$ |
| $G_t$ | return (cumulative discounted reward) following $t$ |
| $G^{(n)}_t$ | $n$-step return |
| $G^{(\lambda)}_t$ | $\lambda$-step return |
| $\pi$ | policy, decision-making rule |
| $\pi_*$ | the optimal policy |
| $\pi (s)$ | action take in state $s$ under $deterministic$ policy $\pi$ |
| $\pi(a \vert s)$ | probability of taking action $a$ in state $s$ under $stochastic$ policy $\pi$ |
| $p(s', r \vert s, a)$| probability of transition to state $s'$, with reward $r$ from $s, a$ |
| $v_\pi(s)$ | value of state $s$ under policy $\pi$ (expected return) |
| $v_*(s)$ | value of state $s$ under the optimal policy |
| $q_\pi(s,a)$ | value of taking action $a$ in state $s$ under policy $\pi$ |
| $q_*(s,a)$ | value of taking action $a$ in state $s$ the optimal policy |
| $V_t(s)$ | estimate (a random variable) of $v_\pi(s)$ or $v_*(s)$ |
| $Q_t(s,a)$ | estimate (a random variable) of $q_\pi(s,a)$ or $q_*(s,a)$ |
| $\hat{v}(s, \bold{w})$ | approximate value of state $s$ given a vector of weights $\bold{w}$ |
| $\hat{q}(s, a, \bold{w})$ | approximate value of a state-action par $s,a$ given weights $\bold{w}$ |
| $\bold{w}, \bold{w}_t $ | vector of (possibly learned) $weights$ underlying an approximate value function $\bold{w}$ |
| $\bold{x}(s)$ | vector of features visible when in state $s$ |
| $\bold{w^{\top}x}$ | inner product of vectors $\bold{w^{\top}x} = \sum_i w_i x_i$, e.g.$\hat{v}(s, \bold{w} = \bold{w^{\top}x})$ |
| $\delta_t$ | temporal-difference error at $t$ (a random variable, even though not upper case) |
| $E_t(s)$ | eligibility trace for state $s$ at $t$ |
| $E_t(s,a)$ | eligibility trace for a state-action pair |
| $\bold{e}_t$ | eligibility trace vector at $t$ | 
| $\gamma$ | discount rate parameter |
| $\varepsilon$ | probability of random action in $\varepsilon$-greedy policy |
| $\alpha , \beta$ | step-size parameters |
| $\lambda$ | decay-rate parameter for eligibility traces |

# <a name="ch1" class="n"></a> Chapter 1: the Reinforcement Learning Problem

