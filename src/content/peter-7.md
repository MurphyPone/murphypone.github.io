---
title: "Terrible Turing Machines - 07"
date: "2019-06-24"
description: "Overview of a Summary of Reinforcement Learning"
path: "/blog/peter-7"
author: "Peter M."
---
<style type='text/css'>
  a {
    border-bottom: 1px solid hsla(131, 75%, 40%, 0.8);
    color: black;
    text-decoration: none;
    -webkit-transition: background-color .25s;
    transition: background-color .25s;
  }
  a:hover {
    background-color: hsla(131, 75%, 40%, 0.8);

  }
</style>

## Introduction to Reinforcement Learning
This page is a summary of the cool symbols and my layman's understanding of what they mean in the context of Reinforcement Learning.  Praise be to Sergey and BHoag.

## Glossary
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

## Problem Solving in Reinforcement : Value Function
| function          | purpose   |
|-------------------|--------|
| $V\mathcal{^{\pi}(s)=\mathbb{E}[}R\mathcal{\text{\textbar}s, \pi]}$ | Expected return, given the state and probability |


| term              | definition |
|-------------------|------------|
| Markov's Property | Only the current state effects the next state |
| Actor Critic Methods | uses $\mathcal{\pi^*}$ as a baseline for policy gradients |
| Reinforcement Learning | focuses on learning without knowing he underlying model of the environment, but they *can* learn from interacting with it |
| Convolutional Neural Network | commonly used as components of RL agents allowing them to learn directly from raw, high-dimensional visual input values |
| The Goal of RL | to train Deep Neural Networks to approximate $\mathcal{\pi^*}, V^*, Q^*, A^*$ |
| Experience Relay Memory | stores $\mathcal{s_{t}, a_{t}, s_{t+1}, r_{t+1}}$ in a cyclic buffer, enabling RL agents to sample from and train on previously observed data (batches) offline |
|  Temporal Difference | |
| Target Network | correctly-weighted, but frozen neural nets.  The "active" policy network pulls TD error values from the cached and comparatively stable target network, rather than having to calculate the TD error based on its own rapidly fluctuating estimates of $Q$ values |
| Hard Attention | using RL to make discrete stochastic decisions over inputs via back propagation and reparameterization |
| Reparameterization | allows neural networks to be streated as stochastic computational graphs -- a key concept in algorithms involving Stochastic Value Gradients |
