---
title: "34 | Towards Computational Game Theory Part 1"
date: "2022-04-17"
description: "Philosophy, Economics"
path: "/blog/game-theory-1"
---

<style> 
  .n { visibility: hidden; } 
  
  table {
    margin-left: 40%;
  }

</style>

## Preface

The front half of this post is mostly explanation, and the latter half are notes.

## Contents

- [Preface](#preface)
- [Contents](#contents)
- [ Intro to Game Theory: a Lightspeed Overture](#-intro-to-game-theory-a-lightspeed-overture)
  - [ Glossary](#-glossary)
- [ Types of Games](#-types-of-games)
  - [ 1. **Prisoner's Dilemma (one shot)**](#-1-prisoners-dilemma-one-shot)
  - [ 2. **Battle of the Sexes**](#-2-battle-of-the-sexes)
- [ 3. Chicken](#-3-chicken)
  - [ 4. Rock, Paper, Scissors](#-4-rock-paper-scissors)
  - [ 5. Penny Matching](#-5-penny-matching)
  - [ 6. Iterated Prisoners' Dilemma](#-6-iterated-prisoners-dilemma)
- [ Types of Agents](#-types-of-agents)
- [ Formalizing Game Theory](#-formalizing-game-theory)
- [ Linear Programs](#-linear-programs)
  - [ Simplex Algorithm](#-simplex-algorithm)
  - [Example](#example)
- [The Lagrangian](#the-lagrangian)
  - [Example](#example-1)
  - [ PPAD](#-ppad)
- [ Further Reading](#-further-reading)

## <a name="intro" class="n"></a> Intro to Game Theory: a Lightspeed Overture

Broadly speaking, Game Theory is a field dedicated to modeling the interactions between different (types of) agents, and it has vast applications.  As the section header indicates, this is a super crash course, but I highly recommend doing some [further reading](#further-reading) because this topic is SO COOL.

You know the drill: first, some definitions.

### <a name="glossary" class="n"></a> Glossary 

- **Agent**: A player in a game
- **Game**: Usual represented as a payout matrix (or tensor, or a graph for games with multiple players).  Types of games include:
  - **Zero Sum**: One player wins at the expense of all others – purely competitive. Examples include: poker, chess, checkers, (most conquest-driven board games), cake cutting (divided unequally).  Formally, if we have $A = (a_{ij}), B = (b_{ij})$ then, in a zero-sum game: $\\ a_{ij} + b_{ij} = 0$.
  - **Non-zero Sum**: One player's strategy does not necessarily impact the outcome for another player.  These games can be win-win. Examples include: Battle of the Sexes, Prisoner's Dilemma, markets.
  - **Constant-Sum**: one where there exists some constant $c$ such that, for each strategy profile $a_{ij}, b_{ij}; a_{ij} + b_{ij} = c$.  It's like a zero-sum game, but replace 0 with $c$. 
  - **General Sum**: In these games, there is no _optimal strategy_, instead players choose the best response to their opponent's strategy.


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

An additional note to make is that agents in different types of games can have **imperfect** information as well as **incomplete** information.

> Incomplete Information means there are things you simply don't know, such as the opponent's strategies or payoffs. Imperfect Information means you won't know when or if an opponent makes a move. 

- **Strategy**: Set of rules an agent follows in order to maximize the utility of their outcome
  - **Dominant**: Exists in a game where there is a single optimal strategy for each player, regardless of what their opponent(s) choose. In the above example, player **A** has a dominant strategy since, regardless of what player **B** chooses, their optimal outcome is to play down-left. 
  - **Pure**: A pure strategy is one where the agent chooses an action consistently.
  - **Mixed**: A mixed strategy is one where a player chooses a strategy based on a probability distribution over strategies available to her.
- **Nash Equilibrium/Equilibria**: A set of strategies over players are said to be at Nash Equilibrium if all players' optimal choices coincide with one another such that neither player/no players would want to change their behavior or strategy after other players' strategies are revealed.  This implies that players choose the optimal strategy according to what they _assume_ other rational players will select for their respective strategies. 
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

[In general](https://blogs.cornell.edu/info2040/2014/09/12/applying-nash-equilibrium-to-rock-paper-and-scissors/), games can have one of the four types of Nash Equilibria:

1. Only one pure Nash Equilibrium (e.g. in Prisoner’s Dilemma)
2. Only one mixed Nash Equilibrium and no pure Nash Equilibrium (e.g. Kicker/Goalie Penalty kicks)
   - At least one player picks a "random" strategy such that no other player is able to increase her expected utility by playing an alternate strategy
3. Multiple pure Nash Equilibrium (e.g. Chicken)
4. Pure and mixed (e.g. Chicken)

_What the hell are are these games??_ Thanks for asking.

## <a name="games" class="n"></a> Types of Games

There are numerous examples of 2 player games:

### <a name="pd" class="n"></a> 1. **Prisoner's Dilemma (one shot)** 

Perhaps the most quintessential "game." Guy de Maupassant provides an excellent depiction of this game in his short story [_Two Friends_](https://americanliterature.com/author/guy-de-maupassant/short-story/two-friends).  Consider the following excerpt:

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
<table class="tg" style="undefined;table-layout: fixed; width: 350px">
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
      <th class="tg-0lax" style="font-weight: normal;">confess</th>
      <th class="tg-0lax" style="font-weight: normal;">silence</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-nrix" rowspan="2">A</td>
      <td class="tg-0lax">confess</td>
      <td class="tg-0lax">-1, -1</td>
      <td class="tg-0lax">-4, 0</td>
    </tr>
    <tr>
      <td class="tg-0lax">silence</td>
      <td class="tg-0lax">0, -4</td>
      <td class="tg-0lax" style="color: red;">-3, -3</td>
    </tr>
  </tbody>
</table>

Here, the two Frenchman poetically, but  irrationally chose to remain silent. Here, the numbers chosen are _sort of arbitrary_; any game with payouts following this relation can be considered an instance of the Prisoner's Dilemma:

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
<table class="tg" style="undefined;table-layout: fixed; width: 350px">
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
      <td class="tg-0lax">a, a</td>
      <td class="tg-0lax">b, c</td>
    </tr>
    <tr>
      <td class="tg-0lax">defect</td>
      <td class="tg-0lax">c, b</td>
      <td class="tg-0lax">d, d</td>
    </tr>
  </tbody>
</table>

$$
\begin{aligned}
  c > a > d > b
\end{aligned}
$$

### <a name="bos" class="n"></a> 2. **Battle of the Sexes**

The Battles of the Sexes is a coordination game between a couple who can't agree on how to spend their evening together.  The wife would like to go to a ballet, and the husband a boxing match.  Each would rather spend their time together at the activity they least prefer rather than spend the evening on their lonesome at their preferential activity:

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
  <col style="width: 50px">
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

## <a name="chicken" class="n"></a> 3. Chicken

Chicken is an example of a _pure coordination_ game as the agents have no conflicting interests.  Consider two vehicles speeding towards each other.  They must mutually, but independently of one another (i.e., without communicating), decide which direction to swerve –or, less violently, which lane to drive in– so as not to hit the other player.  Pray that you're not playing against a Brit!

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
<table class="tg" style="undefined;table-layout: fixed; width: 350px">
  <colgroup>
  <col style="width: 30px">
  <col style="width: 30px">
  <col style="width: 30px">
  </colgroup>
  <thead>
    <tr>
      <th class="tg-0pky"></th>
      <th class="tg-0pky" style="border-top-color: black">Left</th>
      <th class="tg-0pky" style="border-top-color: black">Right</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th class="tg-0pky" style="border-left-color: black">Left</th>
      <td class="tg-0pky" style="color: red;">+1, +1</td>
      <td class="tg-0pky">0, 0</td>
    </tr>
    <tr>
      <th class="tg-0pky" style="border-left-color: black">Right</th>
      <td class="tg-0pky">0, 0</td>
      <td class="tg-0pky" style="color: red;">+1, +1</td>
    </tr>
  </tbody>
</table>


### <a name="rps" class="n"></a> 4. Rock, Paper, Scissors 

Need I explain the rules? Now we introduce a more interesting "game" model:

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
<table class="tg" style="undefined;table-layout: fixed; width: 350px">
  <colgroup>
  <col style="width: 40px">
  <col style="width: 40px">
  <col style="width: 40px">
  <col style="width: 40px">
  </colgroup>
  <thead>
    <tr>
      <th class="tg-0pky"></th>
      <th class="tg-0pky" style="border-top-color: black">Rock</th>
      <th class="tg-0pky" style="border-top-color: black">Paper</th>
      <th class="tg-0pky" style="border-top-color: black">Scissors</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th class="tg-0pky" style="border-left-color: black">Rock</th>
      <td class="tg-0pky">0, 0</td>
      <td class="tg-0pky">-1, +1</td>
      <td class="tg-0pky">+1, -1</td>
    </tr>
    <tr>
      <th class="tg-0pky" style="border-left-color: black">Paper</th>
      <td class="tg-0pky">+1, -1</td>
      <td class="tg-0pky">0, 0</td>
      <td class="tg-0pky">-1, +1</td>
    </tr>
    <tr>
      <th class="tg-0pky" style="border-left-color: black">Scissors</th>
      <td class="tg-0pky">-1, +1</td>
      <td class="tg-0pky">+1, -1</td>
      <td class="tg-0pky">0, 0</td>
    </tr>
  </tbody>
</table>

What are the Nash Equilibria for Rock, Paper Scissors, if any? This game falls under the second category of Nash Equilibria: one with only 1 mixed Nash Equilibria and _no pure strategy_.  If a player attempted to employ a pure strategy, i.e., always pick rock, then they would easily be exploited by any other player by simply choosing paper.  So how, then, do we compute the equilibria?  Say we have players $P_1, P_2$  with respective (identical) utility functions according to the above payout matrix where $P_i(\text{rock})$ is the probability that $P_i$ plays rock, etc.  If we enumerate the expected value of each respective option available to them:

$$
\begin{aligned}
  \mathbb{E}[u_1 (\text{rock})] &= 0 \cdot P_2(\text{rock}) + (-1) \cdot P_2(\text{paper}) + 1 \cdot P_2(\text{scissors}) \\
  \mathbb{E}[u_1 (\text{paper})] &= 1 \cdot P_2(\text{rock}) + 0 \cdot P_2(\text{paper}) + (-1) \cdot P_2(\text{scissors}) \\
  \mathbb{E}[u_1 (\text{scissors})] &= (-1) \cdot P_2(\text{rock}) + 1 \cdot P_2(\text{paper}) + 0 \cdot P_2(\text{scissors}) \\ 
  &\vdots \\
  \mathbb{E}[u_2 (\text{scissors})] &= (-1) \cdot P_1(\text{rock}) + 1 \cdot P_1(\text{paper}) + 0 \cdot P_1(\text{scissors}) \\ 
\end{aligned}
$$

Then we can conclude that

$$
\begin{aligned}
  \mathbb{E}[u_{i} (\cdot)] &= \frac{1}{3}
\end{aligned}
$$

On the real, the best way to win at RPS is to wait like half a second for your opponent to throw their selection, then throw its usurping strategy and gaslight your opponent until they concede.

### <a name="pennies" class="n"></a> 5. Penny Matching

Penny Matching is another example of a zero-sum game.  The premise is that there are two players, Even and Odd. The goal for the Even player is to match the Odd player's selection, and the goal for the Odd player is the inverse: _to be an utter deviant_, a copper crook, a parsimonious penny pilferer, a fractional filcher.   

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
  <col style="width: 50px">
  <col style="width: 80px">
  <col style="width: 80px">
  <col style="width: 80px">
  </colgroup>
  <thead>
    <tr>
      <th class="tg-0pky" colspan="2" rowspan="2"></th>
      <th class="tg-baqh" colspan="2">Even</th>
    </tr>
    <tr>
      <th class="tg-0lax" style="font-weight: normal;">Heads</th>
      <th class="tg-0lax" style="font-weight: normal;">Tail</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-nrix" rowspan="2">Odd</td>
      <td class="tg-0lax">Heads</td>
      <td class="tg-0lax">+1, -1</td>
      <td class="tg-0lax">-1, +1</td>
    </tr>
    <tr>
      <td class="tg-0lax">Tails</td>
      <td class="tg-0lax">-1, +1</td>
      <td class="tg-0lax">+1, -1</td>
    </tr>
  </tbody>
</table>

This is another example of a mixed strategy game. Consider what happens if we modify the payouts like so:

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
  <col style="width: 50px">
  <col style="width: 80px">
  <col style="width: 80px">
  <col style="width: 80px">
  </colgroup>
  <thead>
    <tr>
      <th class="tg-0pky" colspan="2" rowspan="2"></th>
      <th class="tg-baqh" colspan="2">Odd</th>
    </tr>
    <tr>
      <th class="tg-0lax" style="font-weight: normal;">Heads</th>
      <th class="tg-0lax" style="font-weight: normal;">Tail</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-nrix" rowspan="2">Even</td>
      <td class="tg-0lax">Heads</td>
      <td class="tg-0lax"><strong>+5</strong>, -1</td>
      <td class="tg-0lax">-1, +1</td>
    </tr>
    <tr>
      <td class="tg-0lax">Tails</td>
      <td class="tg-0lax">-1, +1</td>
      <td class="tg-0lax">+1, -1</td>
    </tr>
  </tbody>
</table>

It would appear to behoove the Even player to try to play Heads as much as possible, but Odd knows this as well.  Enter the spiral of inductive reverse psychology!  Or, simply compute the Expected Utility for each player to determine at what frequency each player should play either strategy, yielding the following mixed strategy:

$$
\begin{aligned}
  \mathbb{E}[u_{\text{Even}}(\text{Heads})] &= 5x - 1(1-x) \\
  \mathbb{E}[u_{\text{Even}}(\text{Tails})] &= -1x + 1(1-x) 
\end{aligned}
$$

where $x$ is the probability of the opponent choosing odd.  The total frequency that they _play any move at all_ must sum to 1, so each of these equations must be equal. Thus:

$$
\begin{aligned}
  5x - 1(1-x) &= -1x + 1(1-x) \\
  8x &= 2 \\
  x &= \frac{1}{4}
\end{aligned}
$$

Similarly, for the Odd player we have:

$$
\begin{aligned}
  \mathbb{E}[u_{\text{Odd}}(\text{Heads})] &= 1y - 1(1-y) \\
  \mathbb{E}[u_{\text{Odd}}(\text{Tails})] &= -1y + 1(1-y) 
\end{aligned}
$$

Trivially yielding a frequency of $\frac{1}{2}$.

Note that this means the change in Even's payoff affects _Odd's_ strategy, and not the other way around!  Indirectly, it might seem like Even ought adjust his strategy, or perhaps introduce noise into his selection frequency, but this is actually irrelevant (or even incorrect) when the game is played ad infinitum as: 

1. Odd is a rational agent who is not susceptible to psychological warfare, and 
2. any selection frequency that doesn't converge on the the frequency needed to achieve the expected utility above does not maximize utility and is therefore a _losing strategy_.

Even's best bet at this point is to flip his coin and present it to Odd!

### <a name="pdi" class="n"></a> 6. Iterated Prisoners' Dilemma 

Mind the apostrophe^^ the implication of iteration gives way to cooperation, hence the dilemma is shared between both players. 

In any ***iterated*** game, where players are allowed to have repeated interactions with their opponent (or soon-to-be ally), strategies necessarily change, as we'll see in the next section about agents.  If two (or more) agents are able to play the same game over and over and over, learning one another strategies or strategy distributions.  Crucially, if the number of games to be played in a series is known, then each presumably rational agent is able to find a dominant, degenerate strategy.

I.e. 

> $P_1$: "I will cooperate with $P_2$ until the second to last game at which point I will back stab her to maximize my utility."

> $P_2$: "I suspect $P_1$ will back stab me on the second to last game, so I must preempt this strategy by betraying her on the third-to-last game."

> $\vdots$

> $P_1$: "But if she suspects that I suspect that she suspects that I suspect,,, then I should just go mask off and stab $P_2$ in the face right now!!"

and so on until we're back to square one.  However, if the number of games to be played is not known, then this backwards induction can no longer be applied effectively.  Interestingly enough, cooperation can organically and rationally be achieved in the iterated prisoners' dilemma. [Numerous meta-strategies](https://en.wikipedia.org/wiki/Prisoner%27s_dilemma#Strategy_for_the_iterated_prisoner's_dilemma) arise from iterated contexts which you've likely heard of including.
  
## <a name="agents" class="n"></a> Types of Agents

Most Game Theory takes place under the umbrella of Economic theory which assumes rational agents called ***Homo Economicus*** whose utility function is focused on maximization of self-interest.  That's not to say that his utility function couldn't be altruistically oriented, but, inductively, he is a rube as you may be able to discern in this awesome simulation about the [Christmas Truce](https://ncase.me/trust/), which outlines a variety of different strategies.

- Incidentally, the above simulation defines Zero-sum and Non-zero Sum quite eloquently:
  - **Zero-sum**: "This is the sadly common belief that a gain for "us" must come at a loss to _them_, and vice versa."
  - **Non-zero Sum**: "This is when people make the hard effort to create a win-win solution! (or at least, avoid a lose-lose) Without the non-zero-sum game, trust cannot evolve."

Homo Economicus is loosely derived from Hobbes' grim State of Nature depicted in _Leviathan_:

> _Bellum omnium contra omnes_.

David Hume's _Treatise of Human Nature_ published just under a century later paints a slightly less brutal image of human nature in which repeated (iterated) interactions between agents in the state of nature can give way to a compassionate society, yielding the model of ***Homo Sociologicus***.  This is, again, a rather vast over simplification of two of the most influential texts on Game Theory.

## <a name="formalizing" class="n"></a> Formalizing Game Theory

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

## <a name="linear-programs" class="n"></a> Linear Programs

A linear program is defined by a set of real-valued variables, a linear objective function (weighted sum of the variables), and a set of linear constraints.

- $X$ is a set of real-valued variables $\{x_1, ..., x_n\}$ with each $x_i \in \Reals$.
- $W$ is a a set of corresponding  constraints $\{w_1, ..., w_n \}$
- $J$ is a linear objective function given by 

$$
\begin{aligned}
  J = \max \displaystyle\sum_{i=1}^n w_i x_i
\end{aligned}
$$

This formulation can just as easily be used for minimization problems by negating all the weights in the objective function.  The constraints express the requirement that $J$ must be greater than (or less than, depending on the direction of optimization) must be some constant:

$$
\begin{aligned}
  J = \max \displaystyle\sum_{i=1}^n a_{ij}x_i \gtreqless b_j
\end{aligned}
$$

If we have $m$ constraints, we can construct a Linear Program as such:

$$
\begin{aligned}
   \max \displaystyle\sum_{i=1}^n w_i x_i
\end{aligned}
$$

Subject to

$$
\begin{aligned}
  \max \displaystyle\sum_{i=1}^n a_{ij}x_i &\leq b_j, \quad \forall j = 1 ... m \\
  x_i &\geq 0, \quad \forall i = 1 ... n
\end{aligned}
$$

---

Linear Programs can also be expressed in matrix form as follows:
- Let $\mathbf{w}$ be an $n \times 1$ vector containing the weights $w_i$
- Let $\mathbf{x}$ be an $n \times 1$ vector containing the variables $x_i$
- Let $\mathbf{A}$ be an $m \times n$ matrix of constants $a_{ij}$
- Let $\mathbf{b}$ be an $m \times 1$ vector of constants $b_{j}$

We then have 

$$
\begin{aligned}
  \max \mathbf{w}^\top \mathbf{x}
\end{aligned}
$$

Subject to

$$
\begin{aligned}
  \mathbf{Ax} \leq \mathbf{b} \\
  \mathbf{x} \geq 0 
\end{aligned}
$$

In some cases, we may merely have a satisfaction or feasibility problem rather than an optimization problem.  In this case, our objective function can be empty, or just the trivial solution. 

Finally, every Linear Program has a corresponding **dual** which shares the same optimal solution. E.g.:

$$
\begin{aligned}
  \min \mathbf{b}^\top \mathbf{y}
\end{aligned}
$$

Subject to

$$
\begin{aligned}
  \mathbf{A}^\top\mathbf{y} \geq \mathbf{w} \\ 
  \mathbf{y} \geq 0
\end{aligned}
$$

Here, our variables are $\mathbf{y}$, and they switch places with the constraints.  Note that there is one $y \in \mathbf{y}$ in the dual for every constraint from the _primal_ (original) problem, and vice versa.

The set of feasible solutions to Linear Programs corresponds to a convex polyhedron in $n$-dimensional space.  Because all of the constraints are necessarily linear, they correspond to hyperplanes in this space (that is, planes with $n-1$ dimensions), so the set of all feasible solutions is the region bounded by all hyperplanes.  Because $J$ is also linear, we can glean two useful properties:

1. Any _local_ optimum in the feasible region will be a global optimum in this space
2. At least one optimal solution will exist at a vertex of the polyhedronic solution space.  Further, there could be multiple along an edge, or a face of the polyhedron.  

One means of identifying such a vertex is known as the 

### <a name="simplex" class="n"></a> Simplex Algorithm
At a high level, the algorithm is pretty straight forward:
1. Identify a vertex of the polyhedron
2. Take an uphill (objective-improving) step to neighboring vertices until an optimum is found.

This approach is exponential in the worst case, but empirically very efficient.

![](/images/game-theory-1.png)

Additionally, the hyper-constraint that the variables must be integers gives way to combinatorial optimizations like [SAT](/blog/algorithm-notes#ch12).

Notably **binary integer problems are sufficient to express any problem in NP**:

$$
\begin{aligned}
   \max \displaystyle\sum_{i=1}^n w_i x_i
\end{aligned}
$$

Subject to

$$
\begin{aligned}
  \max \displaystyle\sum_{i=1}^n a_{ij}x_i &\leq b_j, \quad \forall j = 1 ... m \\
  x_i &\in \{0, 1\}, \quad \forall i = 1 ... n
\end{aligned}
$$

### Example

Let's take a look at a trivial, but concrete [example](https://realpython.com/linear-programming-python/):


We have our objective function $Z$:

$$
\begin{aligned}
  \max Z = x + 2y
\end{aligned}
$$

Subject to the following constraints:

$$
\begin{aligned}
  \textcolor{red} 2&\textcolor{red}{x +} &\textcolor{red}{y} &\textcolor{red}{\leq 20} \\
  \textcolor{blue}{-4}&\textcolor{blue}{x + }&\textcolor{blue}{5y }&\textcolor{blue}{\leq 10 }\\
  \textcolor{green}-1&\textcolor{green}{x + }&\textcolor{green}{2y} &\textcolor{green}{\geq -2} \\
  x &\geq 0 \\
  y &\geq 0 \\
\end{aligned}
$$

Here, the gray region is our polyhedron or feasible solution space, and by selecting any vertex and walking to another, we can identify an optimum.

![](/images/game-theory-2.png)

---

## The Lagrangian

Analytically, we can solve such optimization problems using the Lagrangian, which is a method used to directly solve constrained optimization problems by reformulating them as _unconstrained_.  Starting first with Lagrange multipliers, we can then unify the steps of that process into the generalized Lagrangian expression proper which is more easily computable.

Consider the following problem:

$$
\begin{aligned}
  \text{maximize} \; &f(x,y) = x + y\\
  \text{subject to} \; &x^2 + y^2 = 1
\end{aligned}
$$

This problem can be visualized as follows, where the red lines depict our object function, and the blue concentric circles being the constraints, with the innermost circle being the particular constraint $x^2 + y^2 = 1$ 

![](/images/game-theory-1-L1.png)

We can reason ourselves to the conclusion that the optimal $(x,y)$ solution lies at $(\frac{1}{\sqrt{2}}, \frac{1}{\sqrt{2}})$ on the unit circle (which can be exhaustively verified, if not proven by plotting any other pair of coordinates within the constraint to see that they produce lower results).  Furthermore, the minimum lies at the negative conjugate <!-- (TODO: make sure this is what that means) --> $(-\frac{1}{\sqrt{2}}, -\frac{1}{\sqrt{2}})$.

![](/images/game-theory-1-L2.png)

We can observe that, for any extrema along the constraint, our objective function will be tangent to the constraint.  With this useful piece of information, we can restate our initial question to be the following: _Find all locations where the gradient of the objective function and constraint are proportional_; this will be our solution.

We can form a system of equations to solve this problem, starting with:

$$
\nabla f(x,y) = \lambda \nabla g(x,y)
$$

where $g$ is our constraining function, and $\lambda$ is some proportionality coefficient called the Lagrange multiplier.

Expanding this equation and substituting the example definitions in our problem, we get:

$$
\begin{aligned}
\nabla (x+y) &= \lambda \nabla (x^2 + y^2) \\
{1 \brack 1} &= \lambda {2x \brack 2y}
\end{aligned}
$$

To solve, we need the third equation: $x^2 + y^2 = 1$, given in the problem statement, which yields the familiar points: 

$$
(\frac{1}{\sqrt{2}}, \frac{1}{\sqrt{2}}), (-\frac{1}{\sqrt{2}}, -\frac{1}{\sqrt{2}})
$$

and plugging them into our objective function confirms that the former point is the maximum that we're looking for.

This method enabled us to solve constrained optimization problems easily, but it's cumbersome to make a computer replicate this process.  To streamline the approach, we'll take our system of equations unify all the necessary information into a single expression – **The Lagrangian**:

$$
\mathcal{L}(x,y,\lambda) = f(x,y) - \lambda(g(x,y) - b)
$$

where $b$ is the right hand side of the constraint, in our case $1$.  To replicate the method of Lagrange multipliers shown above, we simply set the gradient of the Lagrangian to 0, and solve for its constituent variables:

$$
\begin{aligned}
  \nabla \mathcal{L} &= 0\\

  \begin{bmatrix}
   \frac{\partial \mathcal{L}}{\partial x}  \\[6pt]
   \frac{\partial \mathcal{L}}{\partial y} \\[6pt]
   \frac{\partial \mathcal{L}}{\partial \lambda} 
  \end{bmatrix} & = 
   \begin{bmatrix}
   0 \\ 0 \\ 0
  \end{bmatrix} \\
  
  \begin{bmatrix}
   \frac{\partial f}{\partial x} - \lambda \frac{\partial g}{\partial x} \\[6pt]
   \frac{\partial f}{\partial y} - \lambda \frac{\partial g}{\partial y} \\[6pt]
   -g(x, y) + b
  \end{bmatrix} & = 
   \begin{bmatrix}
   0 \\ 0 \\ 0
  \end{bmatrix} \\

  \begin{bmatrix}
   \frac{\partial f}{\partial x} \\[6pt]
   \frac{\partial f}{\partial y} \\[6pt]
   g(x, y) + b
  \end{bmatrix} & = 
   \begin{bmatrix}
   \lambda \frac{\partial g}{\partial x} \\[6pt]
   \lambda \frac{\partial g}{\partial y} \\[6pt]
   b
  \end{bmatrix} \\
\end{aligned}
$$

which matches the same set of equations manually constructed with Lagrange multipliers.  Therefore, it can be applied to any problem of the form

$$
\begin{aligned}
  \text{maximize/minimize} \; &f(x,y, ...) \\
  \text{subject to} \; &g(x, y, ...) = b
\end{aligned}
$$

---

### Example

Putting this all together, two-player Zero-sum Games have Nash Equilibria which can be expressed as a linear program, meaning the solution can be found in polynomial time. Given a game 

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

Note that all the utility terms $u_i(\cdot)$ are constant in the Linear Program while the mixed strategy terms $s_2^{(\cdot)}$ and $u_1^*$ are variables.

Constraint (1) says means that for every pure strategy $j$ of $P_1$, his expected utility for and $j \in A_1$ given $s_2$ is at most $u_1^*$: the optimal strategy.

For $j = u_1^*$, those will be in $P_1$'s best response set.

$P_2$ is subject to the same constraint, and the Linear Program will select $s_2$ in order to minimize $u_1^*$.  $P_2$ selects the mixed strategy that minimizes the utility $P_1$ can gain by playing his best response.

Constraint (2) ensures that $k$ is a well defined (or able-to-be-interpreted) non-negative probability (though reframing a problem with negative values into a probability is trivial via normalization).  As mentioned early, the dual of this program can just as easily yield $P_1$'s mixed strategy by flipping all mentions of $_1$ with $_2$ and attempting to maximize $u_1^*$


--- 

To reach equilibrium rather than optimization, we introduce **slack variables**: $r_1^j$ for all $j \in A_1$ and replacing the inequality constraints with equalities:

$\min u_1^* \text{ subject to: }$

$$
\begin{aligned}
  \tag{3} \displaystyle\sum_{k \in A_2} u_1(a_1^j, a_2^k) \cdot s_2^k + r_1^j = u_1^* \quad \forall j \in A_1 \\ 
\end{aligned}
$$

$$
\begin{aligned}
 \tag{4} &\displaystyle\sum_{k \in A_2} s_2^k = 1
\end{aligned}
$$

$$
\begin{aligned}
         &s_2^k \geq 0 \quad \forall k \in A_2 \\
 \tag{5} &r_1^j \geq 0 \quad \forall j \in A_1 \\
\end{aligned}
$$

This is a general equivalent form of the first Linear Program since (5) requires only that each slack variable is positive, and the requirement of equality in (3) is equivalent to the inequality constraint in (1).

---

### <a name="ppad" class="n"></a> PPAD

Two-player General-sum Games are notably more challenging since the problem can longer be expressed as an optimization problem between tow diametrically opposed players.  Furthermore, no know [reduction](/blog/algorithm-notes#ch12) exists from this problem to an NP-Complete decision problem.  

Computing a sample Nash Equilibria relies on a different complexity class which describes the problem of finding a solution which always exists.  This complexity class is known as **Polynomial Parity Argument, Directed** (PPAD).  

Define: A family of directed graphs $\mathcal{G}(n)$ with each member of this family being a graph defined on a set $N$ of $s^n$ nodes.  Though each $G \in \mathcal{G}(n)$ contains a number of nodes that is exponential in $n$, we want to boil this down to graphs that can be described in polynomial space.  To do this, we encode the set of edges in a given graph as follows (with no need to encode the nodes, since they hold no value):

- Let $\underline{P}arent : N \mapsto N$ and
- $\underline{C}hild: N \mapsto N$ 

be two functions that can be encoded as arithmetic circuits with sizes polynomial in $n^2$.  For every such pair of $P, C$ functions, let there be one graph $G \in \mathcal{G}(n)$ provided that $G$ satisfies the restriction that there _must_ be one node: $\odot \in N$ zero parents.  Given such a graph $G$, an edge exists from node $j \rarr k$ <u>iff</u>: $P(k) = j$ and $C(j) = k$.  We then have an exhaustive list of cases:
- zero parents, or one parent
- zero children, or one child

Per theorems of in- and out-degrees of the nodes in $G$, we know that each node is either part of a cycle, or part of a path from a parent less source $\mathcal{S} \rarr$ to a childless sink $\mathcal{T}$.

Returning to PPAD, this is a class of problems which can be reduced to finding either a sink or a source other than $\odot$ for a given $G \in \mathcal{G}(n)$.  

As claimed earlier, such a solution always exists.

Proof: Because $\odot$ is a source, there must be some sink $\mathcal{T}$ which is either a descendant of $\odot$ or _is_ $\odot$ itself. 

Theorem: The problem of finding a sample Nash Equilibria of a general-sum finite game with two or more players is PPAD-Complete.

Similar to proving NP-Completeness, the proof for this theorem can be achieved by showing that the problem is in PPAD and that any other problem in PPPAD is isomorphically reducible to it in polynomial time.

## <a name="further-reading" class="n"></a> Further Reading 

Gaus, Gerald F. "On Philosophy, Politics, and Economics," _University of Arizona_, 2008. 

Moehler, Michael. "Why Hobbes' State of Nature is Best Modeled by an Assurance Game," _Utilitas_ Vol. 21 No. 3,  pp. 297-326, 2009, https://philpapers.org/rec/MOEWHS

Shoham, Yoav and Kevin Leyton-Brown. "Multiagent Systems: Algorithmic, Game-Theoretic, and Logical Foundations. [Link](http://www.masfoundations.org/mas.pdf)

Karlin, Anna R. and Yuval Peres. ["Game Theory, Alive."](https://homes.cs.washington.edu/~karlin/GameTheoryBook.pdf) 2015.

[Coding the Simplex Algorithm from scratch using Python and Numpy](https://medium.com/@jacob.d.moore1/coding-the-simplex-algorithm-from-scratch-using-python-and-numpy-93e3813e6e70)
