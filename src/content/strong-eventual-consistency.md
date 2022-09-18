---
title: "42 | Strong Eventual Consistency"
date: "2022-09-23"
description: "punk rock, conflict free data types"
path: "/blog/strong-eventual-consistency"
---

<style>
    a.eventually {
        background:
            linear-gradient(
            to right,
            rgba(100, 200, 200, 1),
            rgba(100, 200, 200, 1)
            ),
            linear-gradient(
            to right,
            rgba(255, 0, 0, 1),
            rgba(255, 0, 180, 1),
            rgba(0, 100, 200, 1)
        );
        background-size: 100% 3px, 0 3px;
        background-position: 100% 100%, 0 100%;
        background-repeat: no-repeat;
        transition: background-size 400ms;
    }

    a.eventually:hover {
        background-size: 0 3px, 100% 3px;
    }

     a.eventually:hover::before {
        transform-origin: left;
        transform: scaleX(1);
    }

    .my-link {
        text-decoration-color: #6666ff;

    }
    .my-link:hover {
        background: #6666ff;
        cursor: pointer;
        animation-name: colorTransition;
        animation-duration: .5s;
    }
</style>

# An Introduction to the Album

Perhaps the most important part of a post-emo song is its totally incomprehensible song title.  Not the arrangement, lyrics, unique tuning. No, it's the title which must be devoid of any relation to the contents or meaning of the song itself.  

When viewed at a glance, any punk rock<sup>†</sup> tracklist worth its salt ought to be jarring, immersion-breaking, and puzzlingly disparate from message of the song, if any such meaning is even forthcoming.  But, over time, ~<a class="eventually">eventually</a>~ this pattern becomes an appreciable aesthetic touch, and strongly enough so that the zany titles become integral to the eidetic essence of an album or sequence of songs.  To borrow the language of the papers discussed later on, the song titles are _consistently_ offputting, with several bands appearing to pride themselves on incoherent discographies, which converge on a reliably pleasant listening experience.

† - I know at least a few readers will take offense with my liberal blending of genres, but they're welcome to respond with their own blog post.[^1]

The analogy for the actual subject matter of discussion for this post kind of fizzles out here, but I'm going to lean into it regardless, trying (and failing) to draw connections between red-herring titles and conflict resolution in distributed systems.

