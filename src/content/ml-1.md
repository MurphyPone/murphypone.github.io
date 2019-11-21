---
title: "ML 1: Reinforcement Learning, So Hot Right Now"
date: "2019-06-26"
description: "Overview of a Summary of Reinforcement Learning"
path: "/blog/ml-pm-1"
---

## Introduction to Reinforcement Learning
This page is a summary of the cool symbols and my layman's understanding of what they mean in the context of Reinforcement Learning.  Praise be to Sergey and BHoag.

## Glossary

<div class="foo">

| symbol            | term     |
|-------------------|----------|
| $\mathcal{s}_{t}$ | state |
| $\mathcal{a}_{t}$ | action |
| $\mathcal{t}$ | time step |
| $\mathcal{r_{t}}$ |reward that scales with the state e.g. $\mathcal{s_{t}, r_{t} \to s_{t+1}, r_{t+1} }$ <br> $\mathcal{r_{t}}$ get provided to the agent in order to line <br> this process of incrementing $\mathcal{s_{t}, a_{t}, r_{t}}$ to approach a better and better policy $\mathcal{\pi}$ is repeated until the optimal policy $\mathcal{\pi^{*}}$ is achieved by maximizing $r_{t}$|
| $\mathcal{S}$| the set of states and the distribution of starting states $p(\mathcal{s}_{0})$|
| $\mathcal{A}$    | the set of actions that can be taken in a given state|
| $\mathcal{T(s_{t+1}\text{\textbar} s_{t}, {a}_{t} ) }$| Transition dynamics function which maps a state-action pair at time $\mathcal{t}$ to a distribution of states at $\mathcal{t+1}$ <br>// the probability "$\text{\textbar}$" of $\mathcal{s_{t+1}}$ given $\mathcal{s_{t}, a_{t}}$ <br> can't make any assumptions about future states, just that $\exists$ a function $\mathcal{T}$ that determines the probability of any state |
| $\mathcal{R(s_{t}, a_{t}, s_{t+1})}$ | immediate reward function   |
| $\gamma \in [0,1]$ | discount factor where $\displaystyle{\lim_{\gamma \to 0}}$ places emphasis on the immediacy of the reward|
| $\mathcal{\pi:S \to p(A=a\text{\textbar}s)}$ | $\mathcal{\pi}$ is a mapping from the set of states to a probability distribution over the set of actions |
| $T$ | an episode.  A Markov Decision Process is said to be "episodic" if, after length $T$, the state resets <br> if $T=\infin$, then the MDP is not episodic <br>if $T$, then the MDP is episodic |
| $R = \displaystyle\sum_{t=0}^{T-1} \gamma^tr_{t+1}$ | brings the policy us closer to the goal of Reinforcement Learning: $\mathcal{\pi^*}$ |
| $\mathcal{\pi^*=\argmax\limits_\pi}\mathbb{E}[R \text{\textbar}\mathcal{\pi}]$ | the optimal policy/control strategy based on the given possibility and rewards |

</div>

## Problem Solving in Reinforcement Learning: Evaluative Functions


