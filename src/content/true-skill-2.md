---
title: "22 | Digest: TrueSkill 2: Better Bayesian Assumptions Boogaloo"
date: "2020-08-12"
description: "Optimal Match Making using Bayesian Inference"
path: "/blog/true-skill-2.md"
---

## Preface
This article contains my summary of Daniel's summary of Microsoft Research's publication 2018 ["TrueSkill 2: An improved Bayesian skill rating system"](https://www.microsoft.com/en-us/research/uploads/prod/2018/03/trueskill2.pdf), an improvement on the original TrueSkill system developed for match making in Halo (3?, never played too much Halo 😬).

This paper was pretty straightforward, so this article will just cover the key points made in each section, focusing on the applications of Bayesian Networks and Markov Chains for Monte Carlo Methods.

## Introduction

The paper aims to develop an accurate and computationally efficient skill rating to estimate the ability of a player to win the next match.  In order to meet the requirements, set in place by the researchers _for_ developers, the probabilistic generative models must make assumptions about how match results are related to player skill and vice versa. Furthermore, there are meta-requirements to make this rating accurate with minimal data as the alternative of playing dozens of matches before noticing improved math making would suck, and no one would play the game.  Bayesian inference is good at approximation with few data.

> "A system or model is only as good as its underlying assumptions."

### Priorities for TrueSkill 2

1. Support for team games
2. Changeable skill ratings over time
3. Compatibility with existing Match Making systems
4. Aligned Incentives such that players seek to improve their skill rating by completing the objectives of the game, as an "optimally accurate" prediction model might be hackable e.g. _quitting while ahead_ or _camping to prevent deaths_
5. Minimal training data requirements
6. Low computational cost: $ 
7. Minimal tuning: time

Improvements on TrueSkill 1 (_I refer to it explicitly TrueSkill 1 to distinguish from the focus of this paper_)

1. Latent (potential) skill is measured by performance which is a noisy sample of the former, based on individual contributions (kill rate, death rate, score, AND wins/losses) rather than simply the win/loss ratio
2. Team Performance is a weighted sum of the performance of all the players 
    - this assumes linearity of skill, but it's okay for reasons covered later, namely tunable parameters
3. If the performance of one team exceeds the performance of another by some margin $\epsilon$, the that team wins 
4. A player's skill evolves over time according to a random walk which is biased towards improvement over time
5. Quitting or leaving a match early matters
6. Skills is assumed to be correlated across game modes, whereas TrueSkill 1 had independent parameters for different modes 
7. Players in a squad with one another are assumed to perform better than normal

## Bayesian Networks

- Nodes in a Bayesian Network represent _things that you believe to be true_
- Directed connections indicate the probabilistic dependency between beliefs 
    - Though connections are causal in direction, this is only a soft indication as Bayes rule allows us to go both way across the diagram of the model

![](/images/true-skill-2-1.png)

### Building the Model

Base skill is defined by: 

$$
\begin{aligned}
    \color{#2bffdf}
    \text{skill}_i^{t_0} \color{#000} \sim \mathcal N(m_0, v_0), \qquad \forall \text{ player } i, \text{ time } t
\end{aligned}
$$

After each match, the player's latent skill changes by a random amount given by a variance parameter $\gamma$:

$$
\begin{aligned}
    \color{#2bffdf}
    \text{skill}_i^{t + L} \color{#000} \sim \mathcal N(\text{skill}_i^t, \gamma^2), \qquad \text{ after match length L}
\end{aligned}
$$

Degradation of skill over time spent _not_ playing is given by a parameter $\tau$:

$$
\begin{aligned}
    \color{#2bffdf}
    \text{skill}_i^{t'} \color{#000} \sim \mathcal N(\text{skill}_i^t, \tau^2(t'-t))
\end{aligned}
$$

And after each game, performance (sample of skill) changes by some amount related to the randomness of the game $\beta$:

$$
\begin{aligned}
    \color{#ffb637}
    \text{perf}_i^{t}\color{#000} \sim \mathcal N(\text{skill}_i^t, \beta^2)
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

with overall team performance deterministically given as:

$$
\begin{aligned}
    \color{#2f47ff}
    \text{perf}_{\text{team}} \color{#000} = \sum_{i \in \text{team}} \text{perf}_i \frac{\text{timePlayed}_i}{L}
\end{aligned}
$$

and team outcomes decided similarly.

Each of the parameters above are tunable, so the only assumption is that $m_0, v_0$ are given which _should_ be available from a record of all or some prior games. Furthermore, using the Rule of 5, you could at least get the median (not to be naively confused with the mean). TODO get rule of 5 in here

| Tunable Parameter | Value                                    | 
|-------------------|------------------------------------------|
|   $m_0$           | $\text{skill}$ rating                    |
|   $v_0$           |  variance of the $\text{skill}$ rating, the narrower the more accurate |
|   $\gamma$        | change in latent skill from game to game |
|   $\tau$          | "rust" factor, account for not being warmed up & degradation of skill over time |
|   $\beta$         | the amount of randomness in the game: difference between skill and performance |
|   $\epsilon$      | the threshold for accurate results |


### Markov Chain Monte Carlo Methods

If we know that $\text{skill}$ and $\text{perf}$ are normally distributed, it would make sense to assume that the model already suggests win/loss rate, but this is often not the case.  Usually, these compositions of distributions are intractable, meaning they are not sampleable.  Markov Chain Monte Carlo Methods le us work around this, with any such combination of distributions. If we follow the sample chain down to $\text{perf}_i$, we can roughly plot the resultant _would-be_ sample of our intractable "winner" distribution. This plot would be numerically correct or accurate, but not analytically correct.

## Computing Skill Ratings

> Formally, the model defines a joint distribution over player skills and match results, conditional on the unmodeled aspects of each match (which we will abbreviate as $\text{conditions}$): 

$$
\begin{aligned}
  p(\text{skills} | \text{results, conditions}) = \frac{p(\text{results} | \text{skills, conditions}) p(\text{skills})}{p(\text{results} | \text{conditions})}
\end{aligned}
$$

> In practice, we don’t compute the entire joint distribution over $\text{skills}$, but only the marginal distribution of $\\ \text{skills}^t_i$. This distribution is approximated by a Gaussian, and the mean of that Gaussian is taken as the player’s skill rating.

### Algorithm for computing skill ratings

$$
\boxed{
\begin{aligned}
    &\text{Initialize } \text{skills}_i \qquad \forall i \in \text{players, with mean, variance } m_0, v_0 \\ 
    &\text{For each match result in order of start time: }\\
        &\quad \text{For each player in the match} \\ 
            &\qquad\text{Look up the current skill}_i \\
            &\qquad\text{Increase the variance according to the time elapsed since the player's last match } \tau \\
            &\qquad\text{Infer match result and skill distributions to get a new set of skill distributions to} \\ &\qquad\qquad  \text{ represent skill}_i \text{for the current match} \\
            &\qquad\text{Increase the variance according to } \gamma \text{ to represent change in skill from playing the match} \\
            &\qquad\text{Store the new skill}_i \\
\end{aligned}}
$$

TrueSkill 2 used online updates which were fast, real-time approximations of the resultant distribution over $\text{skills}$.  The paper also discussed the increased accuracy of skill ratings from batch processing which was drastically slower, but less noisy.  However, after a few sample games, the online ratings roughly converged to the batch-inferred ratings (this is how match making is able to provide relatively decent matchups in games like CS, or Rocket League after 10 _qualifying_ matches )

## Parameter Estimation

We can tune the aforementioned parameters until our model resembles historical data.  They could be trained in a variety of ways, including [evolutionary, or genetic methods](https://natureofcode.com/book/chapter-9-the-evolution-of-code/). Using [RProp](https://florian.github.io/rprop/) which, among other things, only uses the signs of the gradients to compute updates.  

> Speculation: TrueSkill 2 uses RProp for its low computational cost and is potentially better suited for rocky training landscapes.  Additionally, the standard backpropagation might not have tracked match outcomes as well as RProp.

With sufficient training data (1000 matches, for Halo 5: Slayer game mode), the following parameter values resulted in satisfactory model accuracy:

$m_0 = 3$ (team mates are very important)

$v_0 = 1.6$ (skills of new players on varied by ~1 from the mean)

$\gamma = 10^{-3}$ (skills change slowly) 

$\tau = 10^{-8}/\text{minute s.t. } \gamma/\tau = 10^5 \text{minutes of non-play are equivalent to one match}$

$\beta = 1$ 

$\epsilon = 10^{-3}$ (draws are rare) 

## Metric-driven Modelling and Individual Statistics

> "You find a way to measure the outcome you want, you offer to give someone access to levers by which they can plausibly influence this outcome, and you contract to pay them more cash the higher is this measure." - [Rob Hanson](https://www.overcomingbias.com/2020/04/what-can-money-buy-directly.html)

This section of the paper described how the research team achieved increased predictive accuracy by incentivizing or identifying individual metrics which contributed to $\text{skill}$.

### Squad Offset

Noting that when players queue together, they tend to have a higher $\text{perf}_\text{team}$, the model adds an offset to the $\text{skill}_i$ depending on the size of the squad s.t.:

$$
\begin{aligned}
    \color{#ffb637}
    \text{perf}_i^t \color{#000} \sim \mathcal N(\text{skill}_i^t + \text{squadOffset(size of squad)}, \beta^2)
\end{aligned}
$$

### Experience Effects

In order to bias the change in $\text{skill}$ with experience towards improvement, the team introduce a variable $\text{experience}_t^t$ to be the number of matches played in the current game mode before time $t$, capped at 200 for computationally efficient.

$$
\begin{aligned}
    \color{#2bffdf}
    \text{perf}_i^{t+L} \color{#000} \sim \mathcal N(\text{skill}_i^t + \text{experienceOffset(min(experience}_i^t, 200)), \gamma^2)
\end{aligned}
$$

Additionally, other statistics that might have deserved their own modifications as above seemed to be strongly correlated with tracked parameters.  For example, a lapse in time played $\tau$ was strongly correlated to kill rate and death rate, as was score.


### Gamemode
By adding additional tunable parameters $w_p^c, w_o^c, v^c$, for each count type $c \in {\text{kill, death}}$ for each game mode. the model was able to determine how individual statistics depend on performance, the skill of teammates, and opponents:

$$
\begin{aligned}
    \text{count}_i^c \sim \max (0, \mathcal N((w_p^c \text{perf}_i + w_o^c \text{perf}_i^o) \text{timePlayed}_i, v^c \text{timePlayed}_i))
\end{aligned}
$$

This model worked for any team size are is unique to previous work on sports scores in 3 ways:

1. TrueSkill 2 incorporates the effect of match length (and the penalty of leaving early)

2. TrueSkill 2 models correlation between individual statistics and a player's ability to win

3. TrueSkill 2 incorporates the effect of having many teams of different sizes

By delineating between $\text{baseSkill}$ and \text{skill} in a specific game mode, the model was also tunable per different modes s.t. the #1 free for all player doesn't get matched against the #1 player of a different game mode that he might suck at.

Adding in the additional assumptions defined for TrueSkill 2, the model now resembles:

![](/images/true-skill-2-2.png)


## Additional reading

[Bayesian Methods for Hackers (the missing modeling manual for PyMC3](https://www.amazon.com/Bayesian-Methods-Hackers-Probabilistic-Addison-Wesley/dp/0133902838)

[How to Measure Anything]( https://www.amazon.com/How-Measure-Anything-Intangibles-Business/dp/1118539273)