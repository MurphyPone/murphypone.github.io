---
title: "ML 2: A Discussion of Action Spaces"
date: "2019-06-27"
description: "RL"
path: "/blog/ml-2"
---

| $\color{blue} \text {Discrete}$ | $\color{red} \text {Continuous}$ |
|----------|------------|
| finite number of actions which can be taken | infinite amount of actions which can be taken |
| e.g. $\color{blue} \text{Left}$ or $\color{blue} \text{Right}$ | e.g. $\color{red} \text{Amount of torque}$ to apply to a wheel |
| easier to conceptualize and evaluate as the action set is finite and therefore iterable | Action space can be differentiated which is advantageous because this allows us to identify similarities between actions |
| can not be differentiated, therefore actions like $\color{blue} \text {North, South}$ may be *both* adjacent and highly dissimilar  | e.g. $\color{red} \frac d {da_{n}} = 1.02, \frac d {da_{n+1}} = 1.03,  $ <br> can be grouped by trend |
| $\color{blue} \pi^{*}$ is easier to find, as there is an exhaustible set of actions and policies to be evaluated | continuous action-spaces are superior because, theoretically, $\exist$ andaction $\color{red} a \in \mathcal A$ which immediately solves the given problem.  While stipulation that *most* $\color{red} a \in \mathcal A$ will be so downright wank that you'll want to terminate the simulation, the infinite size of $\color{red} \mathcal A$ dictates that $\color{red} \exist \space a \leftarrow  \pi^{*} >> \color{blue} \pi^{*}$|
| we can compensate for the limitations of the discrete action space by identifying the region about the global maximum at any time $\color{red}t$ of $\color{red}\pi^{*}$ and discretizing it via some function gamma –s.t. $\color{orange} \gamma(x) = \beta\lfloor x \rfloor $ where $\beta$ is some factor that creates a distribution of actions rather than a set of identical actions - such that we end up with a dense action space $\mathcal \color{blue} A$ each member of which is better, on average, than a random $\color{red} a \in \mathcal A$ <br>see Fig. 1| ![bhoags-bignscary](https://i.imgur.com/BiJlJjv.jpg) |


This solution, however eloquent, is also constrained by $\infin$ because no matter how "global" a theoretical maximum $\color{blue} \pi^{*}$, $\color{blue} \exist \space  \pi^{*}+n$.  We can resolve this caveat and potential resource leak (forever searching for a global maximum in an infinite space) by defining a $\color{orange} \text {global maximum satisfaction rate } \omega$ such that the system is satisfied if a global maximum $\color{blue} \pi^{*} + \color{orange} \omega$ has not been found in an arbitrary $t + n$ time steps.


![Figure 1](https://i.imgur.com/wLYA0qY.png)
<center><i>Figure 1 - discretizing a "Global Maximum"</i></center>