| function          | purpose   |
|-------------------|--------|
| $V\mathcal{^{\pi}(s)=\mathbb{E}[}R\mathcal{\text{\textbar}s, \pi]}$ | Expected return, given the state and probability |
| $V\mathcal{^{\pi}(s)=\argmax\limits_\pi}V^{\pi}(s)$ <br>$\space \forall s \in\mathcal{S}$ | the optimal policy for all states in the set of states. <br> sidebar: saying that something holds true for all states in the set of all possible states is really stupid and redundant for a generalized solution like RL.  Why not say $\forall a \in\mathcal{A}$ whenever you mention $\mathcal{a}$? |
| 勿 | the set of all possible sets, policies, models, gradients, loss functions, backup operations, transition dynamics, action, Turing Machines, and symbols.  To be used:<br> $\forall x \in\mathcal{勿} \text { where x is literally any variable. ever.} $ |
| $Q\mathcal{^\pi(s,a)=\mathbb{E}[}R\mathcal{\text{\textbar}s,a,\pi]}$ | quality function which is like $V\mathcal{^\pi(s)}$, except the intial action $a$ is provided |
| $Q\mathcal{^\pi(s_{t},a_{t})=\mathbb{E_{s_{t+1}}}[r_{t+1}+\gamma}Q\mathcal{^{\pi}(s_{t+1}, \pi(s_{t+1})]}$| the expected output of the next state determined by the anticipated reward plus the discount times the quality of the next state, provided the next state and action |
| $Q\mathcal{^\pi(s_{t},a_{t}) \leftarrow }Q\mathcal{^{\pi}(s_{t},a_{t}) + \alpha\delta}$  | The value of Q is assigned according to the learning rate times the Temporal Difference Error |
| $\alpha$ | the learning rate |
| $\delta = \text {Y} - Q^{\pi}(\mathcal{s_{t}, a_{t}})$ | the Temporal Difference Errror |
| $\text {Y}$ | the target of standard regression maximized with respect to the action $a$. <br> $\text {Y} = \mathcal {r_{t} + \gamma \max_{a}} Q^{\pi}(\mathcal{s_{t}, a_{t}})$ |
| $Q^{*} \approx \text {Y} = \mathcal {r_{t} + \gamma \max_{a}} Q^{\pi}(\mathcal{s_{t+1}, a_{t+1}})$ | the optimal Quality Function is approximated by the target of standard regression |
| $s_{\pi_{a_{1}, a_{2}, a_{3}}}\xleftrightharpoons[\overline{\pi_{a_{1,2,3}}}]{\pi_{a}} \LARGE{s} \normalsize \xrightleftharpoons[\overline{\pi_{b_{1,2,3}}}]{\pi_{b}} s_{\pi_{b_{1}, b_{2}, b_{3}}}$| Monte Carlo Methods <br> a policy is rolled out and pursued for an arbitrary amount of episodes after which the mean value of the policy is returned. <br>//looking into the possible future based on the current state and a given policy and choosing the best policy to be taken based on the mean |
| $\text {TD}(\lambda)$| a combination of Temporal Difference bootstrapping and monte carlo methods where $\lambda$ is an interpolation factor between TD and MCM |
| $\text{A}^{\pi}\mathcal{(s)} = Q^{\pi} - V^{\pi}$ | the Advantage Function which produces relative state-action values instead of absolute state-action values like $Q^{\pi}$. <br> this is useful as it's easier to make comparative evaluations between actual return calculations e.g. we can tell that $x > y$ without knowing of $x$ or $y$ are actually any good. <br> the Advantage Function asks/answers the question "How much better is this action compared to the average action taken in this state." |
| $\infin \circlearrowright \begin{cases} \footnotesize \text {Policy evaluation}  \\ \footnotesize \text{Policy improvement }  \end{cases}$ | Generalized Policy Improvement |

## Problem Solving in Reinforcement Learning: Policy Search
<div class="foo">

| function          | purpose   |
|------------------------------|---|
| $\pi_{\theta} ; \space \theta = \small \text{the parameters}$| means of policy search which is typically chosen that is parametrized to maximize $\mathbb{E}[\text{R}\text{\textbar}\theta]$ using either gradient-based or gradient free optimization |
| gradient-based optimization | applicable to Deep Reinforcement Learning scenarios denoted by high-dimensional action spaces |
| gradient-free optimization | good for low-dimensional problems |
|  $\nabla_{\theta}\mathbb{E}[f(x,\theta)]=\mathbb{E}_{x}[f(x,\theta)\nabla_{\theta}\log p(x)]$| REINFORCE rule: gradient-estimation (aka "score function", "likelihood-ratio estimator") computes the gradient of the expectation over a function $f$ of a random variable $x$ with respect to parameters $\theta$. |
| $\log x$ in RL | $log_{x}b=a \space \text{ s.t. } \exists \space x \in$ 勿 <br> *hint: it does* |

</div>


### A Brief Note on Gradients
$ f(x,y) = x^2 + 2xy + y^2 $ <br>
$ \nabla f = \langle 2x + 2y, 2x + 2y \rangle  \qquad \ \scriptsize \text{Take the partial derivative with respect to each variable}$ <br>
$\qquad\theta \leftarrow x,y \qquad \qquad \quad \qquad \scriptsize x,y \text{ are assigned to the parameter } \theta$ <br>
$\nabla_{\theta}f = \langle 2x + 2y, 2x + 2y \rangle = \nabla f$

## Closing Big Brain Ideas

| term              | definition |
|-------------------|------------|
| Markov's Property | Only the current state effects the next state |
| Actor Critic Methods | uses $\mathcal{\pi^*}$ as a baseline for policy gradients |
| Reinforcement Learning | focuses on learning without knowing he underlying model of the environment, but they *can* learn from interacting with it |
| Convolutional Neural Network | commonly used as components of RL agents allowing them to learn directly from raw, high-dimensional visual input values |
| The Goal of RL | to train Deep Neural Networks to approximate $\mathcal{\pi^*}, V^*, Q^*, A^*$ |
| Experience Relay Memory | stores $\mathcal{s_{t}, a_{t}, s_{t+1}, r_{t+1}}$ in a cyclic buffer, enabling RL agents to sample from and train on previously observed data (batches) offline |
| Target Network | correctly-weighted, but frozen neural nets.  The "active" policy network pulls TD error values from the cached and comparatively stable target network, rather than having to calculate the TD error based on its own rapidly fluctuating estimates of $Q$ values |
| Hard Attention | using RL to make discrete stochastic decisions over inputs via back propagation and reparameterization |
| Reparameterization | allows neural networks to be treated as stochastic computational graphs -- a key concept in algorithms involving Stochastic Value Gradients |
| Dynamic Programming | using the current $Q^{\pi}$ to improve the next $Q^{\pi}$ via "bootstrapping" |
| Monte Carlo Methods | estimating the expected return from a state by averaging return from multiple rollouts of a policy.  <br> used to find optimal trajectories. <br> limited to episodic Markov Decision Processes |
| Policy Search | doesn't maintain a value-function model, instead this appraoch directly searches for an optimal policy $\pi^{*}$ |
| Actor-Critic Model | The Actor (policy) receives a state from the environment and chooses an action to perform.  At the same time, some critic ($V^\pi$) receives the state and reward resulting from the previous interaction.  The critic uses the RD error $\delta$ calculated from this information to update itself and the actor.<br> <br> It's trivial, really.|
![img](https://www.researchgate.net/publication/258394387/figure/fig1/AS:340687313752077@1458237593623/The-actor-critic-architecture.png)
