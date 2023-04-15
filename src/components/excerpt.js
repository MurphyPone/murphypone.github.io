import styled from "@emotion/styled"
import { Link } from "gatsby"
import React from "react"
import { useState } from "react"

const Content = styled.div`
  font-style: italic;
  text-align: center;
  font-weight: 3px;
`

const NavLink = styled(Link)`
  color: gray;
  margin-bottom: 15px;
  text-decoration: none;
  display: inline-block;
  position: relative;

  ::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: rgba(102, 102, 255, 0.8);
    transform-origin: bottom right;
    transition: transform 0.4s cubic-bezier(0.86, 0, 0.07, 1);
  }

  :hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`

const outlineStyle = {
  borderBottom: "1px solid rgba(102, 102, 255, 0.4)",
  marginBottom: "1em",
  paddingLeft: "0.5em",
  paddingTop: "0.5em",
  paddingBottom: "0em",
}

const excerpts = [
  {
    snippet:
      "... that's what they call me at work, it's like being a negative 10x engineer 😎",
    title: "46 | You know what really funges my tokens?",
    link: "/blog/factorial",
  },
  {
    snippet:
      "Such an array is said to be maximally fucked, and requires n - 1 swaps to be unfucked which is O(n).",
    title: "46 | You know what really funges my tokens?",
    link: "/blog/factorial",
  },
  {
    snippet:
      "Six and a half thousand words in and I'm just now getting pissed that there's no Rubik's cube emoji. WTF unicode, get it together.",
    title: "45 | Smiting the Demon Number: How to Solve a Rubik's Cube",
    link: "/blog/demon-number",
  },
  {
    snippet:
      "Count to 519 quintillion and then tell me it isn't basically infinity, stfu.",
    title: "45 | Smiting the Demon Number: How to Solve a Rubik's Cube",
    link: "/blog/demon-number",
  },
  {
    snippet: `\"It is a little dramatic to watch a person get 40 binary digits in a row an then repeat them back without error.\" 
      \n\n
      which has got to be one of the most autistic party tricks I've ever imagined (and I say this with awe and envy, as someone who formerly prided themself in my ability to solve a rubik's cube in various states of impairment, recite the alphabet backwards, name presidents or books of the bible by their index, etc.)`,
    title: "44 | The Magical Number Seven",
    link: "/blog/magical-number-seven",
  },
  {
    snippet: `The point being that it is important for me to regularly read things that I don't understand. Eventually I might return to one such challenging piece of literature with greater appreciation, equipped with even just a few more semesters or years worth of exposure to the subjects which I once found alien.`,
    title: "43 | FLDR? I Barely Even Know Her!",
    link: "/blog/fast-loaded-dice-roller",
  },
  {
    snippet: `I will never stop using memes in my posts. In fact, every year that passes erodes the mountain of cringe that might otherwise be earned from tossing a rage comic in here...`,
    title: "43 | FLDR? I Barely Even Know Her!",
    link: "/blog/fast-loaded-dice-roller",
  },
  {
    snippet: `"Intuitively" is a word mathematicians use to describe their understanding of something after they've suffered an acid flash back in their kitchen`,
    title: "43 | FLDR? I Barely Even Know Her!",
    link: "/blog/fast-loaded-dice-roller",
  },
  {
    snippet: `The analogy for the actual subject matter of discussion for this post kind of fizzles out here, but I'm going to lean into it regardless`,
    title: "42 | Strong Eventual Consistency",
    link: "/blog/strong-eventual-consistency",
  },
  {
    snippet: `Make no mistake, this profession is a travesty; it's considered a good thing to delete tens of thousands lines of codes, and degree of skill is measured by one's ability to minimize the blast radius of jank introduced by such a purge.`,
    title: "41 | How to be a Successful Software Engineer",
    link: "/blog/how-to-be-a-successful-swe",
  },
  {
    snippet: `Billy Joel is one of the most successful Junior Developers of all time. A fool (Senior Engineer) once said "There is no cocaine in heaven." However, the devil seems like a cool dude, and I'd rather hangout with him.`,
    title: "41 | How to be a Successful Software Engineer",
    link: "/blog/how-to-be-a-successful-swe",
  },
  {
    snippet: `Among the numerous tried and true scapegoats which software engineers so often leverage when their code inevitably malfunctions are 🔥 cosmic ray bit flips 🔥. "How could I, in my infinite wisdom, have produced illogical behavior within my program. Nay, ’twas the sun who hath smited mine server farm and flipped the bits just so."`,
    title: "40 | Voyager 2",
    link: "/blog/voyager-2",
  },
  {
    snippet: `By count on our fingers, I of course mean that we'll be using Linear Algebra and –if you're incapable of simple arithmetic like I am– like two and a half legal pads of scratch work to verify that the examples included are in fact correct.`,
    title:
      "38 | ML 5: If My Mother Had Wheels She Would Have Been A Markov Chain Language Model",
    link: "/blog/ml-5",
  },
  {
    snippet: `Everyday, I await the opportunity to say "oh geez, I wish I had an argmax right about now."`,
    title:
      "38 | ML 5: If My Mother Had Wheels She Would Have Been A Markov Chain Language Model",
    link: "/blog/ml-5",
  },
  {
    snippet: `I've included the proof construction because its funny: ...`,
    title: "36 | Towards Computational Game Theory Part 2",
    link: "/blog/game-theory-2",
  },
  {
    snippet: `Though sacrificing the precision of strict pairwise comparison, the batch-system described above still produces an ordering of projects, and the by dispatching judges with explicit overlap in assignments, we can guarantee that the output is a connected graph. Despite the absence of a convex optimization problem, this method also produces an ordering of options which minimizes disagreement between judges`,
    title: "35 | Reasonable Judging",
    link: "/blog/reasonable-judging",
  },
  {
    snippet: `On the real, the best way to win at RPS is to wait like half a second for your opponent to throw their selection, then throw its usurping strategy and gaslight your opponent until they concede.`,
    title: "34 | Towards Computational Game Theory Part 1",
    link: "/blog/game-theory-1",
  },
  {
    snippet: `So, how would we measure whose say actually matters? Who is influential? Disregarding the social realities of being a huge dick, veto power, or trying to form a quorum to overrule the groom, we have some tools at our disposal to investigate this question!`,
    title: "33 | Voting Power",
    link: "/blog/voting-power",
  },
  {
    snippet: `Docker was actually invented after Solomon Hykes tried to compute all the permutations of a list of length 11 on his laptop and it burnt his crotch right off!`,
    title: "33 | Voting Power",
    link: "/blog/voting-power",
  },
  {
    snippet: `As illustrated in the historical summary of legislatures’ various failures to fairly carry out the task of redistricting, as well as how the Court’s involvement in the past two Centuries has only further complicated the matter, the current processes of redistricting produce inferior solutions compared to computationally attainable solutions. Computers find better boundaries and arrangements depending on how the problem is formatted, be it in terms of geographical compactness or feature integrity, raw population equality, competitiveness, or some combination thereof. And, according to the criteria presented for examining the models, it can be concluded that models which prioritize the first two criteria of reviewability and transparency alone offer marked improvements over current institutional efforts. The latter two criteria of cost efficiency and correctness are almost a symptom of the computational nature of these methods.`,
    title:
      "32 | Abdicating to the Algorithms: Solving the Redistricting Problem",
    link: "/blog/redistricting",
  },
  {
    snippet: `Before and during the Manhattan Project, the legendary Italian physicist Enrico Fermi invented and used a variety of probabilistic techniques to study essentially deterministic questions which were too difficult for deterministic methods. Later when the MANIAC I computer was installed at Los Alamos, the usefulness of these methods exploded (no pun intended) and one colleague suggested that they be called Monte Carlo methods after another colleague's gambling uncle's patronage of the famous casino. So now, it's the umbrella term for algorithms that gamble with accuracy in order to blow past intractability barriers using computers.`,
    title: "31 | Digest: Modeling Uncertainty",
    link: "/blog/modeling-uncertainty",
  },
  {
    snippet: `The origin of the tape starts is a Rotlung reanimator (2/2) and the read/write head of the Turing Machine is lethal as, in order to traverse the tape, it must slay a creature.`,
    title: "29 | Digest: Magic: the Gathering is Turing Complete",
    link: "/blog/mtg-turing-complete",
  },
  {
    snippet: `Fundamentally, that's all science is: not being wrong lots of times.`,
    title: "23 | Digest: Occam's Razor",
    link: "/blog/occcam-and-his-razor",
  },
  {
    snippet: `Nature is recalcitrant, and can pause at e3 for infinity, then as soon as we retract, e4 is revealed. Occam's razor does not retract on pain of convergence: it is the most pessimistic approach with respect to nature.`,
    title: "23 | Digest: Occam's Razor",
    link: "/blog/occcam-and-his-razor",
  },
  {
    snippet: `Sergey Levin is poor and therefore his network architecture sucks`,
    title: "15 | ML 3: A Summary of a Summary: DQN Bottlenecks",
    link: "/blog/ml-3",
  },
  {
    snippet: `"How marvelous it is for the rich to recommend poverty to us."`,
    title: "4 | The Post-Revolutionary Literary Revolutionary",
    link: "/blog/mahfouz",
  },
  {
    snippet: `"The diversity of my columns is worth discussing for a moment. On the 
    surface, they seem to wander all over the intellectual map -from sexism to music to
    art to nonsense, from game theory to artificial intelligence to molecular biology to
    the Cube, and more. But there is, I believe, a deep underlying, unity to my columns. I
    felt that gradually, as I wrote more and of-them, regular readers would start to see the 
    links between disparate ones, so that after a while, the coherence of the web would be quite clear. 
    My image of this was always geometric. I envisioned my intellectual "home territory" as a rather large
    region in some conceptual space, a region that most people do not see as a connected
    unit. Each new column was in a way a new "random dot" in that conceptual space,
    and as dots began peppering the space more fully over the months, the shape of my
    territory would begin to emerge more clearly. Eventually, I hoped, there would
    emerge a clear region associated with the name 'Metamagical Themas'" - Douglas Hofstadter`,
    title: "Metamagical Themas",
    link:
      "https://www.amazon.com/Metamagical-Themas-Questing-Essence-Pattern/dp/0465045669",
  },
  {
    snippet: `The senior engineer taps his own noggin, declares that it's 5 O'clock somewhere (it's 2:35 PM EST), and pats the lad who is inches from tears on the back.`,
    title: "47 | Goodhart's Law",
    link: "/blog/goodharts-law",
  },
  {
    snippet: `"The problem, of course, is that I now have to find something interesting to say about monads. And one thing that I often found frustrating when learning about that family of abstractions is how just about everything is a monad - why even have all these intermediate abstractions if everything is all the things, all the time?"`,
    title: "48 | Digest: Things that are things, but not other things",
    link: "/blog/category-theory-2",
  },
  {
    snippet: `AlphaTensor: Those fuckers at DeepMind did it again`,
    title: "49 | 2.3728596",
    link: "/blog/2-3728596",
  },
]

//excerpts[excerpts.length - 1]
const excerpt = excerpts[Math.floor(Math.random() * excerpts.length)]

const Excerpt = () => {
  const string = excerpt.snippet

  const [placeholder, setPlaceholder] = React.useState("")
  const index = React.useRef(0)

  React.useEffect(() => {
    function tick() {
      setPlaceholder(prev => prev + string[index.current])
      index.current++
    }
    if (index.current < string.length) {
      let addChar = setInterval(tick, 10)
      return () => clearInterval(addChar)
    }
  }, [placeholder])

  return (
    <div>
      <Content>{placeholder}</Content>
      <Content style={outlineStyle}>
        <NavLink to={excerpt.link}>{excerpt.title}</NavLink>
      </Content>
    </div>
  )
}

export default Excerpt
