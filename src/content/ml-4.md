---
title: "ML 4: Kit & Kaboodle"
date: "2020-06-26"
description: "Sutton, Barto, Bhoag"
path: "/blog/ml-4"
---
<style> .n { visibility: hidden; } </style>

# Index 

- [Introduction](#intro)
    - [Glossary](#gl) 
- [Chapter 1: The Reinforcement Learning Problem](#ch1)
    - [1.1 Reinfrocement Learning](#ch1.1)
    - [1.2 Examples](#ch1.2)
    - [1.3 Elements of Reinforcement Learning](#ch1.3)
    - [1.4 Limitations and Scope](#ch1.4)
    - [1.5 An Extended Example: Tic-Tac-Toe](#ch1.5)
    - [1.6 Summary](#ch1.6)
- [Chapter 2: Mutli-arm Badits](#ch2)


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

## <a name="ch1.1" class="n"></a> 1.1 Reinfrocement Learning

> Reinfocement learning is different from _supervised learning_, the kind of learning studied in most current reserch in the field of machine learning. Supervised learning is learning from a training set of labeled examples provided by a knowledgable external supervisor. Each example is a description of a situation together with a specification—the label—of the correct action the system should take to that situation, which is often to identify a category to which the situation belongs. The object of this kind of learning is for the system to extrapolate, or generalize, its responses so that it acts correctly in situations not present in the training set.

Whereas reinforcement learning relies on interaction between an agent and the environment, supervised learning which utilizes the "omniscient" training data set.

> Although one might be tempted to think of reinforcement learning as a kind of unsupervised learning because it does not rely on examples of correct behavior, reinforcement learning is trying to maximize a reward signal instead of trying to find hidden structure. 

Reinforcement learning exists outside the dual paradigms of supervision in part due to the inherent trade-off between _exploration_ and _exploitation_. In order to discover optimal actions (exploration), the agent must forego performing known actions and risk taking an unknown action. 

> The agent has to exploit what it already knows in order to obtain reward, but it also has to explore in order to make better action selections in the future

## <a name="ch1.2" class="n"></a> 1.2 Examples

> - A gazelle calf struggles to its feet minutes after being born. Half an hour later it is running at 20 miles per hour.

In all of the exmaples given, the agent's actions affect the future state of the environment in an unknown, but predictable way.  

> Correct choice requires taking into account indirect, delayed consequences of actions, and thus may require foresight or planning.

## <a name="ch1.3" class="n"></a> 1.3 Elements of Reinforcement Learning 

Reinforcement learning can be chategorized by four main subelements (with main elements of agent, environment): 

- **policy** - defines the agent's behaior. Can be considered as a mapping from percieved states of the environment to actions to be taken when in those states.

- **reqard signal** - defines the goal of the RL problem as the agent's purpose is to maximize reward

- **value function** - whereas the reward signal indicates what is good in an immediate sense, a value function specifies what is good in the long run by accounting for the reward gained from states that are _likely to follow_ from an action.

- **model of environment** - mimics the behavior of the environment, allowing inferences to be made about how the environment _will_ behave.
    - **model-based** - methods that rely on models (duh) and planning
    
    - **model-free** - explicit trial-and-error learners --> anti-planning

## <a name="ch1.4" class="n"></a> 1.4 Limitations and Scope

While this book focuses on valu-estimate functions as a core component of the algorithms discussed, alternative methods such as genetic algorithms and programming, simulated annealing, and other optimization methods have proven to be succcessful as well.

If action spaces are sufficiently small, or good policies are common, then these _evolutionary_ approaches can be effective.  However, methods that can exploit the details of individual behavioral interacitons can be more efficient than the evolutionary methods listed above.

Some methods do not appeal to value functions, but merely search the policy spaces defined by a collection of numerical parameters, estimating the directions they need to tuned towards to most rapidly improve a policy's performance.  **Policy gradients** like this have proven useful in many cases. 

## <a name="ch1.5" class="n"></a> 1.5 An Extended Example Tic-Tac-Toe

Consider a game of tic-tac-toe against an imperfect player whoe play is sometimes incurrect and allows us to win.  Whereas classical game theory techniques such as **minimax** offer solutions to intelligent/perfect opponents, they may fail in situations where they were not already disposed to win.

> Classical optimization methods for sequential decision problems, such as dynamic programming, can compute an optimal solution for any opponent, but require as input a complete specification of that opponent, including the probabilities with which the opponent makes each move in each board state

An RL approach using a value function might make use of a table of numbers associated with each possible state in the game.  Each number will be the latest estimate of the state's value, and the whole tabled is the learned value function.  State A is said to be better than state B if the current estimate of the probability of our winning from A is higher than it is from B.

> Assuming we always play Xs, then for all states with three Xs in a row the probability of winning is 1, because we have already won. Similarly, for all states with three Os in a row, or that are “filled up,” the correct probability is 0, as we cannot win from them. We set the initial values of all the other states to 0.5, representing a guess that we have a 50% chance of winning.

> We play many games against the opponent. To select our moves we examine the states that would result from each of our possible moves (one for each blank space on the board) and look up their current values in the table. Most of the time we move greedily, selecting the move that leads to the state with greatest value, that is, with the highest estimated probability of winning. Occasionally, however, we select randomly from among the other moves instead. These are called exploratory moves because they cause us to experience states that we might otherwise never see.

Throughout the "playing" process, we update the values of the states we actually encounter from their initialized value of 0.5 in order to make our value estimates more accurate. To do this, we back up the current value of the earlier state to be closer to the value of the later state: 

$V(s) \leftarrow V(S) + \alpha [V(s') - V(s)]$ 

$s,s', \alpha = \text{state before greedy move, state after greedy move, step-size parameter}$ 

If the step-size parameter is reduced properly over time, this method converges, for any fixed opponent. If the step-size parameter is _not_ reduced all the way to zero over time, then the agent also plays well against opponenets that slowly change their strategy. 

Evolutionary methods struggle to retain association between which actions _caused_ positive reward, equally weighting all actions that contriubted to a "win". In contrast, value functions evaluate individual states.  Although both methods search the policy space, learning the value function takes advantage of the information available.

By adding a neural network to the tabular representation of the value-function, the agent can generalize from it's experiences so that it selects action based on information fomr _similar_ stated experienced in the past. Here, supervised learning methods can helpout, although neural nets are neither the only or best way to transcend tabularization.

The tic-tac-toe example agent is model-free in this sense w.r.t its opponent: it has no model of its opponent.  However, this can be advantageous as it avoids complex method in which bottlenecks arise from constructing a sufficiently accurate environment model.

## <a name="ch1.6" class="n"></a> 1.6 Summary

> RL is the first field to seriously address the computational issues that arise when learning from interaction in order to achiever long-term goals. RL's use of value functions distinguishes reinforcement learning methods from evolutionary methods that search directly in policy space guided by scalar evaluations of entire policies.

# <a name="ch2" class="n"></a> Chapter 2: Multi-arm Bandits

