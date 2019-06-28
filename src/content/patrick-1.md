---
title: "Reinforcement-Learning: Feeling Big Brain All the Time"
date: "2019-06-28"
draft: false
path: "/blog/patrick-1"
author: "Bob Saget, Sergey Levine."
---

Hi there. If you are reading this, it's probably because you are interested in also becoming a big brain.
Or you are Braden looking to make yourself look even more big brain. In either case, welcome. Reinforcement Learning
is a super cool but also super complicated field within machine learning. Sutton and Barto define it as:

>"Reinforcement learning is learning what to do—how to map situations to actions—so as to maximize a numerical reward signal. The learner is not told which actions to take, but instead must discover which actions yield the most reward by trying them. In the most interesting and challenging cases, actions may affect not only the immediate
reward but also the next situation and, through that, all subsequent rewards. These two characteristics: trial-and-error search and delayed reward, are the two most important distinguishing features of reinforcement learning."

Basically, you've decided to take all the hard parts of machine learning, such as teaching a computer to learn, and made it *much, much, much* harder by not giving it any examples to begin with. You're doing the mathematical equivalent of the Spartan practice of leaving babies to die on the cliff and expecting it to learn to do complex things like play Atari games or predict MRI scans.

Luckily, math is on your side. With the power of gradients and expectations, you can actually approach an optimal solution in a reasonable amount of time in a number of ways. There are countless variations on these core algorithms that make them train faster and become more efficient at using examples. But before we jump into that, we need to introduce some terminology.

### Terms to Know

-  Environment: World that the agent lives in, contains all the information that exists to the agent. May change both independently of the agent and based on the action of the agent.
-  Agent: What observes the environment and takes an action based on that observation. Also receives a "reward" signal from the environment sometimes when it performs an action
-  State (**_s_**): Complete description of the state of the world, sometimes also used to refer what the agent *can* see in the environment (really the observation). Depending on the environment, the state can be *fully observable* or *partially obserable*
-  Action/Action Space (**_a_**): The range of actions which an agent can take within an environment. The two types of action spaces are _discrete_, where there are a finite number of actions to choose from, or _continuous_, where there as an infinite number of possible actions to take. A discrete space would be something like an Atari game, while a continuous space would involve something like adjustable torque.
-  Policy: The function or rules by which an actor chooses and action _a_ based on the state. It is usually represented by $\pi$(_s_) for stochastic policies or $\mu$(_s_) for deterministic policies.
 >"In deterministic models, the output of the model is fully determined by the parameter values and the initial conditions. Stochastic models possess some inherent randomness." (from the interwebs)

- Reward: What is given from the state to the agent at some time, possibly due to an action that the agent took
- Return: The cumulative rewards over all of the states $\mathcal{S}$ in an episode, which are often discounted by a factor $\gamma$

-  Trajectory: A sequence $\mathcal{T}$ of some length of the states $\mathcal{S}$ and actions $\mathcal{A}$ of the environment as it progresses through time or by frame. Otherwise known as episodes or rollouts.

For a more verbose glossary of terms and functions, visit Peter's [Terrible Turing Machines - 07](https://murphypone.github.io/intern-blog/blog/peter-7), where he has an extensive list of terms and crap you need to know to feel big brain. (Even if you aren't really)


**Now that you have some knowledge of the basic terminology of RL, we are going to crack open the black box and see how this magical subject works.**

The basic goal of reinforcement learning is to teach an agent a policy ($\pi$ or $\mu$) that is able to make the best decision given a set of circumstances. This policy attempts to maximize some reward for its actions that are given by the state. However, this policy does not need to be explicitly discovered or defined by the program. One of the earliest and most basic Deep RL algorithms instead uses a value function $v_\pi(s)$ to predict the expected future reward or "goodness" of each state or each state-action pair. In deep RL, this value function is not an actual function, but is actually a neural network that will approximate values like a function. It takes a variety of forms, but at its most basic it is commonly designated as the expected return for the policy from $\mathcal{S}$:
$$
\begin{gathered}v_\pi(s) = \mathbb{E}[R_t|s_t = s]\end{gathered}
$$
Its complement is the the action value function, which is denoted as $q_\pi(s,a)$. This defines the expected value of the state action pair. Why it's Q I have no fucking clue.
$$
\begin{gathered}q_\pi(s,a) = \mathbb{E}[R_t|s_t = s, a_t = a]\end{gathered}
$$
The goal of both of these formulas is to do something super simple: find the optimal policy $\pi^o$ that will maximize $v_\pi(s)$

$$
\begin{gathered}q_\pi(s,a) = \mathbb{E}[R_t|s_t = s, a_t = a]\end{gathered}
$$


Some may say I'm a dreamer, but I'm not the only one.
