---
title: "35 | Reasonable Judging"
date: "2022-04-20"
description: "Spreadsheets, (not) Gavel, Social Choice Theory"
path: "/blog/reasonable-judging"
---

# Preface

I want to preface this post by saying that I have the utmost respect for [Anish Athalye](https://www.anishathalye.com/), the creator of [Gavel](https://www.anishathalye.com/2015/03/07/designing-a-better-judging-system/), for doing hacker praxis and creating a practical tool which attempts to solve an issue he and his team experienced when coordinating judges for hackathon project submissions. Gavel is a neat tool which uses some sophisticated graph theory to attempt to produce _the fairest ranking_ of projects.

**But organizers should not use Gavel.**  In this post I want to provide a comparison between Gavel and another, nearly-as-equitable solution to the challenge of judging projects which, in my humble opinion, is vastly more accessible.

# Gavel Overview

Before critiquing Gavel, I first want to recapitulate how it works with some commentary, because _it is really cool_ and I think Anish raises a lot of valid points about achieving fair outcomes. TODO  I encourage anyone who is interested to read his breakdown of how it works, but I'll also repeat a majority of the content here for ease of comparison (all the credit for the proofs/model obviously go to him and his team).

The first motivation Anish raises which I think everyone ought to be able to agree upon is that quantitative ranking systems are dog water.  Ordinal rankings are far superior.  They eliminate at least one layer of inter-judge bias by localizing the importance of absolute scores to a single judge.  

For example, if we have two judges $Alfred$ and $Beatrice$ with different backgrounds (technical, design, business, etc.), they'll likely evaluate projects differently.  $Alfred$ might be a faculty moderator who is impressed by all projects he evaluates, scoring them all in the $40/50$ range on his personal judging rubric for their creativity and ambition. $Beatrice$, on the other hand, teaches a University course on Operating Systems and is rather unimpressed by the technical novelty of the projects he gets assigned, and scores most of his projects as he would grade an exam flunking about a third of his projects, and not giving a single project a score higher than a $40/50$.  If we were to take these scores at face value, and determine the winners of our hackathon based off the potentially high-variance values, then we would clearly be disadvantaging the teams scored by the harsher of the two judges. 

We could take such efforts as normalizing the scores from each judge (such that all their scores have a mean of 0 and standard deviation of 1 regardless of how punitively or generously they scored their projects out of 50 or whatever arbitrary maximum score your rubric allows for), and also calibrating them according to our desired expectations as organizers who have a pulse on the the target audience for our event: 

$$
\begin{aligned}
 \bar{x}_i &= \frac{x_i - \mu}{\sigma} \quad \text{where}\\

 \mu &= \frac{1}{n}\sum^n_{i=1} x_i \\

 \sigma^2 &= \frac{1}{n-1}\sum^n_{i=1} (x_i - \mu)^2 \\
\end{aligned}
$$

but we can go even further to strive for statistical rigor in the fairness of our judges' outcome.  As Anish points out, normalization in this manner is ineffective unless judges view a majority of projects. This is covered in more depth later on in the explanation of the graph construction which underlies Gavel, but a decent high level model of understanding would be that _unless the judges scores enough projects overlapping with the normalized scores of other judges as well, the result will just be a disconnected graph of normalized scores which have no relation to one another.  (The proposed alternative covered in the second half of this post resolves this issue by dispatching cohorts of judges with explicit overlap in terms of project coverage).

We could also just do away with these absolute scores entirely, and instead opt for a means of scoring which produces a transitive set of ordered preferences from out judges via [Condorcet Methods]().

## Condorcet Methods

Condorcet methods attempt to find a **pairwise champion** given a set of options.  That is, the candidate who wins the majority vote in _every_ head-to-head election against each other opponent.  Their is not a guarantee of funding a condorcet winner with multiple voters, though individual preferences are guaranteed to be intransitive since voters are forced to order their preferences. (TODO Example).  

Resolving the paradoxes that might arise in the absence of a condorcet winner (i.e. an election between rock, paper, and scissors) is possible with other extensions of social choice theory.  ~~There  are numerous methods for tie-breaking and revealing voter preferences of ordering with the most straightforward being ordering~~ Gavel's approach is to **TODO minimize the amount of disagreement between electors**.  

An election will have a Condorcet winner if and only if one candidate is preferred over all others after a pairwise comparison between each.A Condorcet method finds the corresponding winner if one exists among $n$ candidates using $n-1$ pairwise comparisons.  Counts are conducted by pitting every option or candidate against every other.  The result of a sequence of these elections can be represented as a matrix or a directed graph:

Suppose we have judges $J_1$ with preferences $D \succ A \succ C \succ B$ and $J_2$ with preferences $A \succ C \succ B \succ D$:

$$
\begin{aligned}
J_1 = 
\begin{array}{rcl} 
    &\begin{array}{c}
        A  \ \ \ \  B \ \ \ \  C  \ \ \ \ D
    \end{array} \\ 
    
    \begin{matrix}
        A \\ 
        B \\
        C \\
        D 
    \end{matrix}
    
    \hspace{-1em} 
    
    &\begin{bmatrix}
        - & 1 & 1 & 0 \\
        0 & - & 0 & 0 \\
        0 & 1 & - & 0 \\
        1 & 1 & 1 & - \\
    \end{bmatrix}
\end{array}
\end{aligned}
$$

$$
\begin{aligned}
J_2 = 
\begin{array}{rcl} 
    &\begin{array}{c}
        A  \ \ \ \  B \ \ \ \  C  \ \ \ \ D
    \end{array} \\ 
    
    \begin{matrix}
        A \\ 
        B \\
        C \\
        D 
    \end{matrix}
    
    \hspace{-1em} 
    
    &\begin{bmatrix}
        - & 1 & 1 & 1 \\
        0 & - & 0 & 1 \\
        0 & 1 & - & 1 \\
        0 & 0 & 0 & - \\
    \end{bmatrix}
\end{array}
\end{aligned}
$$

Where rows entries represent victories of the incumbent over the columnal opponent.  Therefore $J_{\Iota_{ij}}$ represents the number of times the incumbent was favored over an opponent by the $\Iota^{th}$ Judge.

Via matrix addition, we can combine Judge's scores to get the following measure of cumulative pairwise preferences:

$$
\begin{aligned}
    \sum_i J_i =  J_1 + J_2 = 
    \begin{bmatrix}
    - & 2 & 2 & 1 \\
    0 & - & 0 & 1 \\
    0 & 2 & - & 1 \\
    1 & 1 & 1 & - \\
    \end{bmatrix} 
\end{aligned}
$$

Here, option $A$ is the Condercet winner since it beat every other candidate the most ($5$) times.

As a directed graph, these preferences and outcomes resemble the following, where a directed edge from $v_i$ to $v_j$ indicates that $v_j$ was favored over $v_i$:

$$
\begin{aligned}
    v_i \rarr v_j \implies v_j \succ v_j
\end{aligned}
$$

$J_1 = $

![](/images/judging-J1.png)

$J_2 = $

![](/images/judging-J2.png)

$J_1 + J_2 = $

![](/images/judging-J3.png)

Measuring the in-degrees of each node yields the Condorcet winner, but as mentioned, a winner is not guaranteed.

--- 

# Back to Gavel

Anish notes pairwise comparison amongst several projects with limited judges is still feasible per **Luce's Choice Axiom** which states that the probability of selecting one item over another from a pool of many is not affected by the presence or absence of other items.  Selection has independence from irrelevant alternatives, meaning that we can select an arbitrary set of options to serve to a judge without impacting the fairness of the overall cumulative sum of victories (assuming that each item is viewed equally many times).  Formally:

$$
\begin{aligned}
    P(i) = \frac{w_i}{\sum_j w_j}
\end{aligned}
$$

(The probability of selecting $i$ from a pool of $j$ items is proportionate to the weight of $i$ over the sum of all weights).

He goes on to formalize the means of comparisons (enumerating the visual depiction of the graphs above).  The result of a sequence of pairwise comparisons is a multi-set of tuples:

$$
\begin{aligned}
    E = \{(v_i, v_j) | i \neq j\} \text{ where } v_i > v_j
\end{aligned}
$$

yielding a directed graph on $n$ nodes $e_1, n_2, ..., e_n$ with edge $(v_i, v_j)$ having $w_{ij} \geq 0$.

From this formal representation, the algorithm proceeds.  While a topological produces an ordering that no judges disagree with, one such ordering might not exist since $G$ could be cyclic. To ameliorate this possibility, Gavel introduces a cost function to optimize for.

Given $G = (V, E)$ with edges $(v_i, v_j)$ having weight $w_{ij}$, a permutation of nodes can be defined as $\sigma: \{1,2, ..., |V| \}$, backward edges can be defined as a function of the permutation:

$$
\begin{aligned}
 E_B(\sigma) = \{ (v_a, v_j) \in E | \sigma(v_i) > \sigma(v_j) \}
\end{aligned}
$$

The cost function to be optimized then is:

$$
\begin{aligned}
 C(\sigma) = \sum_{(v_a, v_j) \in E_{B(\sigma)}} w_{ij}
\end{aligned}
$$

With the optimal ranking given by:

$$
\begin{aligned}
 
 \sigma^* = \arg \min \limits_{\sigma} C(\sigma)
\end{aligned}
$$

Informally, this optimization finds the ranking that the fewest judges disagree with.  This is also an NP-hard problem (which in and of itself makes reasoning about less accessible than, say, a spreadsheet).

Anish goes on to engage in a brief psychological lit review in order to justify some useful assumptions which help simplify the model.  

First, the model assumes that each judges' ranking or comparative orderings can be expressed as a Gaussian random variable.  Judges then sample from the corresponding quality distribution of the two options presented to them and select the option with the higher sampled quality.  

An option's _true_ quality is the mean of the corresponding distribution.  Given the data collected from the pairwise comparisons, if Gavel can compute the means of the Gaussians, then it has relative scores for every option from which global rankings can be computed.

![](https://www.anishathalye.com/_next/static/images/gaussians-a8cd66910b95dd8791b596cfaff5fd4b.png.webp)


For example, consider two options $X, Y$: 

$$
\begin{aligned}
    X &\thicksim N(\mu_X, \sigma_X^2) \\
    Y &\thicksim N(\mu_Y, \sigma_Y^2) \\
\end{aligned}
$$

With corresponding Probability Distribution Functions

$$
\begin{aligned}
    P_X(x) = \frac{1}{\sigma_X}\phi(\frac{x - \mu_X}{\sigma_X}) \\ \\
    P_Y(y) = \frac{1}{\sigma_Y}\phi(\frac{y - \mu_Y}{\sigma_Y})
\end{aligned}
$$

where $\phi(\cdot)$ is the standard normal probability distribution function:

$$
    \phi(z) = \frac{1}{\sqrt(2\pi)}e^{-\frac{1}{2}z^2}
$$

With this information, we can compute the probability that a judge will choose a given option: 

$$
P(X > Y) = P(X - Y > 0)
$$

Assuming zero correlation between variables in the model:

$$
\begin{aligned}
    X - Y &= N(\mu_{XY}, \sigma_{XY}^2) \\
    \mu_{XY} &= \mu_X - \mu_Y \\
    \sigma_{XY}^2 &= \sigma_X^2 + \sigma_Y^2
\end{aligned}
$$

This composition of random variables allows us to compute $P(X > Y)$:

$$
\begin{aligned}
    P(X > Y) &= P(X - Y > 0)  \\ 
    &= \int_0^\infty \frac{1}{\sqrt{2\pi\sigma^2_{XY}}}e^{\frac{-(t - \mu_{XY})^2}{2\sigma^2_{XY}}} dt \\
    &= \Phi(\frac{\mu_{XY}}{\sigma_{XY}})
\end{aligned}
$$

where $\Phi(z) = \int_{-\infty}^z \phi(t)dt$, the standard Cumulative Distribution Function.  Based on prior assumptions, the model can be further assumptions by settings $\sigma^2_X = \sigma^2_Y = \frac{1}{2}$ such that $\sigma^2_{XY} = 1$.

Under the assumption that there exists a true mean for each option expressed as a random variable, a Maximum Likelihood Estimator can be used to determine the _most likely_ parameters for the model. 

Given a single pair of options $X,Y$, the number of times each options is chosen is represented by $x,y$ respectively. 

$$
\begin{aligned}
    L(x,y) &= P(x, y | \mu_{XY}) \\
    &= {{ x + y } \choose x } P(X > Y)^x P(X > Y)^y \\
    &= {{ x + y } \choose x } \Phi(\mu_{XY})^x \Phi(-\mu_{XY})^y
\end{aligned}
$$

By properties of logarithms we can simplify:

$$
\begin{aligned}
    (x,y) &= \log \big(P(x, y | \mu_{XY})\big) \\
     &= \log {{ x + y } \choose x } x \log \big(\Phi(\mu_{XY})\big) + y \log \big(\Phi(-\mu_{XY})\big)
\end{aligned}
$$

Anish uses the matrix representation of the Condorcet results to define the global maximum log-likelihood of the parameters:

$$
\begin{aligned}
    L(\mu | J) &= \log P(J | \mu) \\
    &= \sum_{i, j} J_{ij} \log \big(\Phi(\mu_i - \mu_j)\big)
\end{aligned}
$$

Then, referencing some further optimization techniques that I won't pretend to fully understand, the solution is given by the following convex optimization problem:

$$
\begin{aligned}
  \arg \max \limits_{\mu} &\sum_{i, j} J_{ij} \log \big(\Phi(\mu_i - \mu_j)\big) - \sum_i \frac{\mu_i^2}{2} \\ 
  \text{subject to} &\sum_i \mu_i = 0
\end{aligned}
$$

In order to achieve a sound global ranking, we need to collect a sufficient amount of comparisons to construct a connected graph (lest we suffer the same pitfalls of relying on localized normalization of absolute scores from our judges as mentioned earlier). A good way to guarantee robust data collection (which holds for the alternative model to be proposed shortly as well) is to have the judges rank a sequence of options.  Gavel deviates from the alternative by rigidly sticking to pairwise comparisons and having each option $i^{th}$ be pitted against the next consecutive option, resulting in $n-1$ data points for $n$ elections adjudicated by a given judge.

Phew, hopefully that wasn't too dense.  Let's now consider what I contend is a more accessible and extensible approach which produces comparable outcomes.

# Stack Judging

Stack judging relies on some of the same core principles of the Condorcet optimization techniques employed above.  The Big Idea™️ is that, instead of using arguably slow pairwise comparisons, we instead assign judges **batches** of projects to evaluate and rank using a [Borda Count]().  

For example, if a judge is assigned 15 projects to evaluate, they would be divided into a set amount of batches (say 3 batches of 5 teams apiece) as well as $\{5, 4, 3, 2, 1 \}$ votes to assign to each project, where the best project in the batch would be awarded 5 points, the 2nd best 4 points and so on. 

## Judging Allocations

As a brief aside, the following formulae ([appropriated from the MLH Hackathon Organizer Guide](https://guide.mlh.io/digital-hackathons/judging-and-submissions/draft-up-a-judging-plan)) can help determine how to time box your judging phase and allocate your judges.  

- $J$: the number of judges at your disposal
- $S$: the number of submissions to your event
- $c$: the amount of judges per cohort
- $C = J/c$: the number of cohorts 
- $T = S/C$: the amount of teams to be viewed by each cohort  

Additional parameters such as allowable demo duration and total time allotted for judging to take place may be set in stone by the powers that be, or can be derived from the above values.

--- 

The greatest strengths of Stack Judging is that it can be orchestrated via a collaborative spreadsheet which is a familiar technology for most folks who you'll likely be leveraging for the scoring process, and it's highly configurable.

[This folder](https://drive.google.com/drive/folders/1XPNu2okXOqCdHWEHVBIu867Fzrs9hmun?usp=sharing) contains some template/example materials which I'll be referencing for the remainder of this explanation.  I encourage any readers to augment them to their likings!

## Master Spreadsheet

[The master spreadsheet](https://docs.google.com/spreadsheets/u/1/d/1coj7rBIWYVspJknPIk_iSxyFcaTSCtBOJIrvqXbNkhE/edit?usp=drive_web&ouid=107736160445539396352) is where the meat and potatoes of the judging takes place.  It contains a couple tabs to organize the information:

- **Internal-import**: This is where you'll import your submission data.  The example expects Devpost data because that's the de facto standard. If I'm going to die on any hills, the first is that you should use Stack Ranking, and the second is that you should use Devpost.  From the hackathon management > metrics tab within Devpost, export your submission data and import > replace this sheet.  All we're really concerned about is the `Project Title` and `Submission Url` columns, but the rest of the data is useful if you need to go searching for a specific project by keyword or whatever.  For the sake of this example, all of the submission URLs are the same, but obviously yours would reflect your event's actual submissions.

- **Confirmed Judges**: This is where you'll enumerate all your judges.  Big thanks to Judges A through L for volunteering for my fictitious event this evening.

- **Judges Progress**: This is a nice little bell & whistle I've added on top of MLH's template which requires a bit of manual configuration, but allows you to monitor your judges' progress without having to invade their personal rubric sheet 
  - On the matter of **individual rubrics** you'll also find several other spreadsheets in the shared folder; one for each judge.  This is a place of judges to cast keep track of their project scores.  The axes of criteria are arbitrary, but it's recommended that you calibrate your judges with some examples of what a 10/10 in $XYZ$ category means versus, say, a 2/10. Similarly to Gavel, we don't actually care at all what the absolute scores which judges ascribe to their assigned projects– only the relative orderings of projects in their batches.  To configure this tab, an organizer has to import each judge's personal rubric into the sheet with the following queries in the relevant columns:

```sql
=COUNTIF(IMPORTRANGE("<SHEET_URL>", "H2:H"), ">0")
=COUNTIF(IMPORTRANGE("<SHEET_URL>", "A2:A"), ">=0")
```

Once judges receive project range assignments, they ought to copy columns A, B, and C from the following Stack Judging tab into their personal rubric (or you can do this for them if you have the bandwidth).

![](/images/judging-1.png)

This gives us a useful completion metric for each judge bby counting how many rows in their personal rubric sheet have non-zero scores.  Here we can see that Judges A and C have filled out some scores (although damning) for all their assignments as reflected by the completion bar, thanks Judges A and C!

![](/images/judging-2.png)

- **Stack Judging**: This is where the business happens! Once a judge has evaluated a batch of projects (color coded for their convenience), all they have to is assign their Borda Count scores within this tab.  The cumulative scores are tallied in column D, and winners are automatically tallied in the aptly named **Winners** tab.
  - Recommended that this process is demonstrated to judges in advance of the judging phase and that a few organizers make themselves available to the judges throughout the process in order to help troubleshoot any issues that may arise.The breakable bits can be further obfuscated as you see fit, but centralizing the data helps minimize the amount of time spent juggling browser windows.
  - Additionally note that the batch assignments are staggered to achieve the same effect as the sequential judging assignment noted described in Gavel's data collection process.  Here, the goal is to construct a connected graph as well, but we don't concern ourselves with actually _thinking about the graph_.  I'm also aware that teams 1-10, and 21-30 are disadvantaged in this illustration as they are viewed by fewer cohorts of judges than the middle range.  In practice, you would "wrap around" the range of team submissions to guarantee equal amounts of viewing for each team.
  - With respect to the _extensibility_ of this spreadsheet, see also rows 2-4.  For unique categories like those included in the example, you might also provide additional criteria for judges to note down spanning all the projects assigned to them and ask them to pick some teams to nominate for those categories.  The mode of each of those rows is calculated in the Winners tab to automatically select a winner

![](/images/judging-3.png)

- **Winners**: This tab is pretty self-explanatory insofar as it imports the `Overall Score` column from the Stack Judging tab, and displays the top 10 projects.  The Project ID (PID) of the unique categorical projects are displayed under the internal prizes section, and to further save organizers the hassle of hunting down sponsors for their winners, another section is provided to accommodate the external prize categories which may be available at your event.  

- **Best Beginner**: I chose to leave this tab in as a reminder that, as the organizers of your event, you should feel empowered to make executive decisions in order to keep the event on schedule.  If you wish to spread the wealth of prizes across submissions so that the sense of accomplishment of your participants can be shared by more folks, then feel empowered to do so! This is also why the Winners tab displays the top 10 overall projects rather than just 3.  If one project sweeps all the categories, and you'd rather have 7 winning teams rather than 1 mega project which wins all the prizes, then you can quickly select the runner up in any given category to find the next eligible team. Yes this whole post is about equitable judging outcomes, but at the end of the day, I am not beholden to math, and neither are you.  We're here to have fun and deliver fun, after all. 

# Conclusion

Gavel is theoretically sound, and again, it's really freakin cool.  But it does have its drawbacks.  

- TODO 
- Time consuming
- Proprietary / black box
- Needs configuration (this isn't quite fair, it's come a long way and the proposed alternative also requires a bit of leg work to get it off the ground).

- Con of Spreadsheet, no fancy UI, juggling windows, easy to break