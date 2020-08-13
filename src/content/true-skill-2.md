---
title: "Digest: TrueSkill 2: Better Bayesian Assumptions Boogalo"
date: "2020-08-12"
description: "Optimal Match Making using Bayesian Inference"
path: "/blog/true-skill-2.md"
---

## Preface
This article contains my summary of Daniel's summary of Microsoft Research's publication 2018 ["TrueSkill 2: An improved Bayesian skill rating system"](https://www.microsoft.com/en-us/research/uploads/prod/2018/03/trueskill2.pdf), an improvement on the original TrueSkill system developed for match making in Halo (3?, never played too much halo 😬).

This paper was pretty straightforward, so this article will just cover the keypoints made in each section, focusing on the applications of Bayesian Networks and Markov Chains for Monte Carlo Methods.

## Introduction

The paper aims to develop an accurate and computationally efficient skill rating to estimate the ability of a player to win the next match.  In order to meet the requirements, set in place by the researchers _for_ developers, the probabilistic generative models must make assumptions about how match results are related to player skill and vice versa. Furthermore, there are meta-requirements to make this rating accurate with minimal data as the alternative of playing dozens of matches before noticing improved mathmaking would suck, and no one would play the game.  Bayesian inference is good at approximation with few data.

> "A system or model is only as good as its underlying assumptions."

### Priorities for TrueSkill 2

1. Support for team games
2. Changeable skill ratings over time
3. Compatibility with existing Match Making systems
4. Aligned Incentives such that players seek to improve their skill rating by completing the objectives of the game, as an "optimally accurate" prediction model might be hackable e.g. _quitting while ahead_ or _camping to prevent deaths_
5. Minimal training data requirements
6. Low computational cost: $ 
7. Minmal tuning: time

Improvements on TrueSkill 1 (_I refer to it explicitly TrueSkill 1 to distinguish from the focus of this paper_)

1. Latent (potential) skill is measured by performance which is a noisy sample of the former, based on individual contributions (kill rate, death rate, score, AND wins/losses) rather than simply the win/loss ratio
2. Team Performance is a weighted sum of the performance of all the players 
    - this assumes linearity of skill, but it's okay for reasons covered later, namely tunable parameters
3. If the performance of one team exceeds the performance of another by some margin $\epsilon$, the that team wins 
4. A player's skill evolves over time according to a random walk which is biased towards improvement over time
5. Quitting or leaving a match early matters
6. Skills is assumed to be correllated across game modes, whereas TrueSkill 1 had independent parameters for different modes 
7. Players in a squad with one another are assumed to perform better than normal

## Bayesian Networks

- Nodes in a Bayesian Network represent _things that you believe to be true_
- Directed connections indicate the probabilistic dependency between beliefs 
    - Though connections are causal in direction, this is only a soft indication as Bayes rule allows us to go both way across the diagram of the model

TODO colored graphic here of the network

### Building the Model

Base skill is defined by: 

$$
\begin{aligned}
    \text{skill}_i^{t_0} \sim \mathcal N(m_0, v_0), \qquad \forall \text{ player } i, \text{ time } t
\end{aligned}
$$

After each match, the player's skill changes by a random amount given by a variance parameter $\gamma$:

$$
\begin{aligned}
    \text{skill}_i^{t + L} \sim \mathcal N(\text{skill}_i^t, \gamma^2), \qquad \text{ after match length L}
\end{aligned}
$$

Degradation of skill over time spent _not_ playing is given by a parameter $\tau$:

$$
\begin{aligned}
    \text{skill}_i^{t'} \sim \mathcal N(\text{skill}_i^t, \tau^2(t'-t))
\end{aligned}
$$

And after each game, performance (sample of skill) changes by some amount related to the randomness of the game: $\beta$:

$$
\begin{aligned}
    \text{perf}_i^{t} \sim \mathcal N(\text{skill}_i^t, \beta^2)
\end{aligned}
$$

Simulated outcomes are intuitively defined as:

$$
\begin{aligned}
    \text{perf}_1 - \text{perf}_2 > \epsilon \qquad &\text{player 1 wins} \\
    | \text{perf}_1 - \text{perf}_2| \leq \epsilon \qquad &\text{draw} \\
    | \text{perf}_1 - \text{perf}_2| > \epsilon \qquad &\text{player 1 wins} \\
\end{aligned}
$$

with overall team performance given as:

$$
\begin{aligned}
  \text{perf}_{\text{team}} = \sum_{i \in \text{team}} \text{perf}_i \frac{\text{timePlayed}_i}{L}
\end{aligned}
$$

and team outcomes decided similarly.

Each of the parameters above are tunable, so the only assumption is that $m_0, v_0$ are given which _should_ be available from a record of all or some prior games. Furthermore, using the Rule of 5, you could at least get the median (not to be naively confused with the mean). TODO get rule of 5 in here 
