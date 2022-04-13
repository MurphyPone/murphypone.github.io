---
title: "Towards Computational Game Theory"
date: "2022-04-20"
description: "Philosophy, Economics"
path: "/blog/game-theory"
---

## Preface

The front third of this post is more explanation, the middle half is notes on computational methods, and the last sixth is (hopefully) the implementation from scratch of some of the algorithms described.

## Intro to Game Theory: a Lightspeed Overture

Broadly speaking, Game Theory is a field dedicated to modeling the interactions between different (types of) agents, and it has vast applications.  As the section header indicates, this is a super crash course, but I highly recommend doing some [further reading](#) because this topic is SO COOL.

You know the drill: first, some definitions.

### Glossary 

- **Agent**: A player in a game
- **Game**: Usual represented as a payout matrix (or tensor, graph for games with multiple players).  Types of games include:
  - **Zero Sum**: One player wins at the expense of all others – purely competitive. Examples include: poker, chess, checkers, (most conquest-driven board games), cake cutting (divided unequally).
  - **Non-zero Sum**: One player's strategy does not necessarily impact the outcome for another player.  These games can be win-win. Examples include: Battle of the Sexes, Prisoner's Dilemma, markets.
  - **General Sum**: ???

An example of a generic "game" might look like this:

<table>
  <style type="text/css">
    .tg  { border-collapse: collapse; border-spacing: 0 ;}
    .tg td { border-color: black; border-style: solid; border-width: 1px; 
  overflow: hidden;padding: 10px 5px; word-break:normal;}
    .tg th { border-color: black; border-style: solid; border-width: 1px; 
            overflow:hidden; padding: 10px 5px; word-break: normal;}
    .tg .tg-nrix { text-align:center; vertical-align: middle; font-weight: bold; }
    .tg .tg-baqh { text-align:center; vertical-align: top; }
    .tg .tg-0pky { border-left-color: white; border-top-color: white; text-align: left;vertical-align: top}
    .tg .tg-0lax { text-align: center; vertical-align: middle }
</style>
<table class="tg" style="undefined;table-layout: fixed; width: 200px">
  <colgroup>
    <col style="width: 40px">
    <col style="width: 40px">
    <col style="width: 40px">
  </colgroup>
  <thead>
  <tr>
      <th class="tg-0pky"></th>
      <th class="tg-baqh" colspan="2">B</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-nrix" rowspan="2">A</td>
      <td class="tg-0lax">2, 4</td>
      <td class="tg-0lax">0, 2</td>
    </tr>
    <tr>
      <td class="tg-0lax" style="color: red">10, 2</td>
      <td class="tg-0lax">2, 0</td>
    </tr>
  </tbody>
</table>

- **Strategy**: Set of rules an agent follows in order to maximize the utility of their outcome
  - **Dominant**: Exists in a game where there is a single optimal strategy for each player, regardless of what their opponent(s) choose. In the above example, player **A** has a dominant strategy since, regardless of what player **B** chooses, their optimal outcome is to play down-left. 
  - **Pure**: A pure strategy is one where the agent chooses an action consistently.
  - **Mixed**: A mixed strategy is one where a player chooses a strategy based on a probability distribution over strategies available to her.
- **Nash Equilibrium/Equilibria**: A set of strategies over players are said to be at Nash Equilibrium if all player's optimal choices coincide with one another such that neither player/no players would want to change their behavior or strategy after other players' strategies are revealed.  This implies that player's choose the optimal strategy according to what they assume other players will select for their respective strategies. 
  - There can be multiple Nash Equilibria in a given game, for example: 

<table>
  <style type="text/css">
    .tg  { border-collapse: collapse; border-spacing: 0 ;}
    .tg td { border-color: black; border-style: solid; border-width: 1px; 
  overflow: hidden;padding: 10px 5px; word-break:normal;}
    .tg th { border-color: black; border-style: solid; border-width: 1px; 
            overflow:hidden; padding: 10px 5px; word-break: normal;}
    .tg .tg-nrix { text-align:center; vertical-align: middle; font-weight: bold; }
    .tg .tg-baqh { text-align:center; vertical-align: top; }
    .tg .tg-0pky { border-left-color: white; border-top-color: white; text-align: left;vertical-align: top}
    .tg .tg-0lax { text-align: center; vertical-align: middle }
</style>
<table class="tg" style="undefined;table-layout: fixed; width: 200px">
  <colgroup>
    <col style="width: 40px">
    <col style="width: 40px">
    <col style="width: 40px">
  </colgroup>
  <thead>
  <tr>
      <th class="tg-0pky"></th>
      <th class="tg-baqh" colspan="2">B</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-nrix" rowspan="2">A</td>
      <td class="tg-0lax" style="color: red">1, 1</td>
      <td class="tg-0lax">-1, -1</td>
    </tr>
    <tr>
      <td class="tg-0lax">-1, -1</td>
      <td class="tg-0lax" style="color: red">1, 1</td>
    </tr>
  </tbody>
</table>

For games with mixed strategies at play, the equilibria are determined by the optimal frequency of when to play a certain strategy given consideration of other players' distributions.

### Types of Games

There are numerous examples of 2 player games:

1. **Prisoner's Dilemma (one shot)** - perhaps the most quintessential "game." Guy de Maupassant provides an excellent depiction of this game in his short story [_Two Friends_](https://americanliterature.com/author/guy-de-maupassant/short-story/two-friends).  Consider the following excerpt

> The two fishermen remained silent. The German turned and gave an order in his own language. Then he moved his chair a little way off, that he might not be so near the prisoners, and a dozen men stepped forward, rifle in hand, and took up a position, twenty paces off.
> 
> "I give you one minute," said the officer; "not a second longer."
> 
> Then he rose quickly, went over to the two Frenchmen, took Morissot by the arm, led him a short distance off, and said in a low voice:
> 
> "Quick! the password! Your friend will know nothing. I will pretend to relent."
> 
> Morissot answered not a word.
> 
> Then the Prussian took Monsieur Sauvage aside in like manner, and made him the same proposal.
> 
> Monsieur Sauvage made no reply.
> 
> Again they stood side by side.
> 
> The officer issued his orders; the soldiers raised their rifles.
> 
> Then by chance Morissot's eyes fell on the bag full of gudgeon lying in the grass a few feet from him.
> 
> A ray of sunlight made the still quivering fish glisten like silver. And Morissot's heart sank. Despite his efforts at self-control his eyes filled with tears.
> 
> "Good-by, Monsieur Sauvage," he faltered.
> 
> "Good-by, Monsieur Morissot," replied Sauvage.
> 
> They shook hands, trembling from head to foot with a dread beyond their mastery.
> 
> The officer cried:
> 
> "Fire!"
> 
> The twelve shots were as one.

<style type="text/css">
  .tg  { border-collapse: collapse; border-spacing: 0 ;}
  .tg td { border-color: black; border-style: solid; border-width: 1px; 
  overflow: hidden;padding: 10px 5px; word-break:normal;}
  .tg th { border-color: black; border-style: solid; border-width: 1px; 
            overflow:hidden; padding: 10px 5px; word-break: normal;}
  .tg .tg-nrix { text-align:center; vertical-align: middle; font-weight: bold; }
  .tg .tg-baqh { text-align:center; vertical-align: top; }
  .tg .tg-0pky { border-left-color: white; border-top-color: white; text-align: left;vertical-align: top}
  .tg .tg-0lax { text-align: center; vertical-align: middle }
</style>
<table class="tg" style="undefined;table-layout: fixed; width: 300px">
  <colgroup>
  <col style="width: 40px">
  <col style="width: 80px">
  <col style="width: 80px">
  <col style="width: 80px">
  </colgroup>
  <thead>
    <tr>
      <th class="tg-0pky" colspan="2" rowspan="2"></th>
      <th class="tg-baqh" colspan="2">B</th>
    </tr>
    <tr>
      <th class="tg-0lax" style="font-weight: normal;">cooperate</th>
      <th class="tg-0lax" style="font-weight: normal;">defect</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-nrix" rowspan="2">A</td>
      <td class="tg-0lax">cooperate</td>
      <td class="tg-0lax">3, 3</td>
      <td class="tg-0lax">0, 5</td>
    </tr>
    <tr>
      <td class="tg-0lax">defect</td>
      <td class="tg-0lax">5, 0</td>
      <td class="tg-0lax" style="color: red;">1, 1</td>
    </tr>
  </tbody>
</table>

Here, the two Frenchman poetically, but irrationally chose defect, defect. 

2. **Battle of the Sexes** - a coordination game between a couple who can't agree on how to spend their evening together.  The wife would like to go to a ballet, and the husband a boxing match.  Each would rather spend their time together at the activity they least prefer rather than alone, at their preferential activity:

<style type="text/css">
  .tg  { border-collapse: collapse; border-spacing: 0 ;}
  .tg td { border-color: black; border-style: solid; border-width: 1px; 
  overflow: hidden;padding: 10px 5px; word-break:normal;}
  .tg th { border-color: black; border-style: solid; border-width: 1px; 
            overflow:hidden; padding: 10px 5px; word-break: normal;}
  .tg .tg-nrix { text-align:center; vertical-align: middle; font-weight: bold; }
  .tg .tg-baqh { text-align:center; vertical-align: top; }
  .tg .tg-0pky { border-left-color: white; border-top-color: white; text-align: left;vertical-align: top}
  .tg .tg-0lax { text-align: center; vertical-align: middle }
</style>
<table class="tg" style="undefined;table-layout: fixed; width: 300px">
  <colgroup>
  <col style="width: 40px">
  <col style="width: 80px">
  <col style="width: 80px">
  <col style="width: 80px">
  </colgroup>
  <thead>
    <tr>
      <th class="tg-0pky" colspan="2" rowspan="2"></th>
      <th class="tg-baqh" colspan="2">Husband</th>
    </tr>
    <tr>
      <th class="tg-0lax" style="font-weight: normal;">boxing</th>
      <th class="tg-0lax" style="font-weight: normal;">ballet</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-nrix" rowspan="2">Wife</td>
      <td class="tg-0lax">boxing</td>
      <td class="tg-0lax" style="color: red;">3, 2</td>
      <td class="tg-0lax">0, 0</td>
    </tr>
    <tr>
      <td class="tg-0lax">ballet</td>
      <td class="tg-0lax">0, 0</td>
      <td class="tg-0lax" style="color: red;">2, 3</td>
    </tr>
  </tbody>
</table>

3. **Stag Hunt**
4. **Chicken**
5. **Rock Paper Scissors**
6. **Prisoners' Dilemma (Iterated, mind the apostrophe)**

And many more!
  
### Types of Agents

Most Game Theory takes place under the umbrella of Economic theory which assumes rational agents called ***Homo Economicus*** whose utility function is focused on maximization of self-interest.  That's not to say that his utility function couldn't be altruistically oriented, but, inductively, he is a rube as you may be able to discern in this awesome simulation about the [Christmas Truce](https://ncase.me/trust/), which outlines a variety of different strategies.

- Incidentally, the above simulation defines Zero-sum and Non-zero Sum quite eloquently:
  - **Zero-sum**: "This is the sadly common belief that a gain for "us" must come at a loss to _them_, and vice versa."
  - **Non-zero Sum**: "This is when people make the hard effort to create a win-win solution! (or at least, avoid a lose-lose) Without the non-zero-sum game, trust cannot evolve."

Homo Economicus is loosely derived from Hobbes' grim State of Nature depicted in _Leviathan_:

> _Bellum omnium contra omnes_.

David Hume's _Treatise of Human Nature_ published just under a century later paints a slightly less brutal image of human nature in which repeated (iterated) interactions between agents in the state of nature can give way to a compassionate society, yielding the model of ***Homo Sociologicus***.  This is, again, a rather vast over simplification of two of the most influential texts on Game Theory.

## Formalizing Game Theory

Define a finite normal-form game as a tuple of the form 

$$
\begin{aligned}
  (N, A, U)
\end{aligned}
$$

where:
- $N$ is a finite set of $n$ players 
- $A = A_1 \times ... \times A_n$ where $A_i$ is a finite set of actions available to player $i$ 
  - each vector $a_i = [ a_i, ..., a_n ] \in A$ is an **action profile**
- $U$ a set of utility functions $(u_1, ..., u_n)$ where $u_i: A \rarr \Reals$ is a real-valued utility for player $i$.

> though, typically, utility functions should map from the set of outcomes, _not_ actions (since we're naively playing this game, not learning from the environment, ... yet), we assume that actions equal outcomes: $A = O$.

Two-player, zero-sum games have Nash Equilibria which can be expressed as a Linear Program, meaning the solution can be found in polynomial time.

### Linear Programs

A linear program is defined by a set of real-valued variables, a linear objective function (weighted sum of the variables), and a set of linear constraints.

Take the set of variables $\{x_1, ..., x_n\}$ with each $x_i \in \Reals$.  The objective function given by a set of corresponding  constraints $\{w_1, ..., w_n \}$ is then

$$
\begin{aligned}
  \max \displaystyle\sum_{i=1}^n w_i x_i
\end{aligned}
$$

TODO: more here?

---

### Example

Given a game 

$$
\begin{aligned}
  G = (\{1,2\}, A_1 \times A_2, \{u_1, u_2\})
\end{aligned}
$$


where $u_i^*$ is the expected utility for player $i$ in equilibrium (the value of the game $|G|$), we expect by definition of a zero sum game that $u_1^* = -u_2^*$.

The construction of our linear program is then given by:

$\min u_1^* \text{ subject to: }$
$$
\begin{aligned}
  \tag{1} \displaystyle\sum_{k \in A_2} u_1(a_1^j, a_2^k) \cdot s_2^k \leq u_1^* \quad \forall j \in A_1 \\ 
\end{aligned}
$$

$$
\begin{aligned}
 \tag{2} &\displaystyle\sum_{k \in A_2} s_2^k = 1 \implies s_2^k \geq 0 \quad \forall k \in A_2
\end{aligned}
$$

## Further Reading 

Gaus, Gerald F. "On Philosophy, Politics, and Economics," _University of Arizona_, 2008. 

Moehler, Michael. "Why Hobbes' State of Nature is Best Modeled by an Assurance Game," _Utilitas_ Vol. 21 No. 3,  pp. 297-326, 2009, https://philpapers.org/rec/MOEWHS

[book](http://www.masfoundations.org/mas.pdf)