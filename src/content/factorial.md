---
title: "46 | You know what really funges my tokens?"
date: "2023-01-05"
description: "p5.js, plotting, scheming, generative art"
path: "/blog/factorial"
---

# I don't like NFTs

I think they're rather dumb. Smarter folks than I have written at _length_[^1] about how
- they're unable to solve the problem they're named for,
- they prove no meaningful ownership (a notion which is normatively, but not physically, conferrable – and _normatively_ NFTs are right-clickable),
- they're energy-wasteful[^2]
- they're the commodity of exploitative currency[^3]
- and more

Harsh segue into me also stating that I harbor little to no misgivings towards artists trying break into the scene, stay relevant, or even make a quick buck in the ever-evolving market – that ire is reserved strictly for the bad actors and people in my mentions tagging me for giveaways.  Additionally, I want to give explicitly _positive_ credit to the fellow who inspired this post with his neat idea:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">3 factorial <a href="https://t.co/MpjFlPdp72">pic.twitter.com/MpjFlPdp72</a></p>&mdash; Lars Wander (@larswander) <a href="https://twitter.com/larswander/status/1609945781565259778?ref_src=twsrc%5Etfw">January 2, 2023</a><img src="https://pbs.twimg.com/media/FletFABXoAIw5CY?format=jpg&name=medium"></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

But... as his replies point out, it's not a novel idea[^5] nor algorithm[^6].  Worth stating –not to detract from the value of artists' labor or anything of the sort– but rather to underscore that minting something like this as a Non-Fungible Token is pretty stupid.[^4]  You can't patent geometry.[^7]  Therefore, I took it upon myself, the Robin Hood of would-be NFTs to reverse engineer this factorial pattern, liberate it, and more...

# Reverse Engineer

... that's what they call me at work, it's like being a negative 10x engineer 😎.

Let's first examine the problem and devise a game plan about how we can replicate these intertwining patterns.

For starters we need a list of elements we wish to permute; these might as well be the 1-indexed indices of the list.

