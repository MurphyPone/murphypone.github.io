---
title: "Digest: Magic: the Gathering is Turing Complete"
date: "2021-03-05"
description: "Daniel's Knowledge, TERRIBLE TURING MACHINES SEASON 2 BABY!!"
path: "/blog/mtg-turing-complete"
---

## Preface

This post aims to summarize the 900 IQ construction of a Turing Machine using Magic: the Gathering (MTG) mechanics described in the paper [_Magic: the Gathering_ is Turing Complete](https://arxiv.org/pdf/1904.09828.pdf) authored by Churchill, Biderman, and Herrick.

> In this paper we show that optimal play in real-world _Magic_ is at least as hard as the Halting Problem, solving a problem that has been open for a decade. To do this, we present a methodology for embedding an arbitrary Turing machine into a game of _Magic_ such that the first player is guaranteed to win the game if and only if the Turing machine halts. Our result applies to how real Magic is played, can be achieved using standardsize tournament-legal decks, and does not rely on stochasticity or hidden information. Our result is also highly unusual in that all moves of both players are forced in the construction. This shows that even recognising who will win a game in which neither player has a non-trivial decision to make for the rest of the game is undecidable.

## Embeddings, Universal Turing Machines

Before we jump into the nitty gritty of the construction, we need to define some language to describe Turing Machines and their applications.

- For our (and the authors') purposes, an **embedding** is an arrangement of a subset of rules of a system such that they simulate the workings of a Turing Machine.

Additionally, we'll define that **Universal Turing Machine** (UTM) is a special kind of Turing Machine which can simulate other Turing Machines.  It can perform any computation that any other computer program can perform given the right inputs.

- If you can embed a UTM into a system, it means that your system is capable of simulating any other computer.  Furthermore, it means your system can perform any computable task.

A UTM is a [Finite State Machine](https://en.wikipedia.org/wiki/Finite-state_machine#Example:_coin-operated_turnstile) with a read and write head, an infinitely long tape broken up into cells, and a controller.  By moving along the tape, reading and writing symbols, a UTM can emulate (or rather, it _is_ by definition) a Finite State Machine. These two capacities are sufficient to describe any (non-quantum) computer that we would typically use.

While there are several different configurations of UTMs, this paper employs a specific variety described by [Yurii Rogozhin](https://doi.org/10.1016/S0304-3975(96)00077-1) called a $UTM(2,18)$.  The arguments here mean that the UTM has 2 states, and 18 symbols.

- The **Church-Turing Thesis** states: 

>  a function on the natural numbers can be calculated by an effective method if and only if it is computable by a Turing machine.

running time not withstanding.

## The Halting Problem

- The **Halting Problem**, proved to be unsolvable in general by Turing states that: 

> From a description of an arbitrary computer program and an input, whether the program will finish running, or continue to run forever. A general algorithm to solve the halting problem for all possible program-input pairs cannot exist.

One such example of the Halting Problem is **Goldbach's Conjecture** which states that every even whole number greater than 2 is the sum of two prime numbers. Alternatively, every integer can be expressed as the sum of primes. It remains a conjecture since we _cannot_ prove that it is true.

$$
\begin{aligned}
47  &= \underbrace{40}_{ \tt{prime?} ❌} + \underbrace{7}_{ \tt{prime?} ✅} \\
48  &= \underbrace{41}_{ \tt{prime?} ✅} + \underbrace{7}_{ \tt{prime?} ✅} 
\end{aligned}
$$

But can we determine if the program to determine if this conjecture is true ever _halts_?

Consider some program $H$ which determines if another program halts e.g. 

$$
\begin{aligned}
    H: (A, \bullet) \rightarrow \{True, False\}
\end{aligned}
$$

Where $A$ is some other program, and $\bullet$ are arbitrary arguments for $A$. For example, $A$ could be another Turing Machine with arguments which could be symbols on a tape.  

Turing proved that such a program $H$ _does not exist_.  Suppose you have some other program:

$$
\begin{aligned}
    \overline{H}: (A, \bullet) \rightarrow \{True, False\}
\end{aligned}
$$

which tells you the _opposite_ of $H$.  So, if $H$ is true, and its input program $A$ halts, then $\overline H$ runs forever.  But if $H$ does not halt, then $\overline H$ terminates immediately.  What would happen if we gave $\overline{H}$ itself as the input: 

$$
\begin{aligned}
    \overline{H}(\overline{H}, \bullet) = ???
\end{aligned}
$$

- If $\overline{H}$ runs forever on $\overline{H}$, then $H(\overline{H})$ must have halted
- Otherwise, if $\overline{H}$ halted, then $H$ must have run forever

But how can we tell that $H$ ran forever? That means that $\overline{H}(\overline{H})$ both halted _and_ ran forever ⚔️.



Okay, so how does this all come together and what the heck does it have to do with _Magic_? 

## Finally, _Magic_

I'd preface this by saying I have not played _Magic_ myself since I was at Scout camp nearly a decade ago and I got stomped, [here's a 5 minute breakdown of how the game is played](https://youtu.be/RZyXU1L3JXk?t=30).

MTG is a popular, famously complicated tabletop card game.  A simple premise of _Magic_ is that each card that can be played changes or breaks the initial rules in some interesting way.

There are two basic types of cards:

- **Creatures** which have a subtype, _power_/_toughness_ stats (ATK/DEF), as well as some flavor text describing the modification of the rules to be enacted once the creature enters play
- **Land** mana to cast your spells. There are 5 types, or colors, of land

Most cards are spells, playable via the mana available to a player on their turn.  Once a card has been used, it becomes tap'd (making it unavailable for the rest of their turn, pending other rules).  After a combat interaction, dead creatures go to a graveyard after a stat comparison (_power_/_toughness_).

For the sake of the paper, combat encounters are irrelevant to the UTM, but creatures' stats, which are modifiable by other cards, are the gateway to the central proof.

The authors are trying to embed a UTM into _Magic_ to gain access to the halting problem and everything that accompanies it.

They use the aforementioned Rogozhin $UTM(2,18)$ which is sort of a minimum viable project to simulate _any computer in the world_ (non-quantum). Rogozhin's $UTM(2,18)$ has two states $\{ q_1, q_2 \}$ where $q_i$ is a transition between states involving all or none of the options available to a Turing Machine: read, write, move.  Additionally the 18 states are:

$$
\begin{aligned}
  \big\{\overleftharpoon{1}, 1, \overrightharpoon{1}, \overleftharpoon{1}_1, \overrightharpoon{1}_1, 
        b, \overleftharpoon{b}, \overrightharpoon{b}, 
        \overleftharpoon{b}_1, \overrightharpoon{b}_1,
        b_2, b_3,
        c, \overleftharpoon{c}, \overrightharpoon{c},
        \overleftharpoon{c}_1, \overrightharpoon{c}_1,
        c_2
     \big\}
\end{aligned}
$$

All these don't really matter, the point is that we can represent them using _Magic_ cards.

It's important to note that some games are obviously Turing Complete, like Minecraft.  However, MTG is _notably_ not intentionally Turing Complete.

Now, the authors assert that it is possible to compute the _next_ board state given the current board state and a legal move:

$$
\begin{aligned}
  f: (\text{board state, legal move}) \rightarrow \text{next board state}
\end{aligned}
$$

However, given the nature of MTG, there is no trivial $\tt is\_legal(move, board\_state)$ function or check. The authors acknowledge that previous work has shown that, working cooperatively (and making known, legal moves), players can construct a Turing Machine, but it is far more interesting to show that in a limited, competitive game, it is not possible to predict how a game will end.

## Construction

The authors introduce our two arch-nemeses: Alice and Bob along with the 3 elements of a Turing Machine that need to be mapped to the game of Magic: the tape, controller, and read/write head.

The tape is intuitively challenging to embed since there are no geometric or physical metrics present in the game.  All we have in a game of _Magic_ are stats, counters, modifiers, etc.

Nonetheless, _lots_ of creatures, organized by color (with $\color{#0C0} \text{green}$ to the left of the head, and $ \overbrace{\color{#FFF}\text{white}}^{lol}$ to the right) yields a directional notation.

The origin of the tape starts is a Rotlung reanimator (2/2) and the read/write head of the Turing Machine is _lethal_ as, in order to traverse the tape, it must slay a creature. 

Expanding outwards in either direction from the 2/2 origin are 3/3, 4/4, ..., n/n creatures. The board might look something like this:

$$
\begin{aligned}
    \color{#0C0} (n/n) , ... ,(4/4), (3/3), \color{#000} \underbrace{(2/2)}_{head}, \color{#BBB} (3/3), (4/4), ..., (n/n)
\end{aligned}
$$

The authors select 18 creature types to correspond to Rogozhin's $UTM(2,18)$ symbols. Notably, each of these 2/2 creatures spawns a another one of the 18 symbolic creatures upond death.  (NATO hates them, check out how these three computational theory researchers destroyed the standard phonetic alphabet):

![](/images/mtg-1.png)

The authors map the controller using black cards, like the Rotlung Reanimator whose flavor text reads: 

> Whenever Rotlung Reanimator or another Cleric is put into a graveyard from play, put a 2/2 black Zombie creature token into play.

this card represents the origin of the board.

![](https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=39640&type=card)

Some cards, like Artificial Evolution modify the text of other cards, for example: duplicate the Rotlung Reanimator, and modify its flavor text: 

![](https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=39923&type=card)

Using a slew of other cards, the authors demonstrate how it is possible to map the 3 key properties of UTM: a read/write head, a tape, and the ability to change state via the controller.

Computation begins as follows: 

> At the beginning of a computational step, it is Alice’s turn and she has the card Infest in hand. Her library consists of the other cards she will cast during the computation (Cleansing Beam, Coalition Victory, and Soul Snuffers, in that order). Bob’s hand and library are both empty. The Turing machine is in its starting state and the tape has already been initialised.

![](https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=179424&type=card)

When Alice casts Infest (-2/-2) it kills all 2/2 creatures which, as we noted above, is just the origin of our tape (which happens to belong to Bob, RIP). 

> This kills one creature: the tape token at the position of the current read head, controlled by Bob. This will cause precisely one creature of Bob’s to trigger – either a Rotlung Reanimator or a Xathrid Necromancer... This Reanimator or Necromancer will create a new 2/2 token to replace the one that died. The new token’s creature type represents the symbol to be written to the current cell, and the new token’s colour indicates the direction for the machine to move: white for left or green for right.


Upon casting Infest, the center card at the head of the tape dies, but in order to traverse the tape, we must add a +1/+1 and -1/-1 buff and debuff respectively to the current and adjacent creature in order to move, as well as all $2n$ other creatures on either side as well... 

This is cleverly accomplished by modifying creatures of a specific color.  

> On Alice’s second turn, she casts Cleansing Beam, which reads “Cleansing Beam deals 2 damage to target creature and each other creature that shares a color with it.”

![](https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=430297&type=card)

> On the last turn of the cycle, Alice casts Soul Snuffers, a 3/3 black creature which reads “When Soul Snuffers enters the battlefield, put a −1/−1 counter on each creature.”

![](https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=142054&type=card)

> To ensure that the creatures providing the infrastructure (such as Rotlung Reanimator) aren’t killed by the succession of −1/−1 counters each computational step, we arrange that they also have game colours green, white, red and black, using Prismatic Lace, “Target permanent becomes the color or colors of your choice. (This effect lasts indefinitely.)” Accordingly, each cycle Cleansing Beam will put two +1/+1 counters on them, growing them faster than the −1/−1 counters shrink them.

In this way, Cleansing Beam and Soul Snuffer effectively facilitate the movement of the head across the tape. 

The full construction includes details about several other cards which Alice and Bob possess in order to maintain the infrastructure prevented, but the embedding is hopefully clear at this point.  

Using almost entirely arbitrary information present with MTG, along with Rogozhin's UTM(2,18) in order to "compute" a program , the authors showed that the outcome of a game of _Magic_ is non-computable.  this is accomplished by importing everything we described about the Halting problem earlier. 

It's important to distinguish between the outcome being simply non-deterministic versus non-computable.  Non-deterministic outcomes _are_ computable (albeit hindered by combinatorically exploding possibilities), whereas the outcome here is **not even in principle a question that we can ask in a way that makes it computable**.

