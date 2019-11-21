---
title: "ML 3: A Summary if a Summary: DQN Bottlenecks"
date: "2019-07-26"
description: "RL + Sergey Levine + Swords!"
path: "/blog/ml-3"
---

# Introduction
A summary of Sergey's understanding of Bottlenecks, tips, and tricks to resolve them.

# The Problem
$f$ approximation error is not actually a major problem

Sergey managed to deduce –with low dimensional "oracle based" unit tests like mazes– a series of empirical benchmarks that did not previously exists.  By using pre-computed answers from a "master" training set and gradually swapping out master examples for actual training, Sergey and co were able to measure which aspects of DQNs get stuck, and documet methods/techniques that contribute to fixing them.

# Discussion
Q-learning _will_ converge (depending on the Q values being tabular, linear, etc.).  If it does not, it is implied that the action space is employing $f$ approximation operators, as infinite action spaces cannot be tabulated.  Even when $\mathcal Q$ does not converge, divergence only occurs with a 0.9% probability and can be remediated with early-stop protocols.

$\mathcal {Q(s,a)}$ returns an evaluative quantity given a state + action. Whereas standard $V(a)$ is not necessarily good for all $s$.

# Big Neural Networks do it Better.

Imitation learning constrains the agent to being good at _strictly_ what it observed from the experts.  If the agent where to find itself out of the narrowly define 'expertly good' action space, it would have no idea what to do.

**Replay Buffer** - stores all $(s, a, r, s')$ tuples and is used to track how it got good.  However, step-wise action spaces with disparate environments per step (or moving targets) make it difficult for the agent to act consistently.  By sampling the replay buffer, we can average previous actions to find, not necessarily $\pi^*$, but $\pi^{betterThanDying}$. This is important as $\pi$ at state $s'$ might be drastically different than $\pi$ at state $s$.

**Temporal Difference Error** - Roughly measure the "amount of surprise at reward" and is used in weighting the replay buffer distribution sampling method.  Broader entropy distributions are almost always better than any other distribution sampling technique.

The **Ballman Backup** - An operator you pass to your $\mathcal Q$ function which returns a better $\mathcal Q$ based on predictions from futures $s'...s^n$.  Bellman backups focus on a single policy $\pi$ rather than a branching structure.  Bellman Backups are used to refine the way an agent takes action since it is too expensive to sample and evalate _all_ possible actions.

## Precalculus

$\ell_p \rightarrow \Vert \bar {x} \Vert_p = (\sum_i x_i^p)^\frac 1 p$ essentiay euclidean distance.

$\ell_p = \lim\limits_{p\rightarrow\infin} \Vert \bar x \Vert = \max_x \vert x_i \vert$ the maximum element such that

$\mathcal L(\phi) = \max(Q_\phi - \hat Q) \quad \}\quad \ell_\infin$  minimize and you're guaranteed to find $Q^*$

In continuous domains, $\max_a(Q(s,a))$ is really hard, so you make another Neural Network to observe the $Q$ function: the critic.

## Probably Approximately Correct (lol)

Sergey Levin is poor and therefore his network architecture sucks

Q-learning is prone to **overfitting** - Replay buffers are effective because they handle big picture evaluations and get the agent good at the broadest distribution of state spaces whereas $Q_{s_{now}}$ will get you lost faster based on the current state. --> Train on previous actions, actuate on current situations.

Larger architectures remove error bias whereas networks w/like 6 nodes get derailed by one error.

**Early Stopping** - once $\ell$ increases, stop training
 - use fewer steps on many samples
 - don't use many steps on few samples --> oversampling

# High Entropy Distribution Sampling

Makes sure $Q$ can't game the system by getting familiar with easy samples from the replay buffer.  As Q increases, we need to make sure we have a robust sampling process via HEDS.  The solution is creating another NN to fight $Q$ in a bellman curve wighting fitness game such that they both become really good and we the outcome of the game is highly unpredictable such that we can map the graph of the outcome to the replay buffer sampling so that we get both random, and surprising samples so that we aren't surprised in production.  High variance in outcome --> entropy --> good samples.

To do this is difficult in theory, so we had human interference.  Like walking in on two people and giving them swords to accelerate the process.  Just a very complicated overkill-method of generating random numbers to sample from the replay buffer.

## Big Brain, Big Architecture, big PProff graphs
