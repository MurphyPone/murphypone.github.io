---
title: "Digest: Occam's Razor"
date: "2020-10-14"
description: "Daniel's Knowledge, ~simplicity~"
path: "/blog/occcam-and-his-razor"
---

## Preface

This article aims to qualitatively describe the notation from Kevin Kelly's paper on ["Simplicity and Truth Conduciveness"](https://www.researchgate.net/publication/228694541_Simplicity_and_Truth_Conduciveness) which offers painful perversions of standard set notation. The paper itself strives to provide a formal proof of the validity of Occam's Razor which Wikipedia defines to be: 

> "the simplest explanation is most likely the right one".

in light of the of the claim that 

> The standard literature on Ockam's razor contains no plausible, non-circular, explanation of how simplicity helps science to arrive at true theories.

Kelly asks, then, "how _could_ Ockham's razor help one find true theory?"

## Formal Definitions of Simplicity

When striving to define the "simplest" explanation of a claim, we start with the benchmarks of 

- [Solomonoff Induction](https://en.wikipedia.org/wiki/Solomonoff%27s_theory_of_inductive_inference) - which I won't pretend to know enough about to make menaingful sense.

and 

- [Kolmogorov Complexity](https://en.wikipedia.org/wiki/Kolmogorov_complexity) - which can be thought of as the optimal encoding of a piece of information, or the lower bound of the length of program needed to recreate some input, roughly speaking. 

For example, the kolmogorov complexity of a _simple_ string like `aaaaaaaaaaaaaaaaaaaaaaaaaa` (26 'a's) could be expressed in fewer characters as: 

```python
a = 'a' * 26
```

which isn't necessarily the _smallest_ program used to expressed the input string, but it's closer.


Though not entirely relvant to the discussion, the formal definition of Kolmogorov complexity is given in terms of Turing machines, so you know I had to include it:

> Kolmogorov complexity $K$ of a string, relative to a Turing machine $f$ of a string $x$ is :
> $$\\ K_f(x) = \min \{|p| : f(p) = x\}$$

Another fun example of Kolmogorov complexity is given by the [Berry paradox](https://en.wikipedia.org/wiki/Berry_paradox) which claims that the complexity of all positive integers in English is at most 11.  If it were not true, then there would be an integer that could not be described in fewer than 11 words.  Punchline: any such number could be described as "The smallest positive integer not definable in under eleven words." 

Kelly asks, "what's the fastest way to reach a true theory?" and answers, in far more words, that the theory with the fewest retractions –given new data– is the simplest. 

### A Side Note on the Problem of Induction 

In real world applications, induction is limited  the fact that we want to derive general principles given only immediate specifics.  We can _never_ know that our inductive hypotheses is true, let alone absolute truth, but we can gain or lose confidence in it with each opportunity to be wrong and _hopefully_ know that our hypothesis is not wrong.  

Fundementally, that's all science is: not being wrong lots of times.

Amongst other things, Kelly adds in his supplemental [conference slides](http://www.fitelson.org/few/few_05/kelly_2.pdf) that the if you know that "future" is simple, you can drop the heurisitc and skip straight to a solid principle.  However, the future is typically complex, hence the need for a formal means of reaching the simplest hypothesis to describe truth.

## Notation

If you were looking on a refresher to Set Theory, Kelly does _not_ have your back.  Luckily, Daniel does.

![](https://imgs.xkcd.com/comics/mathematical_symbol_fight_2x.png)


Let $E$ be the set of all effects that might be realized: 

$$
\begin{aligned}
E = \{e_1, e_2, e_3, e_4, e_5, e_6, e_7, e_8, e_9\}
\end{aligned}
$$

Let $K$ be the set of all sets of effects that might be a complete description of the ⭐_world_ ⭐: 

$$
\begin{aligned}
K = \Big\{\{e_1\}, \{e_1, e_2\}, \{e_1, e_2\}, ..., \{e_1, e_2, e_3, e_4, e_5, e_6, e_7, e_8, e_9\} \Big\}
\end{aligned}
$$

Let $Q$ be a partition of $K$ containing theories $T$ that ~explain~ the ⭐_world_ ⭐: 

$$
\begin{aligned}
Q = \Biggr \{ \Big\{ \overset{T_1}{\{e_1\}, \atop \{e_1, e_2, e_3, e_4\} }\Big\},
              \Big\{ \overset{T_2}{\{e_1, e_2\}, \atop \{e_1, e_2, e_3, e_4, e_5\} }\Big\},
              \Big\{ \overset{T_3}{\{e_1, e_2 e_3\}, \atop \{e_1, e_2, e_3, e_4, e_5, e_6\} }\Big\}
   \Biggr\}
\end{aligned}
$$

So, to play with this a lil bit: 
 
- if we see $e_5$, then $T_1$ is imediately falsified as it does not consider $e_5$.

- if we see $e_1$, then $T_1$ is not falsified, but the longer that time goes by before we see $e_2$, the lower our confidence in $T_1$ will be.  _However;_ Occam's razor, by defenition, will not retract $T_1$ as no new infromation has been presented to contradict it thus far.  More on this later.

Let $M$ be a strategy that that chooses some $T \in Q$ at an arbitrary point in time which helps us converge on a true theory: a descrition of the ⭐_world_ ⭐ $w$.

For example, let's let the _truth_ $w$ be $\{e_1, e_2, e_3, e_4, e_5\}$, then $M$ would point to $T_2$.  

Now let $\pi$ be the "skeptical path" - a sequence of effects that nature can reveal such that we're taken to a new theory with each piece of added information:

$$
\begin{aligned}
    \pi = \underset{S}{\{e_1\}}, \underset{S'}{\{e_1, e_2\}}, \{e_1, e_2, e_3\}, ...
\end{aligned}
$$

such that $S \subseteq S'$, and $S$ _must_ conflict with $S'$: $T_1 \neq T_2$.  Each step in the skeptical path necessarily takes you to a new theory.


## Complexity 

The complexity of a set $c(S)$, then, is the length of the _longest_ skeptical path that terminates on $S$, $-1$:

$$
\begin{aligned}
    \pi &= \{e_1\} \\
    \therefore c(\pi) &= c(\{e_1\}) = 0 \\
    ...\\
    c(T_2) &= c(\{e_1, e_2, e_3, e_4, e_5\}) = 4 \\
    \because \pi &= \underset{1}{\{e_1\}}, \underset{2}{\{e_1, e_2\}}, \underset{3}{\{e_1, e_2, e_3\}}, \underset{4}{\{e_1, e_2, e_3, e_4\}}, \underset{5}{\{e_1, e_2, e_3, e_4, e_5\}}
\end{aligned}
$$

Suppose $e_4$ is revealed in isolation, we have no theory (from our example $Q$) that captures this _until_ $e_1, e_2,$ and $e_3$ are also revealed.  However, this would not be a skeptical path, nor does it falsify any of our theories either.  This revelation, beginning with $e_4$ in isolation would just decrease our confidence in our theories, indicating that we might need a new theory.  For example, let $e_4$ represent the Higgs boson particle, it wouldn't make sense for nature to reveal this to us without first accounting for $e_2:$ the large hadron collider.

The next natural step is to define the complexity of a Theory, which is nothing more than a set of sets containing effects.  Kelly defines the the complexity of a Theory with two stipulations, the first being that a Theory's complexity is the minimum complexity of the sets in T:

$$
\begin{aligned}
   c(T) = \min \limits_{S \in T} c(S)
\end{aligned}
$$

The second stipulation is that $S$ must be compatible with experience meaning that if, for example, $e_6$ is revealed, $T_1$ must be eliminated. 

## Occam's Razor

So, Occam's razor is $c(T)$, but this doesn't necessarily get us to the truth... The strength of Occam's razor is that, if another truth-getting strategy is used, it will eventually be forced to make a retraction in the absence of new information, like the Higgs boson, given $\{e_1, e_2, e_3, ?\}$, whereas Occam's razor can solve a problem $(K_e, Q)$ each time new information $e_i$ is revealed that is necessarily the simplest, most complete Theory that makes no _more_ retractions than any other arbitrary strategy.  In this sense, Occam's razor leads you to the truth the fastest, in the _worst case_.

> The new idea is that these [alternative theories] are not exhaustive alternatives, for it may be that Ockham's razor somehow converges to the truth along the straightests or most direct path, where directness is, roughly speaking, a matter of not altering one's opinion more often or later than necessary.  

Say one theory $T$ leaps to the correct answer and Occam's razor took the long path to get there.  As soon as nature reveals $e_i$, $T$ could be invalidated, but Occam's razor is still true, with one additional retraction.

On pain of non-convergence, there is always some amount of time where new $e_i$, or lack thereof, will force us to retract our theory.  We could be waiting for the Higgs boson $e_4$ for eternity, then finally retract our Theory $\{e_1, e_2, e_3, e_4\}$, and the devilish nature of $\pi$ could, the very next day, reveal $e_4$.  $T$ would have made an excessive retraction: once to retract $e_4$, then rightfully again to re-include $e_4$.  Occam's razor dictates patience, and never makes the first retraction.  In fact, Occam's razor never included $e_4$ prior to its revelation.  Hence, it only ever retracts theories in light of new $e_i$.  Occam's razor is the upper bound for the worst case, but again, the generality of this approach makes it convergent in all cases. Whereas other strategies might work in some specific cases, "faster" than Occam's razor, they also may fail for other fields, leading to excess retractions, and therefore less _simplicity_. 

Nature is recalcitrant, and can pause at $e_3$ for infinity, then as soon as we retract, $e_4$ is revealed.  Occam's razor does not retract on pain of convergence: it is the most pessimistic approach with respect to nature. 

## Critiques of Occam's Razor and Some Takeaways

"Any theory worth its salt has an underlying mechanism, where's Occam's?" 

Occam's razor is useful when no current Theory contains $\pi$.  The worst case you get stuck in is the one where nature falsifies your "best" theory per $c(T)$, and the one retraction you make increases $c(T)$ by only one.  Your mechanism is not obliterated. 

Take $T_4 = \Big\{ \{e_7, e_8\}\Big\}$ along with $T_1 = \Big\{\{e_1\}, \{ e_1, e_2, e_3, e_4 \}\Big\}$.  $T_4$ is _simpler_ than $T_1$ given _no_ $\pi$ yet, as there is no path we could be given that takes us to both $e_4$ and $e_7$.  $T_4$ is bolder because it's _more_ true or false, and that is the definition of simplicity.  The fragility of $T_4$ is directly proportional to its simplicity and therein lies the profundity of Occam's razor.

> Since methods that approach the truth more directly have superior _connection_ to the truth or are more _conducive_ to find the truth, it is a relevant and non-circular response to the simplicity puzzle to priove that Ockham strategies approach the truth more directly than all competitors.


- What makes your theory _complex_ is the presence of other theories that predict a _subset_ of what your theory predicts

- What makes your theory _simple_ is how _indivisible_ your predictions are among known possible theories