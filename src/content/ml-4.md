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
    - [2.1 An $n$-Armed Bandit Problem](#ch2.1)
    - [2.2 Action-Value Methods](#ch2.2)
    - [2.3 Incremental Implementation](#ch2.3)
    - [2.4 Tracking a Nonstationary Problem](#ch2.4)
    - [2.5 Optimistic Initial Values](#ch2.5)
    - [2.6 Upper-confidence-Bound Action Selection](#ch2.6)
    - [2.7 Gradient Bandits](#ch2.7)
    - [2.8 Associate Search (Contextual Bandits)](#ch2.8)
    - [2.9 Summary](#ch2.9)
- [Chapter 3: Finite Markov Decision Processes](#ch3)
    - [3.1 The Agent-Environment Interface](#ch3.1)
    - [3.2 Goals and Rewards](#ch3.2)
    - [3.3 Returns](#ch3.3)
    - [3.4 Unifed Notation for Episodic and Continuing Tasks](#ch3.4)
    - [3.5 The Markov Property](#ch3.5)
    - [3.6 Markov Decision Processes](#ch3.6)
    - [3.7 Value Functions](#ch3.7)
    - [3.8 Optimal Value Functions](#ch3.8)
    - [3.9 Optimality and Approximation](#ch3.9)
    - [3.10 Summary](#ch3.10)
- [Chapter 4: Dynamic Programming](#ch4)
    - [4.1 Policy Evaluation](#ch4.1)
    - [4.2 Policy Improvement](#ch4.2)
    - [4.3 Policy Iteration](#ch4.3)
    - [4.4 Value iteration](#ch4.4)
    - [4.5 Asynchronous Dynamic Programming](#ch4.5)
    - [4.6 Generalized Policy Iteration](#ch4.6)
    - [4.7 Efficiency of Dynamic Programming](#ch4.7)
    - [4.8 Summary](#ch4.8)
- [Chapter 5: Monte Carlo Methods](#ch5)
    - [5.1 Monte Carlo Prediction](#ch5.1)
    - [5.2 Monte Carlo Estimation of Action Values](#ch5.2)
    - [5.3 Monte Carlo Control](#ch5.3)
    - [5.4 Monte Carlo Control Without Exploring Starts](#ch5.4)
    - [5.5 Off-policy Prediction via Importance Sampling](#ch5.5)
    - [5.6 Incremental Implementation](#ch5.6)
    - [5.7 Off-Policy Monte Carlo Control](#ch5.7)
    - [5.8 Importance Sampling on Truncated Returns](#ch5.8)
    - [5.9 Summary]($ch5.9)
 - [Chapter 6: Temporal-Difference Learning](#ch6)

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

RL is an evaluation oriented approach which retroactively improves rather than prooactively instruct. Evaluative feedback depends on the actions taken, and instructive feedback is independent of the action. To study the evaluative aspect, we will work in a nonassociative setting which reduces the complexity of the RL problem to highlight the former topic: _the n-armed bandit problem_.

## <a name="ch2.1" class="n"></a> 2.1 An $n$-Armed Bandit Problem

When repeatedly faced with $n$ different actions, after which the agent is rewarded from a stationary action-dependent probability distribution, how should you maximize expected total reward over some time period, say 1,000 time-steps. Each action has an _estimated_ expected reward, called the value of that action. 

If the agent prioritizes the action associated with the highest estimated value, this is called a _greedy_ action resulting from _exploiting_ the current knowledge of action-value pairs.

Choosing a non-greedy action for the sake of broadening exploitable knowledge is called _exploration_.

> Exploitation is the right thing to do to maximize the expected reward on the one step, but exploration may produce the greater total reward in the long run ... Reward is lower in the short run, during exploration, but higher in the long run because after you have discovered the better actions, you can exploit them many times. 

## <a name="ch2.2" class="n"></a> 2.2 Action-Value Methods

In this chapter, the true value of action $a$ is denoted $q(a)$, and the estimated value on the $t$-th time-step is $Q_t(a)$. An intuitive estimation is the average rewards actually received when an action has been selection. 

>  In other words, if by the $t$-th time step action a has been chosen $N_t(a)$ times prior to $t$, yielding rewards $R_1, R_2, . . . , R_{N_t}(a)$ , then its value is estimated to be

$$
Q_t(a) = \begin{cases} 
    \frac{R_1 + R_2 + ... + R_{N_t}(a)}{N_t(a)} &\text{if } N_t(a)  > 0 \\
    0; &\text{o.w.} 
    \end{cases}
$$

Note that as $\lim\limits_{N_t(a) \to \infty} Q_t(a) = q(a)$ which is called the _sample-average_ method for estimating action values as each estimate is the simple average o the sample of relevant rewards.

> The simplest action selection rule is to select the action (or one of the actions) with highest estimated action value, that is, to select at step $t$ one of the greedy actions, $A^*_t$, for which $Q_t(A^*_t) = \max \limits_{a} Q_t(a)$. This greedy actionselection method can be written as

$A_t = \arg \max \limits_{a} Q_t(a)$

Greedy action selection always exploits current knowledge to maximize immediate reward spending no time sampling inferior actions. One solution to the exploration-exploitation conflict is $\varepsilon$-greedy exploration which is taking a random action with small probability $\varepsilon$ instead of the exploitative action. $\varepsilon$-greedy methods are advantageous as, since each action has equal probability of being randomly selected, each action will be sampled an infinite number of times, guaranteeing $N_t(a) \to \infty, \forall a$ s.t. $Q_t(a)$ converges to $q(a)$

Tests against an arbitrary 10-armed-bandit problem show that $\varepsilon \in [0.01, 0.1]$ is a good general hyper parameter for $\varepsilon$-greedy exploration with trade offs between optimal-action discovery sooner vs better long-term performance.

> It is also possible to reduce $\varepsilon$ over time to try to get the best of both high and low values.

## <a name="ch2.3" class="n"></a> 2.3 Incremental Implementation

The problem with the straightforward estimatation of the value of an action as described in 2.1 is that it become memory and computationally intensive without bound over time. Each additional reward following an action requires more memory to store in order to determine $Q_t(a)$. To fix, let $Q_k$ deonte the estimate for an agent's $k$-th reward, that is the average of its first $k-1$ rewards. The average of all $k$ rewards is given by:

$$
\begin{aligned}
    Q_{k+1} &= \frac{1}{k}  \displaystyle\sum_{i=1}^k R_i \\ 
    & = \frac{1}{k} \Big( R_k + \displaystyle\sum_{i=1}^{k-1} R_i \Big) \\
    & = \frac{1}{k} \Big( R_k + (k-1) Q_k + Q_k - Q_k \Big) \\
    & = \frac{1}{k} \Big( R_k + kQ_k - Q_k \Big) \\
    & = Q_k + \frac{1}{k} \Big[ R_k - Q_k \Big],
\end{aligned}
$$

which only requires memory for $Q_k, k$, and minimaly computation for each new reward.

The update rule is a form that occurs frequently throughout this textbook (foreshadowing the Bellman) whose general form is:

$NewEstimate \leftarrow OldEstimate + StepSize \underbrace{[Target - OldEstimate]}_{\text{error estimate}}$

The $\text{error estimate}$ is reduced by taking steps towards the $Target$ which indicates a desirable direction to move, e.g. the $k$-th reward.  Note that the $StepSize$ used in the incremental method above changes from time-step to time-step according the the parameter $\alpha_t(a) \leftarrow \alpha = \frac{1}{k}$

## <a name="ch2.4" class="n"></a> 2.4 Tracking a Nonstationary Problem

In cases where the environment is nonstationary and the "bandit" is changing over time, it makes sense to weight recent rwards more heavily than long-past ones. By using a constant step-size parameter, and modifying the incremental update rule from 2.3, we can achieve this effect:

$Q_{k+1} = Q_k + \alpha \big[R_k - Q_k \big]$ 

where $\alpha \in (0,1]^1$ is constant s.t. $Q_{k+1}$ is a weighted average of past rewards and the initial estimate $Q_1$:

$$
\begin{aligned}
    Q_{k+1} &= Q_k + \alpha \big[R_k - Q_k \big] \\ 
    &= \alpha R_k + (1 - \alpha) Q_k  \\ 
    &= \alpha R_k + (1 - \alpha)[\alpha R_{k-1} + (1 - \alpha) Q_{k-1}] \\ 
    &= \alpha R_k + (1 - \alpha)\alpha R_{k-1} + (1 - \alpha)^2 Q_{k-1} \\ 
    &= \alpha R_k + (1 - \alpha)\alpha R_{k-1} + (1 - \alpha)^2 Q_{k-2} + ... + (1 - \alpha)^{k-1} \alpha R_1 + (1-\alpha)^kQ_1 \\ 
    &= (1-\alpha)Q_1 + \displaystyle\sum_{i=1}^k \alpha(1- \alpha)^{k-i}R_i.
\end{aligned}
$$

This is the weighted average sum where $(1-\alpha)Q_1 + \displaystyle\sum_{i=1}^k = 1$.  Note that because of _exponential, recency-weighted average_, if $1-\alpha=0$, then all the weight goes to the last reward.

> Sometimes it is convenient to vary the step-size parameter from step to step. Let $\alpha_k(a)$ denote the step-size parameter used to process the reward received after the $k$-th selection of action $a$, where  $\alpha_k(a) = \frac{1}{k}$ is the sample-average method which is guaranteed to converge to the true action values.  But, convergence is not guaranteed for all choices of the sequence $\{\alpha_k(a)\}$.  Per stochastic approximation theory, the conditions to assure convergence with probability 1 are given by:

$\displaystyle\sum^\infty_{k=1} \alpha_k(a) = \infty$ and $\displaystyle\sum^\infty_{k=1} \alpha^2_k(a)  \infty$

The first condition guarantees that steps are large enough to eventually overcome any initial conditions or random fluctuations and the second guarantees that they eventually become small enough to assure convergence. Note that both conditions are met for the sample-average case, but not for the case of constant step-size paramter. 

## <a name="ch2.5" class="n"></a> 2.5 Optimistic Initial Values

All the methods discussed above are to some degree dependent on or _biased_ towards the initial action-value estimates $Q_1(a)$. For sample-average methods, the bias disappears once all action have been selected at least once, but constant-$\alpha$ methods retain permanent bias.  Optimistic initial action values encourage exploration as most actions perform worse than the initial value, causing exploitative actions to attempt the other faux optimistic actions before beginning true exploration.  At first, these methods tend to perform worse as they are mor exploratory, but rapidly perform better as the need for exploration is resolved sooner.

However, such and approach is not effective in nonstationary problems as the drive for exploration is inherently temporary.  

> If the task changes, creating a renewed need for exploration, this method cannot help ...  The beginning of time occurs only once, and thus we should not focus on it too much.

## <a name="ch2.6" class="n"></a> 2.6 Upper-Confidence-Bound Action Selection

Exploration is needed while estimates of action values are uncertain. $\varepsilon$-greedy action selection force non-actions to be tried indiscriminately, with no prference for those that are nearly greedy or particularly uncertain. 

> It would be better to select among the non-greedy actions according to their potential for actually being optimal, taking into account both how close their estimates are to being maximal and the uncertainties in those estimates. One effective way of doing this is to select actions as:

$A_t = \arg \max\limits_{a} \Big[Q_t(a) + c \sqrt{\frac{\ln{t}}{N_t(a)}} \Big ],$

where $c > 0$ controls the degree of exploration and for $N_t(a)=0$, $a$ is considered a maximizing action.

> The idea of this upper confidence bound (UCB) action selection is that the square-root term is a measure of the uncertainty or variance in the estimate of $a$’s value.  Therefore, the quantity being $\max$'ed over is a sort of upport bound on the possible true valie of action $a$, with the $c$ parameter determining the confidence level.  Each time $a$ is selected, the uncertainty is presumably reduced; $N_t(a)$ i incremented, and the term is square root decreased.

>  Another difficulty is dealing with large state spaces, ... In these more advanced settings there is currently no known practical way of utilizing the idea of UCB action selection.

## <a name="ch2.7" class="n"></a> 2.7 Gradient Bandits

Another approach is learning a numerical _preference_ $H_t(a)$ for each $a$. While the preference indicates the frequency of an action being taken, it has no interpretation in terms of reward. Only relative prefence of one action over another is considered e.g. if we add an arbitrary, but equal amount to all the pereferences, there is no affect on the action probabilities which are determine according to a soft-max (or Gibbs, Boltzmann) distribution: 

$\text{Pr} \{A_t = a\} =\frac{e^{H_t(a)}}{\sum^n_b=1 e^{H_t(b)}} = \pi_t(a)$, where initially, all preferences are the same ($H_1(a) = 0, \forall a$) so that all action have an initial equal probability of being selected.

The application in stochastic gradient ascent is, after selecting the action $A_t$ and receiving reward $R_t$, the preferences are updated by:

$H_{t+1}(A_t) = H_t(A_t) + \alpha (R_t - \bar{R_t})(1-\pi_t(A_t))$

and 

$H_{t+1}(a) = H_t(a) - \alpha (R_t - \bar{R_t})\pi_t(a), \forall a \neq A_t$,

where $\alpha > 0$ is the step-size paramer, and $\bar{R_t} \in \R$ is the average of all the rewards up through and including $t$ which can be computed incrementall (2.3, 2.4 for stationary and nonstationary problems, respectively).  $\bar{R_t}$ is the benchmark reward against which each reward is compared.  The probability of taking $A_t$ is increased/decreased relative to it's difference with the benchmark.  Non-selected actions move in the opposite direction.

Deeper insight can be gained by understanding it as a stochastic approximation to gradient ascent.  In _exact_ gradient ascent, each preference $H_t(a)$ would be incrementing proportional to the increments effect on performance: 

$H_{t+1}(a) = H_t(a) + \alpha \frac{\partial \mathbb{E}[R_t] }{\partial H_t(a)},$ where the measure of the performance here is the expected reward:

$\mathbb{E}[R_t] = \displaystyle\sum_t \pi_t(b)q(b).$

While it's not possible it implement gradient ascent exactly as we do not know the $q(b)$, the updates using the preference updates are equal to the above equation in expected value, making the algorithm an instance of stochastic gradient ascent.  This can be observed by:


$$
\begin{aligned}
    \partial \mathbb{E}[R_t] &= \frac{\partial}{\partial H_t(a)} \Bigg[ \displaystyle\sum_b \pi_t(b)q(b) \Bigg]\\
    &= \displaystyle\sum_b q(b) \frac{\partial \pi_t(b)}{\partial H_t(a)} \\
    &= \displaystyle\sum_b (q(b) - X_t) \frac{\partial \pi_t(b)}{\partial H_t(a)}, 
\end{aligned}
$$

where $X_t$ can be any scalar independent of $b$. Here, the graident sums to zero over all the actions: 

$\sum_b \frac{\partial \pi_t(b)}{\partial H_t(a)} = 0$

As $H_t(a)$ varies, some actions' probabilities go up, others down, s.t. the net change = 0 as the sum of the probabilities must remain equal to 1:

$= \displaystyle\sum_b \pi_t(b)(q(b)- X_t) \frac{\frac{\partial \pi_t(b)}{\partial H_t(a)}}{\pi_t(b)}$

which is now in the form of an expectation summed over all possible values $b$ of the random variable $A_t$:

$$
\begin{aligned}
    = \mathbb{E}\Bigg[ (q(A_t) - X_t) \frac{\partial \pi_t(A_t)}{\partial H_t(a)} / \pi_t(A_t) \Bigg] \\  
    = \mathbb{E}\Bigg[ (R_t - \bar{R_t}) \frac{\partial \pi_t(A_t)}{\partial H_t(a)} / \pi_t(A_t) \Bigg],
\end{aligned}
$$


> where we've chosen $X_t = \bar{R_t}$ and substituted $R_t$ for $q(A_t)$, which is permitted as $ \mathbb{E}[R_t] = q(A_t)$ and all other factors are non random.  Shortly we'll establish that $\frac{\partial \pi_t(A_t)}{\partial H_t(a)} = \pi_t(b)(\mathbb{I}_{a=b} - \pi_t(a))$ where 

$$
\mathbb{I}_{a=b}
\begin{cases} 
     1 &\text{if } a = b \\ 
     0 &\text{o.w.}
\end{cases}
$$

Which means that we now have: 

$$
\begin{aligned}
    &= \mathbb{E} [ (R_t - \bar{R_t}) \pi_t(A_t)(\mathbb{I}_{a=A_t} - \pi_t(a)) \pi_t(A_t) \big] \\
    &= \mathbb{E} [ (R_t - \bar{R_t}) (\mathbb{I}_{a=A_t} - \pi_t(a))  \big].
\end{aligned}
$$

With the intention of writing the performance gradient as an expectation of soething that can be sampled at each step, and the updated on each step proportional to the sameple, we can substitute the above expectation for the performance gradient which yields:

$H_{t+1}(1) = H_t(a) + \alpha (R_t - \bar{R_t})( \mathbb{I}_{a=A_t}-\pi_t(a)), \quad \forall a $

which is equivalent to the original algorithm.

After proving that $\frac{\partial \pi_t(b)}{\partial H_t(a)} = \pi_t(b)(\mathbb{I}_{a=b} - \pi_t(a))$, then we can show that the expected update of the gradient-bandit algorithm is equal to the gradient of the expected reward, and thus the algorithm is an instance of stochastic gradient ascent which in turn assures robust convergence properties.

> Note that this is independent of the selected action ... The choice of the baseline does not affect the expected update of the algorithm, but it does affect the variance of the update and thus the rate of convergence

## <a name="ch2.8" class="n"></a> 2.8 Associative Search (Contextual Bandits)

When there are different actions that need to be associated with different situation, a policy –that is, a mapping from situations to the actions that are best in those situations– needs to be learned. 

Suppose there are several differen $n$-armed bandit tasks and that on each play one of these different tasks is confronted at random. Unless you randomly select the true action value for the given task, this method will. Suppose, however, that when the bandit task is selected against your agent, you are given a distinct clue about its identity (but, importantly, not its action values).

## <a name="ch2.9" class="n"></a> 2.9 Summary

> - ε-greedy methods choose randomly a small fraction of the time, 
> - UCB methods choose deterministically but achieve exploration by subtly favoring at each step the actions that have so far received fewer samples. 
> - Gradient-bandit algorithms estimate not action values, but action
preferences, and favor the more preferred actions in a graded, probabalistic
manner using a soft-max distribution. 

> The simple expedient of initializing estimates optimistically causes even greedy methods to explore significantly.

While UCB appears to perform best in the $n$-bandit scenario, also note that each of the algorithms are fairly insensitive to their relevant hyperparemters. Further sophisticated means of balancing the exploration-exploitation conflict are discussed here.

[Source Code](https://github.com/MurphyPone/Sutton-Barto-Bhoag/tree/master/CH2-Multi-Armed-Bandits)

---

# <a name="ch3" class="n"></a> Chapter 3: Finite Markov Decision Processes

This chapter broadly characterizes the RL problem, presenting the idealized mathematical representation therein. Gathering insights from the mathematical structure, they introduce discussion of value functions and Bellman equations.

## <a name="ch3.1" class="n"></a> 3.1 The Agent-Environment Interface

> The learner and decision-maker is called the agent. The thing it interacts with, comprising everything outside the agent, is called the environment. These interact continually, the agent selecting actions and the environment responding to those actions and presenting new situations to the agent.

The agent interacts with the environment at each of the the discrete time steps, $t = 0,1,2,3,...$, with the agent receiving some representation of the environment's state $S_t \in \mathcal{S}$, where $\mathcal S$ is the set of possible states, and on that basis selects an action $A_t \in \mathcal{A}(S_t)$, where $\mathcal{A}(S_t)$ is the set of actions available in state $S_t$. After each action is taken (that is, 1 time step later), the agent receives reward $R_{t+1} \in \mathcal{R} \subset \mathbb{R}$, and enters $S_{t+1}$.

At each step, the agent develops its mapping from states to probabilities of selection each available action called it's _policy_ $\pi_t(a | s)$, (where $A_t = a, S_t = s$), which represents a flexible and abstract framework that can be applied to a wide range of problems.

>  the boundary between agent and environment is not often the same as the physical boundary of a robot’s or animal’s body. Usually, the boundary is drawn closer to the agent than that ... The general rule we follow is that anything that cannot be changed arbitrarily by the agent is considered to be outside of it and thus part of its environment. 

## <a name="ch3.2" class="n"></a> 3.2 Goals and Rewards

In RL, the goal of the agent is formalized in terms of the reward function, where it attempts to maximize cumulative reward in the long run.  It it critical to model success in such a way that indicates what we want to be accomplished: _what_ not _how_. Rewards are computed in/by the environment, not the agent. This is important to maintain imperfect control so that the agent _has_ to meaningfully interact with the environment rather than simply confer reward upon itself.

## <a name="ch3.3" class="n"></a> 3.3 Returns

How do we formalize cumulative reward for maximization? If the sequence of rewards awarded after time step $t$ is deonted $R_{t+1}, R_{t+2}, R_{t+3}, ...$, then we can maximize the expected return $G_t = R_{t+1} + R_{t+2} + ... + R_T$, where $T$ is the final time step. This works for envornments with terminal states at the end of each episode followed by a reset to a standard starting state.  

> In episodic tasks we sometimes need to distinguish the set of all nonterminal states, denoted $\mathcal S$, from the set of all states plus the terminal state, denoted $\mathcal S^+$.

In some cases, agent-environment interaction is not episodically divided; rather it is continuous and without limit.  In these cases, it's unsuitable to use $G_t$ as presented above as $T = \infty$, and return itself could be infinite (e.g. cart-pole).  To fix this issue, we use _discounting_ so that the agent tries to maxmimize the sum of discounted rewards ad-infinitum:

$G_t = R_{t+1} + \gamma R_{t+2} + \gamma R_{t+3} + ... = \displaystyle\sum^\infty_{k=0} \gamma ^k R_{t+k+1}$ where $ 0 \leq \gamma \leq 1$, and is called the discount rate. 

Gamma controls how near/faresighted the agent is.

> If $\gamma < 1$, the infinite sum has a finite value as long as the reward sequence $\{R_k\}$ is bounded. If $\gamma = 1$, the agent is “myopic” in being concerned only with maximizing immediate rewards: its objective in this case is to learn how to choose $A_t$ so as to maximize only $R_{t+1}$. 

## <a name="ch3.4" class="n"></a> 3.4 Unifed Notation for Episodic and Continuing Tasks

$\{A, R, \pi, T, etc.\}_{t,i}$ refer to the the representation of a variable at time $t$ of episode $i$.  Additionally, the sum over a finite and infinite number of terms can be unified by considering the terminal step to be an _absorbing state_ which transition only to itself and generates zero reward.

So, $G_t = \displaystyle\sum^{T-t-1}_{k=0} \gamma ^k R_{t+k+1}$ which includes the possibility of $T = \infty$ or $\gamma = 1$, but not both.

## <a name="ch3.5" class="n"></a> 3.5 The Markov Property

> Certainly the state signal should include immediate sensations such as sensory measurements, but it can contain much more than that. State representations can be highly processed versions of original sensations, or they can be complex structures built up over time from the sequence of sensations ... On the other hand, the state signal should not be expected to inform the agent of everything about the environment, or even everything that would be useful to it in making decisions. 

A state signal that succeeds in retaining all relevant information is said to be _Markov_, meaning that it summarizes everything about the complete sequence of positions (transition dynamics: SARSA) that led to it.

In the most general, discrete case, the necessary response may depend on everything that has happened earlier and can be definied as the complete probablity distribution: 

$P(R_{t+1} = r, S_{t+1} = s' | S_0, A_0, R_1, ... , S_{t-1}, A_{t-1}, R_t, S_t, A_t)$

If a state signal is _Markov_, i.e. the environment's response depends only on the state and action representations of the current time step, then the dynamics can be defined by: $(s', r | s, a)$. This, in turn, allows the agent to predict all future states and expected rewards from merely the given state.

Even if a state is _non-Markov_, it is useful to treat it as such, as the current state is always the fundemental basis for predicting future rewards which influence action selection.

> The inability to have access to a perfect Markov state representation is probably not a severe problem for a reinforcement learning agent.

## <a name="ch3.6" class="n"></a> 3.6 Markov Decision Processes

An RL task that satisfies the MArov property is called an _MDP_.  If the state and action spaces are finite, then it is call a _finite MDP_.

Given the dynamics specified by $p(s', r | s, a)$, the agent can computer anything else it needs to know about the environment:

- Expected rewards for state-action pairs: 

 $\qquad \qquad r(s,a) = \mathbb{E}[R_{t+1} | S_t=s, A_t=a] = \displaystyle\sum_{r \in \mathcal{R}}r \displaystyle\sum_{s' \in \mathcal{S}} p(s', r | s, a)$,

- State-transition probabilities: 

$\qquad \qquad p(s' | s, a) = \displaystyle\sum_{r \in \mathcal{R}} p(s', r| s, a)$

- Expected reward for the state-action-next triples: 

$\qquad \qquad r(s, a, s') = \mathbb{E}[R_{t+1} | S_t=s, A_t=a, S_{t+1} = s'] = \frac{\sum_{r \in \mathcal{R}}r p (s', r | s, a)}{p(s' | s, a)}$

## <a name="ch3.7" class="n"></a> 3.7 Value Functions

A Value function estimates _how good_ it is to be in a given state, or how good it is to perform a given action in a given state, defined in terms of expected reward.  The value of a state $s$ under a policy $\pi$: $v_\pi(s)$, is the expected return when starting in s, and following pi thereafter. More formally:

$v_\pi(s) = \mathbb{E} [G_t | S_t = s] = \mathbb{E}_\pi \Bigg[ \displaystyle\sum_{k=0}^\infty \gamma^k R_{t+k+1} \Big \vert S_t = s \Bigg]$.  

Similarly, the value of taking action $a$ in state $s$ under policy $\pi$, denoted $q_\pi(s,a)$ is defined the expected return starting from $s$, taking action $a$, and therefter following $\pi$: 

$q_\pi(s,a) = \mathbb{E} [G_t | S_t = s, A_t = a] = \mathbb{E}_\pi \Bigg[ \displaystyle\sum_{k=0}^\infty \gamma^k R_{t+k+1} \Big \vert S_t = s, A_t = a \Bigg ]$.  

$q_\pi$ is call the action-value (quality) function for policy $\pi$.  Both of these functions can be estimated with sufficient experience.  Estimation of $q_\pi, v_\pi$ as the number of times each state is encountered approaches infinity is called a _Monte Carlo method_ and involve averaging over many random samples of actual returns.

> For any policy π and any state s, the following consistency condition holds between the value of s and the value of its possible successor states:

$$
\begin{aligned}
    v_\pi(s) &=  \mathbb{E} [G_t | S_t = s] \\
    &= \mathbb{E}_\pi \Bigg[ \displaystyle\sum_{k=0}^\infty \gamma^k R_{t+k+1} \Big \vert S_t = s \Bigg] \\
    &= \mathbb{E}_\pi \Bigg[ R_{t+1} + \gamma \displaystyle\sum_{k=0}^\infty \gamma^k R_{t+k+2}  \Big \vert S_t = s \Bigg] \\
    &= \displaystyle\sum_a \pi(a | s) \displaystyle\sum_{s'} \displaystyle\sum_{r} p(s', r, | s, a) \Bigg[r + \gamma \mathbb{E} \Bigg[ \displaystyle\sum_{k=0}^\infty \gamma^k R_{t+k+2} \Big | S_{t+1}=s' \Bigg] \Bigg] \\
    &= \displaystyle\sum_a \pi(a | s) \displaystyle\sum_{s',r} p(s', r |s, a) \Big[r + \gamma v_\pi(s') \Big], 
\end{aligned}
$$

> [Which is ~simply~] a sum over all values of the three variables, $a, s', r$. For each triple, we compute its probability, $\pi(a|s)p(s', r|s, a)$, weight the quantity in brackets bythat probability, then sum over all possibilities to get an expected value.  This is the Bellman equation with $v_\pi$ as the solution.

## <a name="ch3.8" class="n"></a> 3.8 Optimal Value Functions

Because value functions define a partial ordering over policies, we can precisely define the optimal policy for a finite MDP.  A policy is defined to be better than or equal to a policy $\pi'$ if its expected return is greater than or equal to that of $\pi'$ for all states: $\pi \geq \pi' \iff v_\pi(s) \geq v_{\pi'} \quad \forall s \in \mathcal S$.  The optimal policy $\pi^*$ is one (or more) policies that is better than or equal to all other policies and is defined by:

$v^*(s) = \max \limits_{\pi} v_\pi(s) \quad \forall s \in \mathcal S$

Optimal policies also share the same optimal quality function: 

$q^*(s,a) = \max \limits_{\pi} q_\pi(s,a) \quad \forall s,a \in \mathcal {S, A(s)}$

> This function gives the expected return for taking action $a$ in state $s$ and thereafter following an optimal policy. Thus, we can write $q^*$ in terms of $v^*$:

$q^*(s,a) = \mathbb E [R_{t+1} + \gamma v^*(S_{t+1} | S_t =a, A_t =a)]$.

> Because $v^*$ is the value function for a policy, it must satisfy the self-consistency condition given by the Bellman equation for state values. The _Bellman optimality equation_ expresses the fact that the vlaue of a state under an optimal policy must equal the expected return for the best action from that state:

$$
\begin{aligned}
    v^*(s) &= \max \limits_{a \in \mathcal{A(s)}} \mathbb{E}_{\pi^*} [ G_t | S_t = s, A_t = a] \\
    &= \max \limits_{a \in \mathcal{A(s)}} \mathbb{E}_{\pi^*} \Bigg[ \displaystyle\sum_{k=0}^\infty \gamma^k R_{t+k+1} \Bigg | St_t = s, A_t = a \Bigg] \\
    
    &= \max \limits_{a \in \mathcal{A(s)}} \mathbb{E}_{\pi^*} \Bigg[ R_{t+1} + \gamma  \displaystyle\sum_{k=0}^\infty \gamma^k R_{t+k+2} \Bigg | St_t = s, A_t = a \Bigg] \\
    
    &= \max \limits_{a} \mathbb{E} [R_{t+1} + \gamma v^*(S_{t+1}) | S_t = s, A_t = a] \\

    &= \max \limits_{a \in \mathcal{A(s)}} \displaystyle\sum_{s', r} p(s', r | s, a)[r + \gamma v^*(s')]

\end{aligned}
$$

Similarly, the Bellman optimality equation for $q^*$ is:

$$
\begin{aligned}
    q^*(s,a ) &= \mathbb E \Big[ R_{t+1} + \gamma \max \limits_{a'} q^*(S_{t+1}, a') \Big | S_t=s, A_t = a \Big] \\
    &= \displaystyle\sum_{s', r} p(s', r |s, a)[r + \gamma \max \limits_{a'} q^*(s', a')].
\end{aligned}
$$

For finite MDPs, the Bellman optimality equation has a unique solution independent of policy. It can be expanded to a system of equations, one for each of the $N$ states, implying $N$ equations in $N$ unknowns.

## <a name="ch3.9" class="n"></a> 3.9 Optimality and Approximation

The fact of the matter is that an agent rarely learns the optimal policy, only at the expense of extreme computation cost.  

> even if we have a complete and accurate model of the environment’s dynamics, it is usually not possible to simply compute an optimal policy by solving the Bellman optimality equation. E.g. Chess where an agent's information is perfect and complete, but the computation cost for look ahead past a few time steps is far too large. Memory is also a constraint when building up approximations of value functions, policies, and models..

> However, it also presents us with some unique opportunities for achieving useful approximations. For example, in approximating optimal behavior, there may be many states that the agent faces with such a low probability that selecting suboptimal actions for them has little impact on the amount of reward the agent receives.

## <a name="ch3.10" class="n"></a> 3.10 Summary

The RL agent and its environment interact over a sequence of discrete time steps, via actions taken in states, earning rewards.

A policy is a stochastic rule by which the agent selects actions as a function of states geared towards maximizing rewards over time.

The return is the function of future rewards that the agent seeks to maximize. Undiscounted formulation is approprieate for episodic tasks, otherwise –in continuing taksks–, it is necessary for convergence.

An environment satisfies the Markov property if the state signal summarizes the past with the ability to predict the future.  

A policy's value functions assign to each state, or state-action pair, the expected return from that state or state-action pair under the given policy. Optimal value functions assign to each state or state-action pair the largest expected return achievable under the policy.

# <a name="ch4" class="n"></a> Chapter 4: Dynamic Programming

> Dynamic Programming (DP) referese to a collection of algorithms that can be used to compute optimal policies given a perfect model of the environment as an MDP. Classical DP algorithms are limited in their utility due to their assumption of perfect models and therefore computational expense, but they still offer theoretical value.

Assume the environment is a finite MDP, that state, action, and reward sets are finite and defined by $p(s', r |s, a) \quad \forall s, a, r, s' \in \mathcal{S, A(s), R, S^+}$

The key idea of DP is to use value functions to organize and structure the search for good, optimal policies. As mentioned in chapter 3, optimal policies can be easily attained once either $v^*, q^*$ are known: 

$$
\begin{aligned}
    v^*(s) &= \max \limits_{a} \mathbb{E} [R_{t+1} + \gamma v^*(S_{t+1}) | S_t = s, A_t = a] \\
    &= \max \limits_{a} \displaystyle\sum_{s', r} p(s', r | s, a)[r + \gamma v^*(s')] \\
\end{aligned}
$$

or

$$
\begin{aligned}
    q^*(s,a ) &= \mathbb E \Big[ R_{t+1} + \gamma \max \limits_{a'} q^*(S_{t+1}, a') \Big | S_t=s, A_t = a \Big] \\
    &= \displaystyle\sum_{s', r} p(s', r |s, a)[r + \gamma \max \limits_{a'} q^*(s', a')].
\end{aligned}
$$

## <a name="ch4.1" class="n"></a> 4.1 Policy Evaluation

First, in order to compute the state-value function $v_\pi$ for and arbitrary policy, we refere to the _prediction_ problem mentioned in chapter 3, $\forall s \in \mathcal S$:

$$
\begin{aligned}
    v_\pi(s) &= \mathbb{E}_\pi [R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + ... | S_t = s] \\
    &= \mathbb{E}_\pi [R_{t+1} + \gamma v_\pi(S_{t+1}) | S_t = s] \\
    &= \displaystyle\sum_{a} \pi(a | s) \displaystyle\sum_{s', r} p(s', r |s, a)[r + \gamma v_\pi (s')]
\end{aligned}
$$

Where the existence of $v_\pi$ is guaranteed by either $\gamma < 1$ or the eventual termination in all states under $\pi$.

> Full _back ups_ involve subsituting thhe value of every state once to produce the new approximate value function $v_{k+1}$. All backs up done in DP algorithms are called _full_ backups because they are based on all possible next states rather than on a sample next stated.

$$
\boxed{
\begin{aligned}
    &\text{Input π, the policy to be evaluated} \\
    &\text{Initialize an array } V(s) = 0, \forall s \in \mathcal S^+ \\
    &\text{Repeat} \\ 
        &\qquad \Delta \leftarrow 0\\ 
        &\qquad \text{For each } s \in \mathcal S: \\ 
            &\qquad \quad V(s) \leftarrow \textstyle\sum_a \pi (a | s) p(s', r |s, a) [r + \gamma V(s')] \\ 
            &\qquad \quad \Delta \leftarrow \max (\Delta, | v - V(s) |) \\
    &\text{until } \Delta < \theta \text{ (some small positive number)} \\
    &\text{Output } V \approx v_\pi 
\end{aligned}}
$$

Even with equiprobable random actions for a policy, iterative evaluation can converge to an optimal policy after few in-line iterations, provided a sufficiently small action space.

## <a name="ch4.2" class="n"></a> 4.2 Policy Improvement

> Suppose we have determined the value function vπ for an arbitrary deterministic policy $\pi$. For some state s we would like to know whether or not we should change the policy to deterministically choose an action $a \neq \pi(s)$. We know how good it is to follow the current policy from $s$ —that is $v_\pi(s)$ —but would it be better or worse to change to the new policy? One way to answer this question is to consider selecting a in s and thereafter following the existing policy, $π$. The value of this way of behaving is

$$
\begin{aligned}
    q_\pi(s,a) &= \mathbb E_\pi [ R_{t+1} +\gamma v_\pi(s_{t+1}) | S_t =a, A_t = a] \\ 
    &= \displaystyle\sum_{s', r} p(s',r |s, a)[r +\gamma v_\pi (s')]
\end{aligned}
$$

Here, if $q_\pi(s,a) > v_\pi(s)$, then it is better to select $a$ once in $s$ and thereafter follow $\pi$ than it would be to follow $\pi$ all the time, and therefore one would expect it to be better still to select $a$ _every time_ $s$ is encountereted, and that this should be the new policy as it's better overall.

This is true in the spcial case of a general result called the _policy improvement theorem_.  Let $\pi, \pi'$ be and pair of deterministic policies such that $\forall s \in \mathcal S$: $q_\pi(s, \pi'(s)) \geq v_\pi(s)$.  Then, the policy $\pi'$ must be as good as or better than $\pi$.  That is, it must obtain greater or equal expected return from all states.

> given a policy and its value function, we can easilyevaluate a change in the policy at a single state to a particular action. It is a natural extension to consider changes at _all_ states and to _all_ possible actions, selecting at each state the action that appears best according to $q_\pi(s, a)$. In other words, to consider the new greedy policy, $\pi'$ , given by

$$
\begin{aligned}
    \pi'(s) &= \argmax \limits_a q_\pi(s,a) \\
    &= \argmax \limits_a \mathbb E [R_{t+1} \gamma v_\pi(S_{t+1}) | S_t = s, A_t = a ]\\
    &= \argmax \limits_a \displaystyle\sum_{s', r} p(s', r |s, a) [r + \gamma v_\pi(s')]
\end{aligned}
$$

> Here, the greedy policy takes the action that looks best in the short term –after one step of lookahead– according to $v_\pi$.  By construction, the greedy policy meets the conditions of the policy improvement theorem, so we know that it's as good or better than the original policy.   The process of making a new policy that improves on an original polcy, by making it greedy w.r.t. the value function of an original policy is called _policy improvement_.

if $v_\pi = v_{\pi'}$ then the above theorem is the same as the Bellman optimality equation and so both policies must be optimal.

## <a name="ch4.3" class="n"></a> 4.3 Policy Iteration

> Once a policy $\pi$ has been improved using $v_\pi$ to yield a better policy $\pi'$, we can the compute $v_{\pi'}$ and improve it again to yield an even better $\pi''$.  Thus we can monotonically improve policies and value functions: 

$\pi_0 \xrightarrow{\text E} v_{\pi_0} \xrightarrow{ \text I} \pi_1
\xrightarrow{\text E} v_{\pi_1} \xrightarrow{ \text I} \pi_2 
\xrightarrow{\text E} ... \xrightarrow{ \text I} \pi^* \xrightarrow{\text E} v^*$

where $\xrightarrow{\text {E,I}}$ denote evaluation and improvement, respectively and each policy is guaranteed to be a strict improvement over the previous one.

So now, the general algorithm for policy iteration is:

$$
\boxed{
\begin{aligned}
    &\text{1. Initialization} \\
    &\quad V(s) \in \R  \\

    &\text{2. Policy Evaluation} \\
    &\quad \text {Repeat} \\  
        &\qquad \Delta \leftarrow 0\\ 
        &\qquad \text{For each } s \in \mathcal S: \\ 
            &\qquad \quad v \leftarrow V(s)\\
            &\qquad \quad V(s) \leftarrow \textstyle\sum_{a,r} p(s', r |s, \pi(s)) [r + \gamma V(s')] \\ 
            &\qquad \quad \Delta \leftarrow \max (\Delta, | v - V(s) |) \\
    &\quad \text{until } \Delta < \theta \text{ (some small positive number)} \\

&\text{3. Policy Improvement} \\
    &\quad policy\text{-}stable \leftarrow true \\
    &\quad \text {For each } s \in \mathcal S: \\  
        &\qquad a \leftarrow \pi(s) \\
        &\qquad \pi(s) \leftarrow \argmax_a \textstyle\sum_{s',r} p(s', r |s, a)[r + \gamma V(s')] \\
        &\qquad \text{If } a \neq \pi(s) \text{ then } policy\text{-}stable \leftarrow false \\
    &\quad \text{If } policy \text{-}stable, \text{ then stop and return } V, \pi \text{; else goto 2}\\

\end{aligned}}
$$

though it may never terminate if the policy continually switches between two or more equally good policies.  

## <a name="ch4.4" class="n"></a> 4.4 Value iteration

> One drawback to policy iteration is that each of its iterations involves policy evaluation, which may itself be a protracted iterative computation requiring multiple sweeps through the state set. If policy evaluation is done iteratively, then convergence exactly to $v_\pi$ occurs only in the limit.

Policy evaluation can be truncated prior after a few steps in most cases without losing the convergence guarantees of policy iteration. An important case is when the policy evaluation is stopped after just one sweep (one backup of each state).  This algorithm is called _value iteration_.

> Like policy evaluation, value iteration formally requires an infinite number of iterations to converge exactly to $v^∗$, though we tend to stop once the value function changes by only a small amount per sweep.

$$
\boxed{
\begin{aligned}
    &\text{Initialize array } V \text{ arbitrarily (e.g., } V(s) = 0, \forall s \in \mathcal S^+ )\\ 

    &\text{Repeat} \\
    &\quad \Delta \leftarrow 0 \\
    &\quad \text{For each } s\in \mathcal S : \\
        &\qquad v \leftarrow V(s) \\
        &\qquad V(s) \leftarrow \textstyle\max_a\sum_{s', r} p(s', r | s, a) [r + \gamma V(s')] \\ 
        &\qquad \Delta \leftarrow \max(\Delta, |v - V(s|) \\

    &\text{until } \Delta < \theta \text{ some small positive number} \\

    &\text{Output a deterministic policy } \pi, \text{ such that } \\
    &\quad\pi(s) = \textstyle\arg\max_a\sum_{s',r} p(s', r |s, a) [r + \gamma V(s')]
\end{aligned}}
$$

## <a name="ch4.5" class="n"></a> 4.5 Asynchronous Dynamic Programming

Dyanamic Programming approaches discussed before are sometimes disadvantageous as they sweep the entirety of the state set. 

>If the state set is very large, then even a single sweep can be prohibitively expensive. 

Thus, we introduce _asynchronous_ DP algorithms which are in-place iterative, and organized independently of the terms of systematic sweeps of the state set.  They back up the values of states in any order whatsoever, using whatever values of ther states that happen to be available.  To conver correct, the async. algorithm must continue to backup the values of _all_ states.

Async backups do not necessarily imply less computation, but they do mean that an algoirthm doesn't need to get locked in a hopelessly long sweep before progress can be made in improving the policy.  

> We can try to take advantage of this flexibility by selecting the states to which we apply backups so as to improve the algorithm’s rate of progress. We can try to order the backups to let value information propagate from state to state in an efficient way. Some states may not need their values backed up as often as others. We might even try to skip backing up some states entirely if they are not relevant to optimal behavior.

## <a name="ch4.6" class="n"></a> 4.6 Generalized Policy Iteration

> Policy iteration consists of two simultaneous, interacting processes, one making the value function consistent with the current policy (policy evaluation), and the other making the policy greedy with respect to the current value function (policy improvement). 

These two processes alternate until _hopefully_ the processes update all states, convergin on the optimal value function and policy.

The term _generalized policy iteration_ (GPI) refers to this idea of interaction between evaluation and improvement.  If both evaluation and improvement stabilize, i.e. no longer produce changes, the the value function and optimal policy must be optimal.

> Thus, both processes stabilize only when a policy has been found that is greedy with respect to its own evaluation function. 

## <a name="ch4.7" class="n"></a> 4.7 Efficiency of Dynamic Programming

While DP may not be practical for very large programs, they're relatively efficient for solving MDPs. In the worst case, ignoring some technical details, DP methods take polynomial time to find an optimal policy.  If $m, n$ represent the states and actions, then a DP method is guaranteed to find an optimal policy in $m^n$ deterministic time.  

> On problems with large state spaces, _asynchronous_ DP methods are often preferred.

## <a name="ch4.8" class="n"></a> 4.8 Summary

_Policy evaluation_ and _policy improvement_ typically refer to the iterative computation of the value functions for a given policy and the improvement of that polucy given the value function of its prior self, respectively. 

Combined, these two terms yield _policy iteration_ and _value iteration_ refer to the two most popular DP methods which reliably computer optimal policies and value functions for finite MDPs, given complete knowledge of the MDP.

Class DP methods operate in sweeps through a state set, performing full backup operation on each state, updating the value of the state based on the values of all weighted possibibilities of the values of successor states.  These are related to Bellman equationsL there are four primary value funcitons ($v_\pi, v^*, q_\pi, q^*$) corresponding to four Bellman equations and their full backups.

Generalized Policy Iteration is the general idea of two interacting processes revolving around approximate polciies and value functions is that eahc process changes the basis for the other, overall workign towards a convergent, joint solution where eahc, consequently, is optimal.

Note that all DP methods update estimates of the values of states based on the estimates of the values of successor states, which is called bootstrapping.

# <a name="ch5" class="n"></a> Chapter 5: Monte Carlo Methods

Monte Carlo methods require only _experience_ composed of sample sequences of states, actions, and rewards from interaction with the environment. To ensure well-defined returns, we define Monte Carlo methods only for episodic tasks and only calculate value estimates and policies updates after episodes have terminated.

> Monte Carlo methods can thus be incremental in an episode-by-episode sense, but not in a step-by-step (online) sense... Here we use it specifically for methods based on averaging complete returns (as opposed to methods that learn from partial returns, considered in the next chapter).

Monte Carlo methods sample average _returns_ for state-action pairs like the bandit methods sampled average _rewards_ previously - the difference being each state represents a bandit problem _and_ are interrelated to one another. Thus, the problems aren onstationary.

To handle this nonstationary component of practical RL contexts, we adapt the General Policy Iteration techniques from CH 4 where we _computed_ value functions to _learning_ value functions from sample returns of an MDP.

> First we consider the prediction problem (the computation of $v_\pi$ and $q_\pi$ for a fixed arbitrary policy $\pi$) then policy improvement, and, finally, the control problem and its solution by GPI. Each of these ideas taken from DP is extended to the Monte Carlo case in which only sample experience is available

## <a name="ch5.1" class="n"></a> 5.1 Monte Carlo Prediction

> Recall that the value of a state is the expected return—expected cumulative future discounted reward—starting from that state. An obvious way to estimate it from experience, then, is simply to average the returns observed after visits to that state. As more returns are observed, the average should converge to the expected value.

The _first-visit_ to a state $s$ under a Monte Carlo method estimates $v_\pi(s)$, and the_every-visit_ Monte Carlo method averages returns from all states. 

### First Visit MC Method

$$
\boxed{
\begin{aligned}
    &\text{Initialize:} \\ 
        &\quad \pi \leftarrow \text{policy to be evaluated} \\
        &\quad V \leftarrow \text{an arbitrary state-value function} \\
        &\quad Returns(s) \leftarrow \text{an empty list, } \forall s \in \mathcal S \\
    &\text{Repeat forever:} \\
        &\quad \text{Generate an episode using } \pi \\
        &\quad \text{For each state } s \text{appearing in the episode:} \\
            &\qquad G \leftarrow \text{return following the first occurrence of } s \\
            &\qquad \text{Append } G \text{ to } Returns(s) \\
            &\qquad V(s) \leftarrow \text{average(} Returns(s) \text ) \\
\end{aligned}}
$$

Note that we use capital $V$ for the approximate value function as it becomes a random variable after initilization.

Both _first-_ and _every-visit_ MC methods converge to $v_\pi(s)$ as the number of visits to $s$ goes to infinity and each return is an independent, identically distributed estimate of $v_\pi(s)$ with infinite variance.Each averaged is an unbiased estimate with $\sigma_{error} = \frac {1}{\sqrt n}$, wehre $n$ is the number of returns averaged.  _Every-visit_ is more complicated, but its estimates also asymptotically converge to $v_\pi(s)$.

For the given example of blackjack, MC methods are superior to strict DP as DP methods require the distribution of next events (given by $p(s', r | s, a)$), and those are difficult to determine in agame of blackjack as defined in the example.

> An important fact about Monte Carlo methods is that the estimates for each state are independent. The estimate for one state does not build upon the estimate of any other state, as is the case in DP. In other words, Monte Carlo methods do not bootstrap as we defined it in the previous chapter... In particular, note that the computational expense of estimating the value of a single state is independent of the number of states. This can make Monte Carlo methods particularly attractive when one requires the value of only one or a subset of states. One can generate many sample episodes starting from the states of interest, averaging returns from only these states ignoring all others. This is a third advantage Monte Carlo methods can have over DP methods (after the ability to learn from actual experience and from simulated experience).

## <a name="ch5.2" class="n"></a> 5.2 Monte Carlo Estimation of Action Values

> If a model is not available, then it is particularly useful to estimate action values (the values of state–action pairs) rather than state values.

With a model, state values alone would be sufficient to determine an optimal policy by choosing the action that leads to the best combination of reward and $s'$. Without a model, state values alone are insufficient as you must explicitly estimate the value of each action order for the values to be useful in suggesting a policy.  

> Thus, one of our primary goals for Monte Carlo methods is to estimate $q^∗$. To achieve this, we first consider the policy evaluation problem for action values

Similarly, the evalutation problem for action values is to estimate $q_\pi(s,a)$: the expected return starting from $s$, taking action $a$, and following $\pi$ thereafter. We simply modify the MC method to handle state-action pairs rather than only the states. Just as before, these MC methods converge quadratically upon the expected values as the number of visits to all state-action pairs approaches infinity.

Difficulties arise as many state-action pairs may never be visited.  If $\pi$ is deterministic, then following it will observe returns only for _one_ of the actions from each state. The no returns from the missing actions, the MC estimates of those will not improve with experience.  This hinders the intentional ability to compare estimated values of all actions from each state. 

This is similar to the exploration/exploitation problem insofar as we have to maintain exploration and can be resolved by specifying that episodes _start in a state-action pair_, and that each pair has a nonzero probability of being selected as the start.  This ensures that all state-action pairs will be visited ad infinitum eventually - this is called the assumption of _exploring starts_.

## <a name="ch5.3" class="n"></a> 5.3 Monte Carlo Control

MC Control refers to using MC estimation to approximate optimal policies. 

> The value function is repeatedly altered to more closely approximate the value function for the current policy, and the policy is repeatedly improved with respect to the current value function:

![](/images/ml-4-1.png)

While each of these improvement and evaluation arcs work against one another by creating moving targets, they effectively force the policy and value function to approach optimality.

Again, we'll use the diagram:

$\pi_0 \xrightarrow{\text E} q_{\pi_0} \xrightarrow{ \text I} \pi_1
\xrightarrow{\text E} q_{\pi_1} \xrightarrow{ \text I} \pi_2 
\xrightarrow{\text E} ... \xrightarrow{ \text I} \pi^* \xrightarrow{\text E} q^*$

to understand the process. Under the assumptions of infinite episodes generated with exploring starts, MC methods _will_ compute each $q_{\pi_k}$ for arbitrary $\pi_k$.

Policy improvement is achieved by making the policy greedy w.r.t the current value function. For any action-value function $q$, the corresponding greedy poly is the one that deterministically chooses an action the the maximal action-value:

$\pi(s) = \argmax_a q(s, a),\quad \forall s \in \mathcal S$

The corresponding policy improvement can be achieved by constructing each $\pi_{k+1}$ as the greedy policy w.r.t. $q_{\pi_k}$.  Using the policy improvement theorem from CH 4.2:

$$
\begin{aligned}
    q_{\pi_k}(s, \pi_{k+1}(s)) &= q_{\pi_k}(s, \argmax_a q_{\pi_k}(s,a)) \\
    &= \max_a q_{\pi_k}(s, a) \\
    &\geq q_{\pi_k}(s, q_{\pi_k}(s)) \\
    &= v_{\pi_k}(s)
\end{aligned}
$$

As discussed in Chapter 4, this theorem ensures that each $\pi_{k+1}$ is uniformly as good, if not better than $\pi_{k}$: they will both be optimal policies.

This theorem holds so long as the shaky assumptions of exploratory starts and policy evaluation performed over infinite episodes hold...

> To obtain a practical algorithm we will have to remove both assumptions.

woot. Let's deal with the first assumption which is relatively easy to remove (can't wait to fix the 2nd assumption). There are two possible solutions: hold firm the idea of approximating $q_{\pi_k}$ in each policy evaluation, and the other is to forgo complete policy evaluation before returning to improvement. 

For MC policy evaluation, it is common to episodically alternate between evaluation and improvement: after each episode, the observed returns are used for policy evaluation, and then the policy is improved at all the states visited in the episode:

$$
\boxed{
\begin{aligned}
    &\text{Initialize, } \forall s \in \mathcal S, a \in \mathcal A(s): \\ 
        &\quad Q(s,a) \leftarrow arbitrary \\
        &\quad \pi(s) \leftarrow arbitrary \\
        &\quad Returns(s,a) \leftarrow \text{empty list} \\
    &\text{Repeat forever:} \\
        &\quad \text{Choose } S_0 \in \mathcal S \text{ and } A_0 \in \mathcal A(S_0) \text{s.t. all pairs have probability} \geq 0 \\
        &\quad \text{Generate an episode starting from } S_0, A_0, \text{following }\pi \\
        &\quad \text{For each pair } s,a \text{ appearing in the episode:} \\
            &\qquad G \leftarrow \text{return following the first occurrence of } s,a \\
            &\qquad \text{Append } G \text{ to } Returns(s,a) \\
            &\qquad Q(s,a) \leftarrow \text{ average}(Returns(s,a)) \\
        &\quad \text{For each } s \text{ in the episode:} \\
            &\qquad \pi(s) \leftarrow \textstyle\argmax_a Q(s,a)
\end{aligned}}
$$

Under an explatory start, all returns for each state-action pair are accumulated and averaged, regardless of what policy they were earned under. This implies that an MS ES cannot converge to any sub-optimal policy, otherwise the value function would eventually converge to the value function for that bad policy, forcing a change in the policy.

> Convergence to this optimal fixed point seems inevitable as the changes to the action-value function decrease over time, but has not yet been formally proved.

## <a name="ch5.4" class="n"></a> 5.4 Monte Carlo Control Without Exploring Starts

The two general approaches to avoid the unlikely assumption of exploring starts is –to ensure that all actions are selected inifnitely often– are called _on-policy_ and _off-policy_ methods.

> Onpolicy methods attempt to evaluate or improve the policy that is used to make decisions, whereas off-policy methods evaluate or improve a policy different from that used to generate the data.

In on-policy control methods, the policy is _soft_, meaning that $\pi(a | s) > 0, \quad \forall s,a \in \mathcal S, \mathcal A(s)$, but gradually shifted closer to a determinisitc optimal policy. We can use ε-greedy, or ε-_soft_ exploration to achieve this. 

> The overall idea of on-policy Monte Carlo control is still that of GPI. As in Monte Carlo ES, we use first-visit MC methods to estimate the action-value function for the current policy.

However, we modify the approach the approach so that the policy is ε-greedy as we do not have the benefit of ES and still need to ensure exploration. GPI does not require that a policy be taken all the way to a greedy policy, just that it moves _toward_ a greedy policy. 

> For any ε-soft policy, $\pi$, any ε-greedy policy with respect to $q_π$ is guaranteed to be better than or equal to $\pi$.

This is ensured by the policy improvement theorem:

$$
\begin{aligned}
    q_\pi(s, \pi'(s)) &= \sum_a \pi'(a | s) q_\pi(s, a) \\
    &= \frac {\epsilon}{|\mathcal A(s) |} \sum_a  q_\pi(s, a) + (1 - \epsilon) \max_a q_\pi(s, a) \\
    &\geq \frac {\epsilon}{|\mathcal A(s) |} \sum_a  q_\pi(s, a) + (1 - \epsilon) \sum_a \frac{\pi(a | s) - \frac{\epsilon}{ | \mathcal A(s) |}}{1 - \epsilon} q_\pi(s,a) \\
    &= \frac {\epsilon}{|\mathcal A(s)|} \sum_a q_\pi(s,a) - \frac {\epsilon}{|\mathcal A(s)|} \sum_a q_\pi(s,a) + \sum_a \pi(a | s) q_\pi(s,a) \\ 
    &= v_\pi(s)
\end{aligned}
$$

> We now prove that equality can hold only when both $\pi'$ and $\pi$ are optimal among the ε-soft policies, that is, when they are better than or equal to all other ε-soft policies.

> Consider a new environment that is just like the original environment, except with the requirement that policies be ε-soft “moved inside” the environment. The new environment has the same action and state set as the original and behaves as follows. If in state s and taking action a, then with probability $1 − ε$ the new environment behaves exactly like the old environment. With probability $ε$ it repicks the action at random, with equal probabilities, and then behaves like the old environment with the new, random action. The best one can do in this new environment with general policies is the same as the best one could do in the original environment with ε-soft policies. Let $\widetilde{v}^*$ and $\widetilde{q}^*$ denote the optimal value functions for the new environment. Then a policy $π$ is optimal among ε-soft policies if and only if $v_π = \widetilde{v}^*$. From the definitionof $\widetilde{v}^*$ we know that it is the unique solution to

$$
\begin{aligned}
    \widetilde{v}^*(s) &= (1 - \varepsilon) \max_a  \widetilde{q}^*(s, a) + \frac{\epsilon}{|\mathcal A(s)|}\sum_a q_\pi(s,a) \\

    &= (1 - \varepsilon) \max_a  \sum_{a', r} p(s', r | s, a) \big [ r + \gamma v_\pi(s') \big ] \\
    &\qquad \qquad + \frac{\epsilon}{|\mathcal A (s)|} \sum_a\sum_{s', r} p(s', r | s, a) \big [ r + \gamma v_\pi(s') \big]
\end{aligned}
$$

Which is identical to the above equation with $v_\pi$ substituted for $\widetilde{v}^*(s)$; since $\widetilde{v}^*(s)$ is the unique solution, it must be that $v_\pi = \widetilde{v}^*(s)$. 

In sum, this shows that policy improvement works for ε-soft policies.
>  This analysis is independent of how the action-value functions are determined at each stage, but it does assume that they are computed exactly.

The full algorithm for an ε-soft soft policy is given by: 

$$
\boxed{
\begin{aligned}
    &\text{Initialize, } \forall s \in \mathcal S, a \in \mathcal A(s): \\ 
        &\quad Q(s,a) \leftarrow \text{arbitrary} \\
        &\quad Returns(s,a) \leftarrow \text{empty list} \\
        &\quad \pi( a | s) \leftarrow \text{empty list} \\
    &\text{Repeat forever:} \\
        &\quad \text{(a) Generate an epsidoe using } \pi \\
        &\quad \text{(b) For each pair } s,a \text{ appearing in the episode:} \\
            &\qquad G \leftarrow \text{return following the first occurrence of } s,a \\ 
            &\qquad \text{Append } G \text{ to } Returns(s,a) \\
            &\qquad Q(s,a) \leftarrow \text{average}(Returns(s,a)) \\
        &\quad \text{(c) For each pair } s \text{ in the episode:} \\
            &\qquad a^* \leftarrow \textstyle\argmax_a Q(s,a) \\
            &\qquad \text{For all } a \in \mathcal A(s): \\
            &\qquad \pi(a | s) \leftarrow \begin{cases} 1- \varepsilon  & \text{if } a = a^* \\ \varepsilon \over {\mathcal A(s)}  &\text{if } a \neq a^* \end{cases}
       
\end{aligned}}
$$


## <a name="ch5.5" class="n"></a> 5.5 Off-policy Prediction via Importance Sampling

> So far we have considered methods for estimating the value functions for a policy given an infinite supply of episodes generated using that policy. Suppose now that all we have are episodes generated from a _different_ policy.  That is, suppose we wish to estimate $v_\pi$ or $q_\pi$, but all we have are episode following another policy $\mu, \mu \neq \pi$.

Here, $\pi$ is the _target policy_ and $\mu$ is the _behavior policy_.  The goal and challenge of off-policy learning is learning about a policy given only episodic experience from no that policy.

In order to meaningfully learn from $\mu$, we must ensure that every action taken under $\pi$ is also taken, at least occaisionally, under $\mu$: $\pi \subset \mu$.  This is called the _assumption of coverage_: $\pi(a | s) > 0 \implies \mu(a | s) > 0$.  Thus $\mu$ must be stochasticin states where it is not identical to $\pi$, although the target $\pi$ can be deterministic.

Importance Sampling is the general technique used for estimating expected values under one distribution ($\pi$) given samples from another ($\mu$). Given a starting state $S_t$, the probability of the subsequent state-action trajectory, $A_t, S_{t+1}, A_{t+1}, ..., S_T$, occurring under any policy $\pi$ is:

$\displaystyle\prod_{k=t}^{T-1} \pi(A_k | S_k) p(S_{k+1} | S_k, A_k)$, where $p$ is the state-transition probability function.

Thus, the relative probability of the trajectory under the target and behavior policies (the Importance Sampling Ration) is:

$\rho^T_t = \frac{\displaystyle\prod_{k=t}^{T-1} \pi(A_k | S_k) p(S_{k+1} | S_k, A_k)}{\displaystyle\prod_{k=t}^{T-1} \mu(A_k | S_k) p(S_{k+1} | S_k, A_k)} = \displaystyle\prod_{k=t}^{T-1} \frac{\pi(A_k | S_k)}{\mu(A_k | S_k)}$

> Note that although the trajectory probabilities depend on the MDP’s transition probabilities, which are generally unknown, all the transition probabilities cancel and drop out. The importance sampling ratio ends up depending only on the two policies and not at all on the MDP.

When applying off-ploicy importance sampling to a MC method, it is convenient to number the time steps that increases across episode boundaries s.t. the first episode ends at $t = 100$ and the second begins at $t = 101$. We can define the set of all time steps in which $s$ is visited as $\mathcal T(s)$. e.g. for a first-visit method, $\mathcal T(s)$ would only include time steps that were first visits to $s$ in their episode.  We'll also let $T(t)$ by the first time of termination following $tG_t$ to denote the return after $t$ through $T(t)$.  Therefore, $\{G_t\}_{t \in \mathcal T(s)}$, $\{\rho_t^{T(t)}\}_{t \in \mathcal T(s)}$ are the returns pertaining to state $s$, and the corresponding importance-sampling ratios.  Using these to estimate $v_\pi(s)$, we and average the returns scaled by the ratios: 

$V(s) = \frac{\sum_{t \in \mathcal T(s)} \rho_t^{T(t)} G_t}{|\mathcal T(s)|}$ 

When performed as a simple average as above, this method is called _Ordinary_ Importance Sampling.  Alternatively, we can refine value and increase the speed of convergence towards an optimal policy by using a _Weighted_ Importance Sampling: 

$V(s) = \frac{\sum_{t \in \mathcal T(s)} \rho_t^{T(t)} G_t}{\sum_{t \in \mathcal T(s)} \rho_t^{T(t)}}$ 

(accounting for division by 0 making the whole term 0). 

> Formally, the difference between the two kinds of importance sampling is expressed in their variances. The variance of the ordinary importancesampling estimator is in general unbounded because the variance of the ratios is unbounded, whereas in the weighted estimator the largest weight on any single return is one.

We can verify that the variance of importance-sampling-scaled returns is infinite:

$$
\begin{aligned}
    \text{Var}[X] &= \mathbb E[X^2] - \bar X^2 \\
    &\models \mathbb E \Big[ \Big( \prod^{T-1}_{t=0} \frac{\pi(A_t | S_t)}{\mu(A_t | S_t)} G_0 \Big)^2 \Big] 
\end{aligned}
$$

Meaning our variance is only infinite if the expectation of the square of the random variable $X$ is infinite.

## <a name="ch5.6" class="n"></a> 5.6 Incremental Implementation

> Monte Carlo prediction methods can be implemented incrementally, on an episode-by-episode basis, using extensions of the techniques described in Chapter 2. Whereas in Chapter 2 we averaged rewards, in Monte Carlo methods we average returns. In all other respects exactly the same methods as used in Chapter 2 can be used for on-policy Monte Carlo methods. For off-policy Monte Carlo methods, we need to separately consider those that use ordinary importance sampling and those that use weighted importance sampling.

We only have to handle the case of off-policy methods using weighted importance sampling.  Suppose we have a sequence of returns $G_1, G_2, ..., G_{n-1}$, all starting from the same state with corresponding random weight $W_i = \rho^{T(t)_t}$. We want to estimate:

$V_n = \frac {\sum_{k=1}^{n-1} W_k G_k}{\sum_{k=1}^{n-1} W_k}, \qquad n \geq 2$

In order to maintain the cumulative sum $C_n$ of the weights given to the first $n$ returns for each state, the update rule for $v_n$:

$V_{n+1} = V_n + \frac{W_n}{C_n} [G_n - V_n], \qquad C_{n+1} = C_n + W_{n+1}, C_0 = 0, V_1 = \text{arbitrary}$


### Off-policy Monte Carlo Policy Evaluation

$$
\boxed{
\begin{aligned}
    &\text{Initialize, } \forall s,a \in \mathcal {S, A}(s): \\ 
       &\quad Q(s,a ) \leftarrow \text{arbitrary} \\ 
       &\quad C(s,a ) \leftarrow 0 \\ 
       &\quad \mu(s,a ) \leftarrow \text{an arbitrary soft behavior policy} \\ 
       &\quad \pi(s,a ) \leftarrow \text{an arbitrary target policy} \\ 
    &\text{Repeat forever:} \\
        &\quad \text{Generate an episode using } \mu :\\
            &\qquad S_0, A_0, R_1, ..., S_{T-1}, A_{T-1}, R_{T}, S_{T} \\ 
        &\quad G \leftarrow 0 \\
        &\quad W \leftarrow 1 \\
        &\quad \text{For } t= T-1, T-2, ..., 0:\\
            &\qquad G \leftarrow \gamma G + R_{t+1} \\ 
            &\qquad C(S_t, A_t) \leftarrow C(S_t, A_t) + W \\
            &\qquad Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \frac{W}{C(S_T, A_t)}[G - Q(S_t, A_t)] \\ 
            &\qquad W \leftarrow W \frac{\pi(A_t | S_t)}{\mu(A_t | S_t)} \\
            &\qquad \text{If } W=0 \text{ then ExitForLoop}
\end{aligned}}
$$

Note that this algorithm also work for on-policy evaluation by choosing the target and behavior policies to be the same.

## <a name="ch5.7" class="n"></a> 5.7 Off-Policy Monte Carlo Control

> Recall that the distinguishing feature of on-policy methods is that they estimate the value of a policy while using it for control. In off-policy methods these two functions are separated. The policy used to generate behavior, called the behavior policy, may in fact be unrelated to the policy that is evaluated and improved, called the target policy. An advantage of this separation is that the target policy may be deterministic (e.g., greedy), while the behavior policy can continue to sample all possible actions.

> Recall that these techniques requires that the behavior policy has a nonzero probability of selecting all actions that might be selected by the target policy under the assumption of _coverage_ and that we that in order to explore all possibilities, we require that the behavior policy be soft i.e. it selects all actions in all states with nonzero probability.

The following algorithm shows an off-policy Monte Carlo method, based on GPI and weighted importance sampling, for estimating $q^*$. The target policy $\pi$ is the greedy policy with respect to $Q$, which is an estimate of $q_\pi$. The behavior policy $\mu$ can be anything, but in order to assure convergence of $\pi$ to the optimal policy, an infinite number of returns must be obtained for each pair sof state and action. This can be assured by choosing $µ$ to be $ε$-soft.

### Off-policy Monte Carlo GPI with Weighted Importance Sampling to Estimate $q^*$

$$
\boxed{
\begin{aligned}
    &\text{Initialize, } \forall s,a \in \mathcal {S, A}(s): \\ 
       &\quad Q(s,a ) \leftarrow \text{arbitrary} \\ 
       &\quad C(s,a ) \leftarrow 0 \\ 
       &\quad \pi(s) \leftarrow \text{a deterministic policy that is greedy w.r.t. } Q \\ 
    &\text{Repeat forever:} \\
        &\quad \text{Generate an episode using any soft policy} \mu :\\
            &\qquad S_0, A_0, R_1, ..., S_{T-1}, A_{T-1}, R_{T}, S_{T} \\ 
        &\quad G \leftarrow 0 \\
        &\quad W \leftarrow 1 \\
        &\quad \text{For } t= T-1, T-2, ..., 0:\\
            &\qquad G \leftarrow \gamma G + R_{t+1} \\ 
            &\qquad C(S_t, A_t) \leftarrow C(S_t, A_t) + W \\
            &\qquad Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \frac{W}{C(S_T, A_t)}[G - Q(S_t, A_t)] \\ 
            &\qquad \pi(S_t) \leftarrow \argmax_a Q(S_t, a) \text{ w/ties broken arbitrarily}\\
            &\qquad W \leftarrow W \frac{1}{\mu(A_t | S_t)} \\
            &\qquad \text{If } W=0 \text{ then ExitForLoop}
\end{aligned}}
$$

However, this method only learns from the _tails_ of episodes, after learning the last nongreedy action, so if those are frequent, learning will be slow, especially for states at the beginning of long episodes.  This can be resolved with TD learning covered in the next chapter, or by ensuring that $\gamma < 1$

## <a name="ch5.8" class="n"></a> 5.8 Importance Sampling on Truncated Returns

In cases where discounted returns are 0 as $\gamma \rightarrow 0$, the ordinary importance sampling will be scalled by the _entire_ product, even if the last 99 factors are zero.  These 0 terms are irrelevant to the expected return of a policy, but enormously contribute to the variance (in some cases making it infinite). We can avoid this by thinking of discounting as determining a probability of termination, or a _degree_ of partial termination.  For any $\gamma \in [0, 1)$, we can think of the return $G_0$ as partly terminating in one step, to the degree $1 - \gamma$, producing a return of _just_ the first reward $R_1$; partly terminating after two steps to the degree $(1 - \gamma)\gamma$ yielding return of $R_1 + R_2$; so on. The partial Each $\gamma^n$ refers to the termination not occurring in any of the prior $n-1$ steps.  The partial returns here are called _flat partial returns:_

$\bar G_t^h = R_{t+1} + R_{t+2} + ... + R_{h}, \qquad 0 \leq t < h \leq T, $

> where "flat" denotes the absence of discounting, and "partial" denotes that these returns do not extend all the way to termination, but instead stop at the horizon $h$. The conventional full return $G_t$ can be viewed as a sum of flat partial returns assuggested above as follows:

$$
\begin{aligned}
    G_t &= R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + ... + \gamma^{T-t-1} R_{h} \\ 
    &= (1 - \gamma) R_{t+1} \\
    &\quad + (1 - \gamma)\gamma (R_{t+1} + R_{t+2}) \\
    &\quad \text{ } \vdots \\
    &\quad + (1 - \gamma)\gamma^{T-t-2} (R_{t+1} + R_{t+2} + ... + R_{T-1}) \\
    &\quad + \gamma^{T-t-1} (R_{t+1} + R_{t+2} + ... + R_{T}) \\
    &= \gamma^{T-t-1} \bar G^T_t + (1 - \gamma) \displaystyle\sum^{T-1}_{h = t + 1} \gamma^{h-t-1} \bar G^h_t 
\end{aligned}
$$

In order to scale the flat partial returns by an importance sampling ratio that is also truncated, we define ordinary and weighted importance-sampling estimator analogous to those presented in 5.4, 5.5: 

$V(s) = \frac{\sum_{t\in\mathcal T(s)} \Big(\gamma^{T(t) - t - 1} \rho_t^{T(t)} \bar G_t^{T{t}} + (1 - \gamma) \sum^{T(t)-1}_{h=t+1} \rho_t^{h} \bar G_t^{h} \Big)}{|\mathcal T(s)|}, \qquad \qquad ordinary$ 

$V(s) = \frac{\sum_{t\in\mathcal T(s)} \Big(\gamma^{T(t) - t - 1} \rho_t^{T(t)} + (1 - \gamma) \sum^{T(t)-1}_{h=t+1} \rho_t^{h} \bar G_t^{h} \Big)}{\sum_{t\in\mathcal T(s)} \Big(\gamma^{T(t) - t - 1} \rho_t^{T(t)} + (1 - \gamma) \sum^{T(t)-1}_{h=t+1} \rho_t^{h} \Big)}, \qquad \qquad weighted$ 

## <a name="ch5.9" class="n"></a> 5.9 Summary

MC methods presented in this chapter learn optimal value functions and policies from episodic experience sampling.  This gives (at least) 3 advantages over DP methods:

1. They can learn optimal behavior directly from interaction with the environment without a model of environment dynamics,

2. The can be used with simulation or sample models without explicit models of transition dynamics required by DP methods,

3. MC methods can _focus_ on small subsets of states to learn regions of special interest.

MC methods follow a similar GPI process presented in Chapter 4, with the difference being avaluation of returns from a start state rather than computing values for each state from a model. MC methos focus on state-action values rather than state values alone, intermixing evaluation and improvement steps. 

The issue of maintaining sufficient exploration is resolved by assuming that episodes begin with state-action pairs randomly selected over all possibilities.  

On-policy methods commit to exploring and trying to find the best policy that still explores, whereas off-policy methods learn a deterministic optimal policy that may be unrelated to the policy being followed.  Off-policy prediction refers to learning the value of a target policy from data generated by a distinct behavior policy based on importance sampling.

- Ordinary importance sampling uses a simple average of weighted returns, and produces unbiased estimates but runs the risk of larger, potentiall infinit, variance, 

- Weighted importance sampling uses a weighted average and ensures finite variance (it's typically better).

# <a name="ch6" class="n"></a> Chapter 6 Temporal-Difference Learning