Next, we need to generate all the permutations of a list: [simple as](https://stackoverflow.com/questions/9960908/permutations-in-javascript). 

Then, observing from both Lars' replies to the inqueries about how this pattern was achieved, the figures themselves, as well as some experience with leetcode medium problems, we'll want to perform a series of swaps which lead us from our initial configuration e.g. `[1, 2, 3]` to each of the desired permutations.

For example, referencing the 4th permutation of $3!$ above, we want to end with `[2, 3, 1]`:

```
 i j k
[1 2 3] -> [2, 3, 1]
        => [3, 2, 1] swap i, k
        => [2, 3, 1] swap i, j
```

To draw curves between points, it will probably be useful to keep track of this "state history" of sorts.  This also implies that the height of each figure will need be proportionate to the minimum number of swaps needed permute the initial configuration into the target or vice versa.  Analysis[^8] indicates that the worst case for a generic algorithm is a reversed array, or some equivalent –perhaps-odd-in-length– permutation.  Such an array is said to be maximally fucked, and requires $n - 1$ swaps to be unfucked which is $O(n)$.  So, the height of each permutation is proportionate to the number of elements in the permutation.

To keep the figures uniform in height which is aesthetically desirable, we'll need to _pad_ this state history with duplicate rows.  For example, `[1, 2, 3]` is both the initial configuration and the first permutation, but no-ops don't look pretty when plotted, so we'll _draw_ out the path into repeating segments:

```
[
	[1, 2, 3],
	[1, 2, 3],
	[1, 2, 3]
]
```

so it doesn't look stupid when plotted adjacent to its neighbor `[1, 3, 2]` or `[2, 1, 3]` with longer state histories.

Once we've segmented each _trace_ of a permutation, we need only connect the dots with fancy curves and we'll have successfully created a money printer bounded only by how many combinatorials your computer can handle.[^9]

# Daniel Shiffman is my Spirit Animal

True to form, we'll start with blank p5.js project.[^10]  If you don't know about p5.js, look no further than [The Coding Train](https://thecodingtrain.com/) for a heaping amount information on generative art, introductory coding, and much _much_ more using the p5 library!  Daniel Shiffman is the Bob Ross of technology.

```js

// I copy paste the same handful of palettes between projects
// just make sure you have N colors in your palette, one for each strand
// i.e. this palette assumes we won't attempt 6!
let color_palettes = [
  ["#D63826", "#FFCC00", "#79C3A7", "#00bbff", "#5500FF"],
  // ... more palettes 
];

let init; 			// our initial configuration
let permutations;   // all our permutations thereof
let min_swaps;      // the length of init
let step;			// the space between each strand in a figure
let gap;			// the space between each figure

function setup() {
	createCanvas(800, 1100);

	init = [1, 2, 3, 4, 5];
	permutations = permutator(init);
  	step = 10;
  	gap = init.length * 4; // scale based on the number of figures
  	min_swaps = init.length;
}

function draw() {
	background(220); // adjust the darkness so bright colors have nice contrast
	noFill(); 		 // since we're just drawing lines
	strokeWeight(2); // so the lines have some thickness

	// code will go here momentarily

	noLoop();		 // animation is left as an exercise to the reader
}

// permutation function taken graciously from StackOverflow
const permutator = (inputArr) => {
  let result = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };

  permute(inputArr);

  return result;
};
```

Next we need a helper function to create the trace or state history of swaps separating our initial configuration from the target permutation:

```js
function createSegments(input, target) {
  // our result is an array of arrays, starting with *a copy* the initial config 
  let res = [[...input]]; 

  // this is pretty much just a cannabalized selection sort
  for (let i = 0; i < target.length; i++) {
	// the state "row" we're going to append to the result is 
	// just a copy of the previous state
    let curr = [...res[res.length - 1]]; 

    // for each element, if it's not in the target position
    if (curr[i] != target[i]) {
      // make one swap
      target_i = target.indexOf(input[i]);
      [curr[i], curr[target_i]] = [curr[target_i], curr[i]];

	  // append it to the result
	  res.push(curr); 
    }
  }

  // pad the result to the desired height with copies of the the solved state
  while (res.length < min_swaps) {
    res.push([...res[res.length - 1]]);
  }

  return res;
}
```

Then, back inside the `draw` loop, we want to:

```
Iterate over each possible permutation
	Generate each permutation's segmented trace
    	For each snapshot/row in a trace
        	For each strand/column in a row
            	Draw a curve connecting the current row to the previous row
```

an actual implementation of which can look something like this:

```js
function draw() {
  background(220);
  noFill();
  strokeWeight(2);

  // for each permutation
  for (let i = 0; i < permutations.length; i++) {
    let target = permutations[i];
    let segments = createSegments(init, target).reverse();
   
    // for each "row" in a permutation (skipping the first, initial config)
    for (let s = 1; s < segments.length; s++) {
      let prev = segments[s - 1];
      let curr = segments[s];

	  // for each column in a row	  
      for (let c = 0; c < prev.length; c++) {
		// color it accordingly
        stroke(color_palettes[0][init[c] - 1]);
        
		// this looks gross, but just wraps the figures to a new line
        let x1 = prev[c] * step + (i % (2 * init.length)) * 3 * gap;
        let x2 = curr[c] * step + (i % (2 * init.length)) * 3 * gap;

        let h_pad =
          step + floor(i / (2 * init.length)) * (init.length - 1) * gap;
        let y1 = h_pad + gap * s + floor(i / (2 * init.length)) * gap;
        let y2 = h_pad + gap * (s + 1) + floor(i / (2 * init.length)) * gap;

        // for straight lines, use: line(x1, y1, x2, y2)
		// we set the control points of a bezier curve (the inner 4 arguments)
		// to pull the curve inwards, towards the center of each figure
        bezier(x1, y1, x1, y1 + step, x2, y2 - step, x2, y2);
      }
    }
  }

  noLoop();
}
```

And there we have it, for all permutations of 3, 4, and most of 5 respectively:

![](../images/factorial-1.png)

![](../images/factorial-2.png)

![](../images/factorial-3.png)

Caveat Emptor – this code is messy, suboptimal, and doesn't even center the figures on the page, but it's perfectly acceptable for me since I'm just going to export it as an SVG and center it on piece of paper to be plotted.

### Exporting from p5 to SVGs

By including the following SVG module in your p5 sketch's `index.html`, 

```html
<script src="https://unpkg.com/p5.js-svg@1.3.1"></script>
```

we can add the `SVG` argument to the `createCanvas` function to instruct the browser to render elements of the canvas as SVG curves which we can then save at the bottom of our draw loop, or on keypress, or some other triggering event:

```js
function setup() {
  createCanvas(800, 1500, SVG);
  // ... 
}

function draw() {
	// do stuff
	noLoop();
	save("factorial-" + init.length + ".svg");
}
```

which will save the curves to the desired output on page refresh which can then be imported into your favorite plotting software and plotted right away.

# praxis 

<video width="800" height="600" autoplay="autoplay">
  <source src="/images/factorial.mp4" type="video/mp4" />
</video>

If you like these, I'd be happy to funge you one.  Email or message me a mailing address and I'll send one to you at the cost of shipping (~$11) – _I will not accept crypto_.

![](/images/factorial-4.png)

Alternatively, make your own!  [Here's the complete source code](https://gist.github.com/MurphyPone/7a821bd3f3c6b9d1409bf24ada871e7c).


<script src="https://gist.github.com/MurphyPone/7a821bd3f3c6b9d1409bf24ada871e7c.js"></script>

## Foonotes & References

[^1]: [Antstyle](https://antsstyle.medium.com/why-nfts-are-bad-the-long-version-2c16dae145e2#e3ba). "Why NFTs are bad: the long version." 

  While I don't endorse each and every critique raised in this post, it's more or less the de facto glossary of _why NFTs are stupid_.    

[^2]: [Cambridge](https://ccaf.io/cbeci/index) Bitcoin Electricity Consumption Index

  Again, feeling the need to chime in here with commentary.  Energy use is not bad.  _Wanton_ energy use is not bad.  But _wanton energy use as proof of stake, work, etc. for signing of a transaction of an arbitrary (and it is arbitrary) address for a jpeg which I can replicate in an afternoon and funge a million of in a millisecond_ <u>is bad</u>.

[^3]: This is a weak criticism, I know.  The currency itself has no agency nor bearing on the morality of the transactions it's used for.  However, the mechanisms surrounding cryptocurrency and the hype trains of such coins –despite masquerading as secure, revolutionary, decentralized, etc.– lend themselves to exploitation.  

[^4]: I have notifications enabled for the artist as well, and this post is kind of a pre-emptive open source strike.

[^5]: "Looks like [braid groups](https://twitter.com/_person_a_/status/1609952232144834562?s=20) but different. 🤌"

[^6]: [Knuth/Fisher-Yates Shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)

[^7]: shut UP!

[^8]: [Minimum Swaps Problem](https://www.interviewbit.com/blog/minimum-swaps-problem/#:~:text=So%20we%20can%20generalize%20that,a%20standard%20Depth%20First%20Search).

[^9]: The amount of time I've linked to [this one joke...](https://murphyandhislaw.com/blog/voting-power#infertility)


[^10]: You can also just do this directly in the browser now with zero dev configuration: [https://editor.p5js.org/](https://editor.p5js.org/)

