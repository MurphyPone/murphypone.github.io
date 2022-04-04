---
title: "Voting Power"
date: "2022-03-31"
description: "Shapley-Shubrik, Banzhaf, python, a suspicious amount of hypotheticals"
path: "/blog/voting-power"
---

## Preface

In which, I get to erase something that's been on my whiteboard todo list for over 2 years!  Might as well have used a sharpie – dry-erase wasn't meant to lay dormant for that long. So I've been wanting to look into voting power indexes for awhile and was excited at the thought of implementing them as part of a supporting util library for other game theory experiments (all of this is in the service of [cake cutting](https://en.wikipedia.org/wiki/Fair_cake-cutting)), but we must walk before we can run.

What are voting power indexes?  At a high level, they're used to measure the distribution of influence of players in a weighted voting system.  A practical example is the electoral college - where states have different amounts of votes proportionate to their seats in the House. California, Texas, and New York have a lot more weight than Wyoming.  

An _im_personal example might be, say, a bachelor party.  Let's say, **purely** hypothetically, we have groomsmen Peter, Charlie, $P_3$, $P_4$, and $P_5$ as well as the bachelor: Jack.  Suppose, again _totally hypothetically_, there are unequal contributions towards the Debaucherous Dowry for the bachelor party.  This resembles a weighted voting system where weight is analogous to the financial investments of the groomsmen.  Obviously the groom isn't paying anything, and he gets veto power/cart blanche but he's chill, and will play along with the voting system.  Agent Charlie is a student, so we don't hold his contributions or lackthereof against him, and he's the DD, so that brings him into the fold of voting power.  Agent Peter is also super chill and laid back, definitely not the type of guy to write an algorithm to quantifiably prove that he should have more say in the matter as the best man – hypothetically. Agents $P_3$, $P_4$ and $P_5$ are arbitrary (sorry fellas, pay up if you want to be named, no free clout 😤😤 etc. etc.).  