I actually had no strong motivation to write about <a class="eventually">eventually</a> consistent data types.  I thought it would be a [_quirky_ playlist name](https://open.spotify.com/playlist/64Y5zggBiEtmVH6cLhg5mc?si=201fa627eb3048dc), based on a phrase I vaguely remember reading several years ago in a paper about ¿key-value stores? or something like that.  But I couldn't remember their significance, nor how they worked.  So, naturally, I've spent the past couple weeks re-familiarizing myself with that paper, leapfrogging to contemporary developments, and naaturally convinving myself that I understand conflict resolution as thoroughly as a hostage negotiator. This is the result of that rabbithole.

<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/64Y5zggBiEtmVH6cLhg5mc?utm_source=generator" width="100%" height="380" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>

# Scott Pilgrim v. My GPA

(The Byzantine Problem)

In distributed systems striving for <a class="eventually">eventual</a> consistency (definition forthcoming), The Byzantine Problem is an analogy describing the need for a resolution protocol for imperfect information or component failure.  Oftentimes, such protocols rely on consensus voting, proof of work, or prioritization of "leading" _trustworthy_ nodes in the system.  

A compromised component in a distributed system can stochastically exhibit symptoms of success and failure in completing whatever the distributed task is.  A _distributed task_ might be something along the lines of tallying views on a YouTube video,[^2] a simple fork-join task, or coordination of battle strategy against Ottoman combatants.

This presents the problem of isolating, or at the very least _mitigating_, the spread of compromised information to the rest of the system, and this introduces the measure of severity of such a breach to a system's integrity: **Byzantine Fault Tolerance** – the resilience of a system on the whole to such conditions.

In the titular metaphor, a group of generals must come to a consensus about whether to attack or to retreat.  Each component of the distributed system (commonly referred to as a **replica** in the literature) may have its own strategic preference or signal (in this example, $\mathbf{A}ttack$ or $\mathbf{R}etreat$ - though signals need not be binary in general).  To establish urgency in our hypothetical, we asssume that a coordinated attack or retreat by all the generals (the system on the whole) is favorale to a fractured mobilization as the result of miscommunication, where each general acts according to their own strategy rather than that of the whole army.

To complicate the situation, some generals may be selectively treacherous (probabilistically, intentionally, etc.  The Internet is a big place, and lots can go wrong), sending signal $A$ to some partition of their confederates, and signal $\mathbf{R}$ to the others in an attempt to sew chaos on behalf of the Turks. 

Additionally, as the army is physically separated (_distributed_) the integrity of their messages is at the whim of their messengers.  Messengers can be bribed, intercepted, or be UDP packets: they might not correctly reflect the intent of the sender, nor even be received.  Worse yet, they might not be _consistent_ in their success or failures, making this a _Byzantine_ problem.

## Words That Rhyme with Different, Etc.

(Characteristics of Byzantine Problems)

- A **Byzantine Fault** occurs if any component in the system presents different symptoms to different observers.
- A **Byzantine Failure** occurs if a system on the whole is compromised due to Byzantine Faults in a system where consensus is required.
- A **Byztantine Fault Tolerance** is achieved if non-faulty components have a majority agreement on strategy (or whatever the subject of consensus is).  "Majority," here, is also loosely defined.  Some systems need only reach 51% consensus to function properly (such as a blockchain), others might require a 2/3 super majority (like a different blockchain), and some might need perfect accuracy (like sales of a precisely controlled commodity).

Formally: Given a system of $n$ components, where $t < n$ components are truthful, as well as a peer to peer communication channel, whenever component $A$ tries to broadcast a value $X$, the other components are allowed to discuss with each other and verify the integrity of $A$'s broadcast, the system will <a class="eventually">eventually</a> settle on a common value $Y$.

Such a system is said to resist Byzantine Faults if $A$ broadcasts some value $x$ and:
1. if $A$ is truthful, then all components agree on the value $x$
2. in any case, all truthful components agree on the same consensus value $y$.

## i just want to kickflip into the sunset and disappear

(Trivial Solutions to the Coordination Problems )

A default initial value or assumed vote can be given to all null or missing messages from unresponsive (or faulty!) components deemed untrustworthy or unreliable.  Interpretation of the null value _can_ be prearranged by the constituents of a system.

- Such a prearrangement fails for the Byzantine since, not only can reaching consensus be prevented by incomplete or faulty signals with otherwise perfect knowledge of the system, but reaching consensus may be prevented about whether or not a component is faulty in the first place.

# Lvl. 2 Pidgey in a Masterball

(Solutions to Byzantine Problems)

The two primary solutions to Byzantine Problems I want to discuss here are Conflict-free Replicated Data Types (CRDTs)[^3] and more sophisticated conflict-resolving data structures called HashGraphs.

## J-Kobb Schlepper (My Dog At My Paypal Account)

(Intro to CRDTs)

CRDTs were developed in response to the existential problem posed by the need for <a class="eventually">eventual</a> consistency that cannot be ameliorated by angsty music alone. Instead we have this "simple, theoretically sound approach," covered at length in the original 2011 paper by Shapiro et al: "A comprehensive study of Convergent and Commutative Replicated Data Types."[^4]  CRDTs in general aim to do away with the need for reaching consensus.  In doing so, they indirectly address the Byzantine Problem by defining a protocol for _offline, stateful consensus_.  

In the offline scenarios specifically, if attempts are made to talk off-machine, we want to enqueue outbound messages and give reponses deadlines rather than throwing an exception wherever possible.  In the case where we cannot adhere to this rule, we need to gracefully handle the offline scenario. E.g., when talking to a centralized authorization service, a user may be locked out if we (acting as the Auth Service) can't verify their security access permissions due to a network outage.  Once we are again able to verify their requisite permissions, and a validity indow for the answer, we should cache the response to prevent a lapse in availability for them in the future.

![](/images/crdt-1.png)

It is not possible to come to consensus with a system that cannot be communicated with.  Even under a resolution protocol which uses default null values for missing votes as would be the case for outbound messages in the above offline example, only one side of the partition can be in the majority (Servers A and B), and the minority does not want to _lose_ its state outright.

It is fruitless to strive for agreement in such scenarios, but a consistent view of the past with distributed conflict resolution is achievable.  

A protocol like Paxos for achieving consenus involves seeking a majority vote of a _leader_, and voting on the next move that the state machine is to take.  On the event of a hopefully-exceptional network partition, updates propagating across the network need to terminate in the minority partition (Server C), lest the state be lost when the partition (hopefully) heals.

There are numerous drawbacks to this framework, the most obvious being the assumption that partitions are infrequent and/or brief.

## dragon ball z budokai tenkaichi 4

(Types of CRDTs)

According to the seminal paper, for replicas to return the same result for all query operations after such a partition is introduced, two conditions must be met:

- **safety**: If the causal history of replicas $i$ and $j$ is the same, the abstract state of these replicas must be equivalent
- **liveness**: If some element $e$ is in the causal history of $i$, then it will <a class="eventually">eventually</a> be in the causal history of $j$

Inductively, the pairwise <a class="eventually">eventual</a> consistency defined by these two poperties guarantees convergence for any non-empty subset of replicas contingent on the <a class="eventually">eventual</a> receipt of all updates.

## Fuck, Dantooine Is Big

(Example of a CRDT)

Suppose we have several servers spread across the world – in warzones, hotbeds of natural disaster, and other areas prone to network outages like my mom's basement whenever I hop on the sticks in Warzone: say Aleppo, Abescon, and Alexandria.

We have the simple task of utmost importance: track the highest value observed by any of the severs (my killstreak 😤 😤) across our shared database.  Our goal is to provide a protocol with properties of commutativity, associativty, and idempotency.  (this all sounds _awfully functional to me_).

In this trivial example, a merge function like $max(a,b)$ satisfies our needs.  Within each replica, if $a < b$, we can ignore, dismiss, discard value $a$ in favor of $b$.  After each update, a replica will broadcast to all its peers indicating that a new maximum value has been observed (loadout drop is inbound).  These updates will converge on the system's known maximum value.  This is similar to the common leader election algorithm, except in this case, the updates are continuous, whereas an election has a discrete _end_ once all votes are caster and tallied, wherease this system can always observe a new, higher value.

Each server keeps track of the highest observed value for itself _as well as_ for all other replicas, and updates those counters indexed by replica. For example, Server A's internal count might be:

```json
{
    "A": 11,
    "B": 20
}
```

and Server B, having received one final update from Server C before my dominance got the home router taken offline:

```json
{
    "A": 4,
    "B": 28,
    "C": 8
}
```

When A and B next communicate with one another, each will attempt to merge their respective states by taking the maximum value observed for the same key by two replicas:

```json
merge({ "A": 11, "B": 20}, { "A": 4, "B": 28, "C": 8}) 
= {
    "A": 11,
    "B": 28,
    "C": 8
}
```

## (Joe Gets Kicked Out of School for Using) Drugs With Friends (But Says This Isn't a Problem)

(More Formal Defintions)

There are two main categories of CRDTs:

- **commutative** - which rely on replicated operations – designed to commute
- **convergence** - which rely on replicating state, executing operations on a primary component

> In both cases, the higher order goal is to avoid the need for coordination by ensuring that actions taken independently can't conflict with each other and thusly can **be composed** at  later point in time [<a class="eventually">eventually</a>].

## Visited Salmon, I Mean Transit Balcony

(State-Based CRDTs)

State-Based CRDTs maintain replicated state across a distributed system via composable _Least Upper Bound_ functions which must be defined over their constituent data.  In the prior example, the $max(\cdot)$ function is a literal LUB, but our data will usually have a more complex structure than singular numbers.  

Formally, our set of data values together within a LUB-based partial order function forms a _join semilattice_[^5] where the "join" is a property of the LUB which govers how the lattices may be merged.  If values only ever increase, the lattice is monotonic, and said to be a CRDT. 

## Vanilla-Scented Laser Beams

(Operation-Based CRDTs)

This variety of object assumes a channel which maintains a linear ordering of message delivery to communicate between replicas.  Operations _**outside**_ of this delivery order are called "concurrent," and if they are commutative, than all operations consistent with the order of the deliver channel are equivalent, so the distributed state will be convergent across all replicas. 

## Hey Ken, Someone Methodically Mushed the Donuts

(Nuff Bout CRDTs – this would be an interlude)

CRDTs avoid the need for consensus by instead relying on definitions for behavior in light of conflicting observations.  

It's feasible to due away with git merge conflicts entirely if the version control system is treated as a CRDT with some rule which enforces a Least Upper Bound on the commit history.  For example, simply take the most recent provided timestamp of each conflicting event to be the "maximum."  This obviously doesn't work in practice, but it's possible.

#  Umbrellas and Beersocks

(The FLP Theorem)

Before diving into the advancements offered by HashGraphs, it's first worthwhile to survey problems of distributed consensus and pickup some useful terminology.  The most relevant to the discussion about HashGraphs which _do_ rely on consensus (_sort of_) being the eponymous Fischer-Lynch-Paterson Theorem introduced in "Impossibility of Distributed Consensus with One Faulty Process."[^6] 

The problem the authors present is that getting reliable, asynchronous procceses –amidst some faulty ones– to agree on _even just one_ binary value is very hard.  They note that every protocol in this asynchronous case can be a victim of possibile nontermination with _even just one_ faulty process.

The example problem instance they use is referred to as the "transaction commit problem" for a distributed database which is roughly similar to the aforementioned git merge conflict problem: all the database managers that have participated in processing a transaction must agree on whether or not to accept the transaction's results on the database.  

Whatever decision is made must be executed by all managers in order to maintain consistency across the replicas i.e. _consensus must be reached_.  If all of the managers are reliable, then the solution is trivial.  However, even **non**-Byzantine faults such as crashes, network partitions or outright failures, lost, distorted, and/or duplicate messages present problems for the trivial (arguably _naive_) scenario where replicas trust one another.  

The titular crux of the paper is that **no completely asynchronous protocol can tolerate even a single unnancounced process death**.  This constraint is so overbearing that the authors don't even grapple with the Byzantine complications, and further assume reliable message channels.  They make these nifty assumptions to show the fragility of distributed systems in general, conversely making their main theorem as widely applicable and robust as possible. 

The asynchronicity of the systems being considered is also integral to their asserted fragility. No assumptions are made about relative speeds of processes, or delays in their receipt.  Processes don't have access to a universal, synchronized clock, so timeout-based algorithms are not applicable.  Therefore, process death is indistinguishable from a slow process or high network latency.  

## Thrashville 1/3

(Model)

**Processes** are state machines with potentially infinitely many states which communicate via messages sent between each other.  In one discrete time step, a process may attempt to:
- Attempt to receive a message by performing a local computation as to whether an message was delivered to it 
- Send arbitrarily finite amounts of messages to other processes

If any truthy processes receive the message, then via an assumed _atomic broadcast capability_ (from the generous assumption of a reliable communication channel), all truthy processes <a class="eventually">eventually</a> will too.  In other words, every message is <a class="eventually">eventually</a> delivered as long as the other processes make sufficiently infinite attmpts to receive it. 

There's some lore on the matter:

> The asynchronous commit protocols in current use all seem to have a “window of vulnerability”- an interval of time during the execution of the algorithm in which the delay or inaccessibility of a single process can cause the entire algorithm to wait indefinitely. It follows from our impossibility result that every commit protocol has such a “window,” confirming a widely believed tenet in the folklore. 

A **Consensus Protocol** $P$ is an asynchronous system of $N \geq 2$ proccesses.

- Each process $p \in P$ has an input register $x_p$, an output register $y_p \in \{b, 0, 1\}$, and an unbounded amount of internal storage.
- Values in the input and output registers, together with the program counter and internal storage, comprise the **internal state** of a process.  
- **Initial States** prescribe fixed starting values for all but the input register.  The output register is initially set to $b$.
- **Decision States** are those in which the output register has a value of 0 or 1.
- $p$ acts deterministically according to a transition function which cannot change the value of the output register; $y_p$ is "write-once."
- **Messages** between processes are tuples of the form $(p, m)$ where 
  - $p$ is the target processes
  - $m$ is the message value in some alphabet $M$
- The **Buffer** is a multiset of messages that have been dispatched but not yet received, and supports two operations:
  - $send(p,m)$: places $(p, m)$ in the message buffer
  - $receive(p)$: may delete some message $(p,m)$ from the bufferif it exists and returns $m$, in which case we say that the message was delivered, otherwise it returns a special null marker $\varnothing$ indicating that the buffer was unchanged (and the process, message combination was not found)

The buffer can act non-deterministicallly (at the hands of non-truthy processes, perhaps), subject only to the condition that if $receive(p)$ is performed infinitely-many times, then the buffer is eventually emptied: all messages are delivered.  

A **Configuration** $C$ of the system $P$ is comprised of the internal state of each process, together with the contents of the message buffer.  

- An **Initial Configuration** is one in which each process starts at an initial state and the message buffer is empty.
- A **Step** takes one configuration to another via primitive step by a single process $p$ and occurs in two phases:
  - First, $receive(p)$ is performed on the message buffer in $C$ to obtain $m \in \{M \cup \varnothing\}$
  - Second, depending on $p$'s internal state $C$, as well as $m$, the process $p$ enters a new internal state and sends a finite set of messages to other processes.

Since processes are deterministic, the step is completely described by the event $e = (p, m)$ which can be thought of as receipt of $m$ by $p$.  We say $e(c)$ denotes the resulting config, or that $e$ can _be applied_ to $C$.
  - $(p, \varnothing)$ can always be applied to $C$, so it is always passible to take another step.  This event is the identity on $C$.  (are your categorical senses tingling yet?)

A **Schedule** from $C$ is a possibly infinite sequence of $\sigma$ events that can be applied in order, starting from $C$.  The associated sequence of steps is called a **run**.  If $\sigma$ is finite, $\sigma(C)$ is the resulting configuration, said to be _reachable_ from $C$.  We only need consider configurations accessible from some initial configuration. 

- Lemma: _Suppose that from some configuration_ $C$, _the schedules_ $\sigma_1, \sigma_2$ _lead to_ $C_1, C_2$ _respectively.  If the sets of processes taking steps in these schedules are disjoint, then_ $\sigma_1(C_2)$ _and_ $\sigma_2(C_1)$ _lead to the same configuration_ $C_3$

![](/images/crdt-2.png)

A configuration $C$ has **decision** value $v$ if some process $p$ is in a decision state such that $y_p = v$. 

A consensus protocol is said to be partially correct iff 
1. No accessibe configuration has more than one decision value
2. For each $v \in \{0,1\}$,[^8] some accessible configuation has decision value $v$

A process $p$ is **non-faulty** ("truthy") in a run provided that it takes infinitely many steps, and is **faulty** 🎩 otherwise.  A run is **admissable** provided that at most one process is faulty and all messages to the other truthy processes <a class="eventually">eventually</a> received.

The main theorem of the paper shows that every partially correct protocol for the consensus problem has some admissable run that is not a deciding run.  Therefore, _no consensus protocol it totally correct in spite of one fault._  

The rest of the the paper includes supporting lemmas and further stipulations about conditions of failure, which are all fascinating in their own right, but need not be replicated here.  

> A natural and important problem of fault-tolerant cooperative computing cannot be solved in a totally asynchronous model of computation. These results do not show that such problems cannot be “solved” in practice; rather, they point up the need for more refined models of distributed computing that better reflect realistic assumptions about processor and communication timings, and for less stringent requirements on the solution to such problems

# frankie thinks she's punk rock but she's just a POSER!!! (demo)

(Swirlds HashGraph – AKA _Solving the Problem in Practice_)

With the FLP Theorem in our back pocket, we are ready to confront the HashGraph approach to achieving fair, fast and Byzantine-Fault-tolerant conensus developed by Swirlds.  The distributed S/PaaS company published their white paper including proofs of the fault-tolerance of their HashGraph approach in 2016,[^9] and hot dayum it seems pretty cool.    

The abstract claims that their proposal for a new kind of replicated state machine

> achieves _fairness_, in the sense that it is difficult for an attacker to manipulate which of two transactions will be chosen to be first in the consensus order. It has complete asynchrony, no leaders, no round robin, no proof-ofwork, <a class="eventually">eventual</a> consensus with probability one, and high speed in the absence of faults. It is based on a gossip protocol, in which the participants don’t just gossip about transactions. They _gossip about gossip_. They jointly build a _hashgraph_ reflecting all of the gossip events. This allows Byzantine agreement to be achieved through _virtual voting_. Alice does not send Bob a vote over the Internet. Instead, Bob calculates what vote Alice would have sent, based on his knowledge of what Alice knows. This yields fair Byzantine agreement on a total order for all transactions, with very little communication overhead beyond the transactions themselves.

Whereas the authors of the FLP theorem offered generous assumptions about the _friendliness_ of the system at play, Swirlds assumes the opposite: that the system and its external conditions be as hostile as possible. The rhetorical purpose being the same – to prove the most robust form of applicability and/or correctness as possible.  They use a _strong_ definition of "Byzantine" to mean that just under $1/3$ of all components within the system can be adversaries colluding with one another, deleting or corrupting or delaying messages, who also can have **full control of the network** (and thus, the communication channel) with the same caveat offered by the FLP theorem, _that if a truthy component infinitely attempts to send a message to another component, it must be received <a class="eventually">eventually</a>_.

> The system is totally asynchronous. It is assumed that for any honest members Alice and Bob, Alice will <a class="eventually">eventually</a> try to sync with Bob, and if Alice repeatedly tries to send Bob a message, she will <a class="eventually">eventually</a> succeed. No other assumptions are made about network reliability or network speed or timeout periods. Specifically, the attacker is allowed to completely control the network, deleting and delaying messages arbitrarily, subject to the constraint that a message between honest members that is sent repeatedly must <a class="eventually">eventually</a> have a copy of it get through.

In spite of the FLP theorem above, the authors assert that their completely asynchronoush, nondeterministic HashGraph achieves consensus with a probability of 1.

They acknowledge other consensus algorithms like proof of work blockchains, and leader-based voting, as well as other Byzantine protocols which attempt to address the pitfalls of the former two, and point out that even the lattermost approaches require up to $O(n^3)$ message exchanges to achieve consensus.  

> HashGraph sends no votes at all over the network, because all voting is virtual.

## Welcome to Castle Irwell

(Core Mechanisms)

It's worth noting that a HashGraph is a Graph of Hashes, and not the other way round: something akin to a HashMap of Graphs, though that's also fun to think about. They outline the core mechanisms of the HashGraph as follows.

### Eventualities

(Events)

- Generally, transactions under dispute are called **events**.  An event $x$ is defined to be an **ancestor** of event $y$ if $x$ is $y$, or a parent of $y$, or a parent of a parent of $y$ and so on.  It is also a **self-ancestor** of $y$ if $x$ is $y$, or a self-parent of $y$, or a self-parent of a self-parent of $y$ and so on.

- The **round** of an event $x$ is defined to be $r + i$, where $r$ is the maximum round number of the parents of $x$ (or $1$ if it has no parents), and $i$ is defined to be $1$ if $x$ can strongly see more than $2n/3$ witnesses in round $r$ (or $0$ if it can’t).

  - Lemma: _If hashgraphs $A$ and $B$ are consistent, and $A$ decides a Byzantine agreement election with result $v$ in round $r$ and $B$ has not decided prior to $r$, then $B$ will decide $v$ in round $r + 2$ or before._
  - This lemma provides a bound on the <a class="eventually">eventuality</a> of strong consistency, though implicit assumptions of network partitions or lackthereof need still be considered.

#### Had 2 Try

(Example of Round Delineation)

![](/images/crdt-19.png)

Here, all events except for $a_5, d_3, d_4$ are in the initial round (round 1).  Those 3 nodes are able to strong see a supermajority of all nodes in round $r-1$ ($a_1, b_1, c_1, d_1$), therefore they all sign themselves as being members of round 2, and all of their parent nodes will also have at least round 2 status. 

- The **round received** number of an event $x$ is defined to be the first round where all unique famous witnesses are descendants of $x$.  If any event strongly sees a supermajority of events from the current or previous round $r, r-1$, it advances its round counter to $r \leftarrow r + 1$.

- A pair of events $(x, y)$ is a **fork** if $x$ and $y$ have the same creator, but neither is a self-ancestor of the other.

  - Lemma: _If the pair of events_ $(x, y)$ _is a fork, and_ $x$ _is strongly seen by event_ $z$ _in hashgraph_ $A$, _then_ $y$ _will not be strongly seen by any event in any hashgraph_ $B$ _that is consistent with_ $A$.

- An **honest** ("truthy") member tries to sync infinitely often with every other member, creates a valid event after each sync (with hashes of the latest self-parent and other-parent), and never creates two events that are forks with each other.

Any member can created a signed transaction at any time.  All members get a copy of it (<a class="eventually">eventually</a>), and the system converges on Byzantine agreement of the linear ordering of those transactions.

> It is not enough to ensure that every member knows every event. It is also necessary to agree on a linear ordering of the events, and thus of the transactions recorded inside the events.

Which is particularly challenging in the asynchronous setting, as illustrated by the FLP theorem: every such exchange or reliance on an ACK introduces an oportunity for unavoidable failure.

#### Our Love Is Dog

(Fork Cheating Example) 

> Suppose Bob creates an event $x$ with a certain self-parent hash pointing to his previous event $z$. Then Bob creates a new event $y$, but gives it a self-parent hash of $z$, instead of giving it a self-parent hash of $x$ as he should. This means that the events by Bob in the hashgraph will no longer be a chain, as they should be. They will now be a tree, because he has created a fork. If Bob gossips $x$ to Alice and $y$ to Carol, then for a while, Alice and Carol may not be aware of the fork. And Alice may calculate a virtual vote for $x$ that is different from Carol’s virtual vote for $y$. So it is possible for a fork to be spread across consistent hashgraphs. In this case, there may be a moment when Alice has a hashgraph containing $x$ but not $y$, and Carol has a hashgraph with $y$ and not $x$, and so a fork exists, but neither member is yet aware of the fact that it is a fork.

![](/images/crdt-3.png)

> The hashgraph consensus algorithm prevents this attack by using the concept of one state seeing another, and the concept of one state strongly seeing another. These are based on definitions of ancestor and self-ancestor such that every event is considered to be both an ancestor and self-ancestor of itself.

### shlonkey kong

(HashGraph)

The HashGraph is data structure that records who gossiped to whom, and in what order.  Every member has a copy of the hashgraph. If Alice and Bob both have the same hashgraph, then they can calculate a total order on the events according to any deterministic function of that hashgraph, and they will both get the same answer. Therefore, consensus is achieved, even without sending vote messages.

Whereas git maintains a graph of cryptographic hashes representing versions in a tree, where edges are the diffs between them, it stores no record of _how_ the components communicated. The HashGraph _primarily_ records the history of how its components communicated. "Alice send Bob all the events that she knows that he doesn't"

> Suppose Alice has hashgraph $A$ and Bob has hashgraph $B$. These hashgraphs may be slightly different at any given moment, but they will always be consistent. Consistent means that if $A$ and $B$ both contain event $x$, then they will both contain exactly the same set of ancestors for $x$, and will both contain exactly the same set of edges between those ancestors. If Alice knows of $x$ and Bob does not, and both of them are honest and actively participating, then we would expect Bob to learn of $x$ fairly quickly, through the gossip protocol. The consensus algorithm assumes that will happen <a class="eventually">eventually</a>, but does not make any assumptions about how fast it will happen. The protocol is completely asynchronous, and does not make assumptions about timeout periods, or the speed of gossip, or the rate at which progress is made.

- Hashgraphs $A$ and $B$ are consistent iff for any event $x$ contained in both hashgraphs, both contain the same set of ancestors for $x$, with the same parent and self-parent edges between those ancestors.
  - Lemma: _All members have consistent HashGraphs_.

### if ur leffen then im chillindude

(Gossip about Gossip)

The HashGraph is spread through the gossip protocol.  the information being gossiped about is the history of _the gossip itself_.  This uses very little bandwidth overhead beyond simply gossiping the events alone.

- A member such as Alice will choose another member at random, such as Bob, and then Alice will tell Bob all of the information she knows so far. Alice then repeats with a different random member. Bob repeatedly does the same, and all other members do the same. In this way, if a single member becomes aware of new information, it will spread _exponentially fast_ through the community until every member is aware of it.

> Gossiping a hashgraph gives the participants a great deal of information. If a new transaction is placed in the payload of an event, it will quickly spread to all members, until every member knows it. Alice will learn of the transaction. And she will know exactly when Bob learned of the transaction. And she will know exactly when Carol learned of the fact that Bob had learned of that transaction.  Deep chains of such reasoning become possible when all members have a copy of the hashgraph. As the hashgraph grows upward, the different members may have slightly different subsets of the new events near the top, but they will quickly converge to having exactly the same events lower down in the hashgraph. Furthermore, if Alice and Bob happen to both have a given event, then they are guaranteed to also both have all its ancestors. And they will agree on all the edges in the subgraph of those ancestors. All of this allows powerful algorithms to run locally, including for Byzantine fault tolerance.

> Gossip about gossip requires little overhead communication (compared to gossip about the transactions themselves) as components comunicate only the diffs of their signatures of observing new transactions.  Even these signatures can be compressed: "With appropriate compression, this can be sent in very few bytes, adding only a few percent to the size of the message being sent." 

### Meet Me in Montauk

(Virtual Voting)

Every member has a/is a copy of the HashGraph, so Alice can compute what Bob _would have_ sent her, if they had been adhering to a traditional Byzantine consensus protocol which required vote-sending.  Every member can reach  agreement on any number of decisions, without a single vote ever being sent. The HashGraph alone is sufficient. So zero bandwidth is used, beyond simply gossiping the HashGraph.

> Virtual voting has several benefits. In addition to saving bandwidth, it ensures that members always calculate their votes according to the rules. If Alice is honest, she will calculate virtual votes for the virtual Bob that are honest. Even if the real Bob is a cheater, he cannot attack Alice by making the virtual Bob vote incorrectly

- Lemma: _For any single YES/NO question, consensus is achieved <a class="eventually">eventually</a> with probability $1$_ 

Voting on the acceptance of a proposed event occurs as follows:

1. An event $x_r$ in round $r$ computes whether it is able to _see_ the prior transaction $y_{r' < r}$
2. $x_r$ computes whether it is able to _strongly see_ the $y_{r' < r}$
3. $x_r$ computes whether it is able to _strongly see_ a supermajority of events
4. If so, it advance to a new round, and checks if a supermajority of nodes in $r+1$ can strongly see a witness of $r$  
5. If so, the witness of $r$ is considered famous, and $y_{r' < r}$ is committed

The "virtual" part occurs during (3) and (4) by computing the visibility vectors of other nodes locally.

If any event strongly sees a supermajority of events from the current or previous round $r, r-1$, it advances its round counter to $r \leftarrow r + 1$.


### Art School Wannabe

(Famous Witnesses)

A **witness** is the first event created by a member in a round

> The community could put a list of $n$ transactions into order by running separate Byzantine agreement protocols on $O(n \log n)$ different yes/no questions of the form “did event $x$ come before event $y$?” A much faster approach is to pick just a few events (vertices in the hashgraph), to be called **witnesses**, and define a witness to be **famous** if the hashgraph shows that most members received it fairly soon after it was created. Then it’s sufficient to run the Byzantine agreement protocol only for witnesses, deciding for each witness the single question “is this witness famous?” Once Byzantine agreement is reached on the exact set of famous witnesses, it is easy to derive from the hashgraph a fair total order for all events.

TODO: lemma 

### Shred Cruz?

(Seeing and Strongly Seeing)

- An event $x$ can **see** event $y$ if $y$ is an ancestor of $x$, and the ancestos of $x$ do not include a fork by the creator of $y$

![](/images/crdt-14.png)

Imagine if I had the patience to make an interactive graph for this.  It would be so sparkly.  Instead you must use your imagination.

![](/images/crdt-17.png)

- $\color{blue}a_4$ can see $\color{purple}b_1$ by way of e.g. $\color{blue}a_4\color{black} \rightarrow \color{blue}a_3\color{black} \rightarrow \color{blue}a_2\color{black} \rightarrow \color{purple}b_1\color{black}$

- $\color{blue}a_4$ can see $\color{olive}c_1$ by way of e.g. $\color{blue}a_4\color{black} \rightarrow \color{purple}b_2\color{black} \rightarrow \color{olive}c_2\color{black} \rightarrow \color{olive}c_1\color{black}$

- $\color{blue}a_4$ can see $\color{orange}d_1$ by way of e.g. $\color{blue}a_4\color{black} \rightarrow \color{blue}a_3\color{black} \rightarrow \color{olive}c_3\color{black} \rightarrow \color{orange}d_2\color{black} \rightarrow \color{orange}d_1\color{black}$

Etc. 

--- 

- An event $x$ can **srongly see** event $y$ if $x$ can see $y$ and there is a set $S$ of events by more than $2/3$ of the members such that $x$ can see every event in $S$, and every event in $S$ can see $y$

Given any two vertices $x$ and $y$ in the HashGraph, it can be immediately calculated[^10] whether $x$ can strongly see $y$, which is defined to be true if they are connected by multiple directed paths passing through enough members. This concept allows the key lemma to be proved: that _if Alice and Bob are both able to calculate Carol’s virtual vote on a given question, then Alice and Bob get the same answer. That lemma forms the foundation for the rest of the mathematical proof of Byzantine agreement with probability one._

If there are $n > 1$ members, a witness event $w$ can strongly see an event $x$, if $w$ can see more than $2n/3$ events by different members, each of which can see $x$. 

Consider the following state snapshot of a HashGraph:

![](/images/crdt-18.png)

$\color{purple}b_5$ has three paths that _strongly see_ $\color{olive}c_1$ (grouped by which witnesses they pass through):

- ($\color{purple}B, \color{olive}C$): $\color{purple}b_5\color{black} \rightarrow \color{purple}b_4\color{black} \rightarrow \color{purple}b_3\color{black} \rightarrow \color{purple}b_2\color{black} \rightarrow \color{olive}c_1\color{black}$ 

- ($\color{purple}B, \color{orange}D, \color{olive}C$): $\color{purple}b_5\color{black} \rightarrow \color{purple}b_4\color{black} \rightarrow \color{olive}c_3\color{black} \rightarrow \color{purplorange}d_2\color{black} \rightarrow \color{olive}c_1\color{black}$ 

- ($\color{purple}B, \color{red}E, \color{olive}C$): $\color{purple}b_5\color{black} \rightarrow \color{red}e_3\color{black} \rightarrow \color{red}e_2\color{black} \rightarrow  \color{olive}c_1\color{black}$ 

While none of the paths individually traverse a super majority of nodes, together they collectively go through four nodes B, C, D, and E, thus $\color{purple}b_5$ strongly sees $\color{olive}c_1$.

---

### Zepplin V (The House That Ewald Built)

(Fairness)

The authors stipulate that tt should be difficult for a small group of attackers to unfairly influence the order of transactions chosen as the consensus, and that the order of transactions needs to be preserved.

> For some applications, the exact order does not matter, but for a stock market it can be critically important that this decision be made fairly.[^11]

As noted, an inherent flaw with the leader-reliant algorithms such as those of Paxos or Raft is that –regardless of the means used to select a hopefully-truthy leader– that component becomes a single point of failure, and therefore an easy target. 

> In any case, the leader could arbitrarily decide to ignore Alice or Bob's reported transactions for a period of time, delaying one of them, to force one transaction to come after another.  If the gial is distributed trust, _then no single individual can be trusted_

Additionally, given the nature of consensus needing to be reached by at least $2n/3$ witnesses in a round, the structure of the HashGraph acts as a deterrent to attacks predicated on slowing the network. Failures resulting from (real) "total control" over the network are not considered as flaws of the protocol:

> The Byzantine proofs assume the attackers control the internet, and can delay arbitrary messages. If attackers actually had that power, they could simply disconnect Alice from the internet for as long as it takes for Bob to send a transaction and have it recorded. This could be done on the real internet by launching a denial of service attack, flooding every computer with packets from Bob in an attempt to prevent Alice from communicating. Of course, this would also be effective if Alice were communicating with a central server, so it could be considered **more a failure of the internet than a failure of the consensus system.**

![](/images/crdt-4.png)

### (Amateur Cartography)

Fastness (A HashGraph has 99 pace)

Throughout the paper, the authors provide ample discussion for means of compression or further reducing the overhead of the HashGraph without ever compromising the correctness of the structure on the whole.

The concern for overhead is almost humorously gratuitous.  The priority for performative resolution of Byzantine problems is highlighted by the discussion of packing witnesses and visibility vectors into a single integer for optimal ALU consumption.  

![](/images/crdt-5.png)


#### Naruto Themed Sexting

(Example of How it Works)

First, we start with the initial states for a HashGraph with four members.  Each node has it's own root event:

![](/images/crdt-6.png)

Suppose $A$ receives an event $c_1$ from $C$ and updates itself:

![](/images/crdt-7.png)

Immediately following receipt of $c_1$, $A$ creates its own event $a_2$ which fathers $a_1, c_1$.

<details>
  <summary><u class="my-link">Lemma: "fathering"</u></summary>

![](/images/crdt-16.jpg)
QED 
</details>

<br>

![](/images/crdt-8.png)

Imagine that, in the meantine, $C$ also receives event $d_1$ from $D$.  $C$ will sign a new transaction indicating receipt of $d_1$ and is ready to offer their new gossip to other members.

![](/images/crdt-9.png)

<a class="eventually">Eventually</a>, all nodes receive some events from one another such that the overall state of each member resembles the following: 

![](/images/crdt-10.png)

As the gossip about the gossip unfolds, each member's local copies of the HashGraph may not be identical.  However, _all events_ observed by a member will be recorded in their own copy.  

<!-- TODO: the bit about how near the top they might be different, but over time the older transactions are codified. -->

### A Random Exercise in Impermanence (The Collector)

(Exchange of Information)

Recall that whenever a member broadcasts a synchronization update, the only information that need be exchanged (ignoring the accompanying signatures because the authors have thoroughly convinced the reader that you can pretty much send the size of that siggy to 0) is the delta between what member $A$ knows and what that member knows another member $B$ _does not know_.  

Consider the final state of the previous example: 

![](/images/crdt-10.png)

$A$'s next broadcast to $B$ will only include the new information that $A$ has and $A$'s internal representation of $B$ does not, and vice versa.  The actual delivery and receipt of the state diffs of different members of the hashgraph is as follows. 

![](/images/crdt-15.png)

So that the resulting states of the involved members are:

![](/images/crdt-11.png)

# Bono!! Bono!! 

I mean yeah, that's pretty much it?

TODO: dates and citations

# Kawasaki Backflip

[^1]: please please _please_ someone start a blogging flame war with me.

[^2]: "[Why Computers Can't Count Sometimes](https://www.youtube.com/watch?v=RY_2gElt3SA&t=312s )." The King, Tom Scott. 

[^3]: Acceptable pronounciations include "credit", "Crudités", and "Kurds"

[^4]: Shapiro et al. "[A comprehensive study of Convergent and Commutative Replicated Data Types](https://hal.inria.fr/file/index/docid/555588/filename/techreport.pdf)." 2011. 

[^5]: A _join-semilattice_ is just a set that implements `Comparable` with a total ordering: $\forall x,y \in S \; \exists z$, where $z$ is the greatest lower bound of $\{x, y\}$ 

[^6]: Fischer, Lynch, Paterson.  "[Impossibility of Distributed Consensus with One Faulty Process](https://groups.csail.mit.edu/tds/papers/Lynch/jacm85.pdf)." _Journal Association for Computing Machinery_, 1985. 

[^7]: The size is entirely arbitrary.  In the original paper, the authors use the simplest case of 1-bit to underscore the fragility of systems on the whole.

[^8]: Again, arbitrary domain, just needs to match the above.

[^9]: Baird, Leemon. "[THE SWIRLDS HASHGRAPH CONSENSUS ALGORITHM: FAIR, FAST, BYZANTINE FAULT TOLERANCE.](https://www.swirlds.com/downloads/SWIRLDS-TR-2016-01.pdf)" _Swirlds_. 2016.

[^10]: Though it seems like this would actually an $O(k/n)$ computation, where $k$ is the total number of transactions, as $x$ needs to traverse the HashGraph to find $y$, the authors point out that for the purpose of _sight_ (and other properties used in the proofs of tolerance) the number of temporally-prior nodes that any given node $x$ needs to view in order to "see" another node $y$ is actually negligibly small in terms of complexity.  This sight need only look as far as the last Famous Witness which indicates that all transactions from rounds prior to that famous witness are agreed upon by the system on the whole.  Therefore, the search space for $x \rarr y$ is bounded by 1 _round_.

[^11]: [_Flash Boys_](https://www.amazon.com/Flash-Boys-Wall-Street-Revolt/dp/0393351599) by Michael Lewis is a great book about why even milliseconds of either innacuracy or advantage in an exchange market can be hugely exploited by high frequency traders.