As reasonable voters, they agree that the threshold $T$ for the weighted voting system should be 51% of the total Debaucherous Dowry which is the cumulative sum of their respective contributions.  Say $T = \$100 \cdot 0.51$ (Jack, I'm sorry).

![](https://c.tenor.com/PuzsCuZySHQAAAAC/pawn-pawn-star.gif)

We then have the following system:

 $[51: (Jack: 35), (Peter: 20), (Chuck: 15), (P_3: 10), (P_4: 10), (P_5: 10) ]$

And if that nonsense doesn't make sense yet, hang tight, the notational definitions are imminent!  

So, how would we measure whose say actually matters? Who is influential? Disregarding the social realities of being a huge dick, veto power, or trying to form a quorum to overrule the groom, we have some tools at our disposal to investigate this question!

I'm not going to wax poetic about the importance of the metrics of democracy (\*_proceeds to write a blog post about just that_\*), but the subjects of this post are two forms of quantifying the importance of particular players in weighted voting systems. There are numerous ways to measure voter importance or power, but two of the most prominent measuring sticks are the [Shapley-Shubrik](https://www.jstor.org/stable/1951053) and the [Banzhaf](https://www.worldcat.org/title/rutgers-law-review/oclc/818992679) methods.  First, some 

## Definitions

- a **power index** amongst a finite amount of voters (dear God, please be finite)

- A **Coalition** is a list of players $[P_1, P_2, ..., P_n]$ (or, rather, their respective weights).  Wikipedia has some prudential examples of how coalitions are key to parliamentary systems, check'em out if you care.

  - A **Sequential Coalition** is just a coalition, but we pay extra attention to the order of the voters: 

$$
\begin{aligned}
<P_1, P_2, ..., P_n>
\end{aligned}
$$

- Idc enough about the formal game theory definitions to distinguish between **Measures**, **Ballots**, and **Issues** (similarly **players**, **agents**, ... whatever), but they're expressed as follows: 
  
$$
\begin{aligned}
  [ T: [P_1, P_2, ..., P_n ]]
\end{aligned}
$$

  where $T$ is the threshold for the measure to pass, as well as the coalition of voters. Concretely, the following notation describes a measure with a requisite threshold to pass of $8$, with a coalition of 4 players with respective weights of $6, 4, 3, 2$:

$$
\begin{aligned}
  [8 : 6, 4, 3, 2]
\end{aligned}
$$

  Note that the sequentiality is implicit under the index.

## Shapley-Shubrik 

The Shapley-Shubrik voting power index defines a mechanism of determining how likely it is for a voter to be **pivotal** in a ballot.  It relies on Sequential Coalitions (whereas the Banzhaf index does not).  A **pivotal player** is the player in a sequential coalition that changes a measure's outcome from losing to winning.  Notably, there can only be _one_ pivotal voter in a sequential coalition.  Using the above example measure, we can illustrate this:


| Sequential Coalition | $\sum w_i $| Measure passes? |
|-|-|-|
| $<P_3>$ | 3 | ❌ |
| $<P_3, P_2>$ | 3 + 4 = 7 | ❌ |
| $<P_3, P_2, P_4>$ | 3 + 4 = 7 | ❌ |
| $<P_3, P_2, P_4>$ | 3 + 4 + 2 = 9 | ✅ yea boiiii |
| $<P_3, P_2, P_4, P_1>$ | 3 + 4 + 2 + 6 = 9 | ✅ also yes, but irrelevant at this point |

The Shapley-Shubrik "algorithm" is pretty straightforward:

1. List all sequential coalitions (_this is expensive_, for $N$ voters in a coalition, we have $N!$ sequences to evaluate - hence "dear God, please be finite," as in like 6 dudes max)
2. In each sequential coalition, determine the pivotal player
3. Compute the percentage of times each voter is pivotal

---

### Example

Consider the measure $[6: 4, 3, 2]$

Listing all the sequential coalitions (3! = 6, we gucci) and underlining the pivotal voters we have:
- $<P_1, \underline{P_2}, P_3>$
- $<P_1, \underline{P_3}, P_2>$
- $<P_2, \underline{P_1}, P_3>$
- $<P_2, P_3, \underline{P_1}>$
- $<P_3, P_2, \underline{P_1}>$
- $<P_3, \underline{P_1}, P_2>$

Yielding the following distribution:

| Player | times pivotal | [power](http://www.quickmeme.com/img/fc/fc3646a02beca4bbf6c05e711f81c0eb354d253149028d9ce0fca9def3aaf63a.jpg) index |
|-|-|-|
| $P_1$ | 4 | $4/6$ |
| $P_2$ | 1 | $1/6$ | 
| $P_3$ | 1 | $1/6$ | 

Pretty easy!

--- 

## Banzhaf 

Another measure of voting power is the Banzhaf index which determines which voters are **critical**. A critical voter is one whose vote is necessary for a measure to pass. E.g. I am a critical voter if 

$$
\begin{aligned}
  \text{total votes so far} - w_{me} < T  
\end{aligned}
$$

Note the distinction between **critical** and **pivotal**: since the Banzhaf index considers _combinations_ instead of _permutations_ (and the ordering of combinations is not necessary, so we deal in regular ol' coalitions). 

E.g. (say "_E.g._" one more time I dare you) in a measure $[8: P_1, P_2, P_3]$, it would be possible for arbitrarily sufficient $P_1$ and $P_2$ to meet the threshold $8$ without the "dummy" voter $P_3$.

The algorithm for computing the Banzhaf index for a weighted voting system is as follows:

1. Compute all _winning_ combinations within the coalition
2. Identify which voters in each combination are critical
3. Compute the percentage of times each voter is critical

---

### Example Gratia!

Consider the measure $[8: 6, 3, 2]$.  The winning coalitions are:

1. $[\underline{P_1}, \underline{P_2}]$
2. $[\underline{P_1}, \underline{P_3}]$
3. $[\underline{P_1}, P_2, P_3]$

In the third case, either  $P_2$  or $P_3$ could leave the coalition and the remaining players could still meet quota, so neither is critical. If $P_1$  were to leave, the remaining players could not reach quota, so _only_ $P_1$ is critical.

---

## Comparison

While the Banzhaf index helps identify which players actually influence the outcome of the measure (i.e. some voters are irrelevant or "dummies," their votes for or against the issue have no impact), it does not capture the sequential dimension of the Shapley-Shubrik index.

The Shapley-Shubrik index is constrained by the assumption that all members of a coalition are present for the measure. The Banzhaf index does not, hence it works with partial sequences (combinations).

By definition the Banzhaf index is just the count of people necessary to pass the measure (it discounts all the dummy voters), and the Shapley-Shubrik index measures how _pivotal_ a person is in time (be it for that given vote, or when they ordered their coalition, what have you).  There can only be one pivotal person, but their can be several critical people.

So when should you use which? I dunno dawg, I'm not your keeper.  Use both, and I'll show you how!  (In all seriousness, use Shapley-Shubrik when your weighted ballot is not blind or simultaneous: Iowa will never be a pivotal agent - I will not be taking comments about the idiocy of that statement at this time).  

![](/images/no-influence.png)

## Ambitions and Infertility

After I hacked the first draft of this code (which is still gross, I know, spare me) I was stoked to try to get extravagant and have a much longer post where we also construct an interactive map of congressional voting districts labeled with their respective voting power etc. etc. But remember that lil caveat of the Shabley-Shubrik algorithm and how it requires us to compute _all permutations of the coalition_ - yea, permuting things is just no good for large $N$ (and by large, I mean like more than 10).

We were going to make a nice choroplethic visualization with hexagons 'n shit, but alas, the constraints of flops.

There are 435 electoral districts. 435! has 961 digits. (20% of which are 0, the rest are more or less uniformly distributed, which is curious and seemingly unnatural. But it makes sense, theres a ton of even numbers being multiplied with factors of 5).  The number of trailing zeros is given by:

$$
\begin{aligned} 
  \sum_{k=1}^\infty \Bigg\lfloor \frac{n}{5^k}\Bigg\rfloor
\end{aligned}
$$

The point is that my laptop almost caught on fire, and I may now be infertile. 

> Docker was actually invented after Solomon Hykes tried to compute all the permutations of a list of length 11 on his laptop and it burnt his crotch right off!

## Implementation

Okay, onto the nuts and bolts.

Let's wrap this notion of a Measure in a class and just stuff it chock-full of the computations.  Design patterns be damned!

We know we need a threshold $T$ and a list of weights for each voter, and while we're at it, we might as well accept a list of labels for each voter as well (coulda been a dictionary, but you shoulda not mention it):

```python
from typing import List # as a treat, I will typehint one (1) argument in the whole file
from itertools import permutations, combinations

class Measure():
  def __init__(self, majority: int, weights: List[int], labels = None):
    """majority: amount required for coalition to pass
        weights: amount of votes for each voter P 
    """
    self.majority = majority 
    if labels:
      self.weights = {f"{l}": w for l, w in zip(labels, weights)}
    else: 
      self.weights = {f"P{i+1}": w for i, w in enumerate(weights)}
```

We know we're going to need to compute all the permutations and combinations of our coalition, and hell, we should probably even store those as fields of the instance so we don't have to melt our gonads each time we care to examine a voting system, but I'm lazy + members of a coalition may come and go!

```python
  def get_perms(self):
      """gets all (comprehensive) permutations of weights"""
      return list(permutations(self.weights))

  def get_combos(self):
      """gets all (partial) combinations of weights"""
    def flatten(lls):
    """helper to flatten the list of lists we get from `combinations`"""
      flattened = []
      for e in lls:
        if type(e) is list:
          for item in e:
              flattened.append(item)
        else:
          flattened.append(e)
      return flattened

    combos = []
    for r in range(len(self.weights) + 1):
      combos.append(list(combinations(self.weights, r)))
    return flatten(list(combos))

  def sum_seq(self, seq):
    """given a tuple of the form ('P1', 'P2', 'P3') return the sum of the associated weights"""

    return sum(self.weights[p] for p in seq)
```

We (I'm being incredibly generous here by crediting you, but you're reading this which is more than half the battle) also threw in a helper to tally the cumulative weights of the coalition which is useful later on.

First, for Shapley-Shubrik, we need to count all the pivotal agents.

```python
  def count_pivotal(self):
    """Shapley-Shubrik"""
    res = {k: 0 for k in self.weights }

    # for each permutation
    perms = self.get_perms()
    for perm in perms:
      total = 0
      # start summing the weights of the sequenced coalition
      for w in perm:
        total += self.weights[w]

        # once a majority has been reached
        if total >= self.majority:
          res[w] += 1
          break # stop counting the "dummy" voters

    n_perms = len(perms)
    for k, v in res.items():
      if n_perms > 0:
        res[k] = round(float(v)/n_perms, 4)
      else: 
        res[k] = 0

    return res
```

voila! I named this method poorly on purpose 😈.  Banzhaf is only slightly more troubling:

```python
  def count_critical(self):
    """Banzhaf"""
    # start by listing all coalitions, then eliminating non winning coalitions
    combos = self.get_combos()
    winning_combos = [ combo for combo in combos if self.sum_seq(combo) >= self.majority ]
    critical_counts = { k: 0 for k in self.weights }
    
    # for each passing measure
    for wp in winning_combos: # why `wp`? beats me
      total = self.sum_seq(wp)

      # iterate over each voter 
      for p in wp:
        # if their cast vote is necessary for the measure to pass, they are critical
        if total - self.weights[p] < self.majority:
          critical_counts[p] += 1
    
    n_critical = sum([critical_counts[k] for k in critical_counts])
    for k, v in critical_counts.items():
      if n_critical > 0:
        critical_counts[k] = round(float(v)/n_critical, 4)
      else: 
        critical_counts[k] = 0

    return critical_counts
```

And lastly, a perverse `toString` to describe our `Measure`:

```python
def __repr__(self):
  dict_str = ""
  for k, v in self.weights.items():
    dict_str += f"({k}, {v}), "
  dict_str = dict_str[:-2]

  res = f"[{self.majority}: {dict_str}".replace("[", "").replace("]", "")
  res = f"[{res}]"
  res += f"\nShapley-Shubrik:\t{self.count_pivotal()}"
  res += f"\nBanzhaf:\t\t{self.count_critical()}\n"
  return res
```

Remember, we use Python because it's _easy_ not because we want to pure, consistent, or good programmers.

Let's test it out on a known quantity like the first example from earlier: 

$$
\begin{aligned}
  [6: 4, 3, 2]
\end{aligned}
$$

```python
m = Measure(6, [4, 3, 2])
>>> [6: (P1, 4), (P2, 3), (P3, 2)]
    Shapley-Shubrik:        {'P1': 0.6667, 'P2': 0.1667, 'P3': 0.1667}
    Banzhaf:                {'P1': 0.6, 'P2': 0.2, 'P3': 0.2}
```

Presto! Again, I lament the absence of pretty visuals.  Alas, even a meager distribution graph looks pretty unimpressive with only 10 agents (imagine a power law curve, yea that's pretty much it :p). 

But now, finally, we can get down to the bottom of our oh-so-pressing, **purely** hypothetical. 


```python
weights = [35, 20, 15, 10, 10, 10]
agents = ["Jack", "Peter", "Chuck", "P3", "P4", "P5"]
i_am_not_a_control_freak_i_swear = Measure(51, weights, agents)
>>> [51: (Jack, 35), (Peter, 20), (Chuck, 15), (P3, 10), (P4, 10), (P5, 10)]
    Shapley-Shubrik: {
      'Jack':   0.4333, 
      'Peter':  0.1833, 
      'Chuck':  0.1333, 
      'P3':     0.0833, 
      'P4':     0.0833, 
      'P5':     0.0833
    }

    Banzhaf: {
      'Jack': 0.4259, 
      'Peter': 0.1667, 
      'Chuck': 0.1296, 
      'P3': 0.0926, 
      'P4': 0.0926, 
      'P5': 0.0926
    }
```

In conclusion, get destroyed $P_3, P_4, P_5$.  Jokes, I love you guys. Congrats, Jack.