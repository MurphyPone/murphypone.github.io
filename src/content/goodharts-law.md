---
title: "47 | Goodhart's Law"
date: "2023-03-05"
description: "Scala, malice"
path: "/blog/goodharts-law"
---

<style> 
  .n { visibility: hidden; } 
  
  img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    align: center;
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

## Goodhart's Law

> When a measure becomes a target, it ceases to be a good measure.

Oh, sage Goodhart, thou knowest mine heart. 

A pattern observable in all of nature.  A budget becomes a measure of need, and so resource expenditures exceed the budget to demonstrate _more need_; customer satisfaction ratings become kickback deals; code coverage is used to evaluate the quality of a software project, and thusly the _quality_ of the code coverage falls...

Consider a wee lad twiddling his thumbs, sipping his coffee, completing a crossword, and monitoring an alerts channel on an otherwise-innocuous weekday afternoon.  His phone alights, his wrist buzzes, and he jumps in unison with those around him as the murderous banshee cry of "PAGER DUTY ALERT" emitting from his phone strikes the fear of God into his bones.  Shaking their heads somberly, his coworkers return their gazes to their own crosswords as the wee lad begins to sweat.  Frantically navigating windows, dashboards, desperately acking the alerts and ping's pouring into his notification center, he identifies the culprit:

```
[All Hours policy] poopy-domain-service-rpc-a19e686f exceeded memory limit threshold  
  impact: poopy delivery may be delayed
```

A sigh of relief washes over the youth as he recognizes the specter that has been plaguing the on-call rotation for weeks now.  

"It's about time that somebody ups the memory limit for those pods tbh," he thinks to himself.  "And I know just how to do it!" (rare junior eng W).  Within seconds, a 1 line pull request has been opened against `poopy-domain-service` to increase memory allocation in the helm charts, and in a few more minutes, the junior engineer has secured necessary approvals from some sympathetic teammates who admire the naive ambition of the lad.  

> All in a day's wo–

But wait... the merge button standing between him and a pat on the back from those who suffered before him and those that would come after is... gray? 

```
Merging blocked due to Unit Test branch coverage degradation by 1.3%
```

Bastard! A sly merge hook accusing him of degraded unit tests?  Surely there must be a mistake, he's only modified a configuration file.  Why– that "code" isn't even unit-testable?  Can't he force-merge the change, it's kind of an emergency, there's on ongoing site incident (of low severity, but nonetheless) being caused by the memory issue.  He's trying to do the right thing? And being thwarted by an unintelligent analysis policy.  

"I'll just find somewhere to write a quick unit test to make this go away," he says to himself.  Audible snickers drifting through the air from the senior engineers within earshot of the mutterings of the soon-to-be-madman.

Opening his editor and navigating to the `test` directory, he is met first with a dialogue window informing him that the `sbt` project is indexing the files, and it should be ready for his feeble attempts in a few years.  After three more cups of coffee, two impromptu one-on-ones with a senior, and several unprintable utterances later, the junior engineer throws his hands up in dejection: 

> Why the fUck did _\<person who hasn't worked at the company in three years\>_ structure the tests like this?  This is impenetrable.  How did this ever get a passing test coverage score to begin with?  I can't even open the file that sample data is coming from because it's fifty-thousand lines long.  I'm not going to be able to make a dent. We really live like this?! 
> ...

The senior engineer taps his own noggin, declares that it's 5 O'clock somewhere (it's 2:35 PM EST), and pats the lad who is inches from tears on the back.  

Then a devilish thought, a truly deceitful and wicked idea comes to the boy –who, in this moment is becoming a man– it would be simpler to just fabricate some fugazi classes and tests to offset the code coverage than to decipher the intention and behavior of `PoopyServiceClientProfileFilterInjectionFactoryITSpec.scala`...  

## I'm just a little boy who wants to eat berries and cream and build a Scala project for fun

> idiot 

This is a stupid endeavor and deserving of mockery.  What a dumb thing to want to do.  Don't get me wrong, building things is perhaps the most pure form of satisfaction that I enjoy, but this is just a depraved and perverse means to an end.  At penalty of disclosing proprietary code, I can't just _show you_ the `PoopyServiceClientProfileFilterInjectionFactoryIT.spec` and surrounding coverage itself, instead I must spinup a contrived sample service with it's own abysmal test coverage.  

> Should only take a second. 

And just like that, all the advancements in wisdom gained in the days prior have vanished from underneath me as I have fallen victim to the first gotcha of software engineering.  The notion that you spend most of your time actually coding rather than configuring, writing technical documents that will never see the light of day, and providing standup updates that consist of further delaying the delivery date of your task because you _routinely_ forget that configuration et al. take up so much of your time.  Developer 👏 Efficiency 👏.  

## Setting up an SBT project

The S in SBT does not stand for "Simple" nor "Satisfying" nor "Superb" nor "Standard" nor anything else that might sound pleasant.  Standing up a Scala project with Scala Build Tool –or, as it's less-fondly referred to– Shitty Build Tool, is anything but... 

It's almost not worth providing a beginner-friendly rundown/summary here because it's so far from a one-size-fits-all, it's more like _one-of-these-sizes-probably-fits-something-close-to-what-you-actually-want-according-to-greg-from-the-forums-nine-years-ago_.

1. Install `sbt`
2. Install IntelliJ or whatever and your themes (those are important.  We can have a Bad Time™️ but dammit, it's going to be a Bad Time™️ in One Dark Classic)
3. Install the correct distribution of Java.  Really have fun with this one.  Make sure you're in a padded, soundproof room so you don't disturb anyone when you throw your phone at the wall when you get another OOM alert.[^1]
4. Create a new sbt project from your IDE.  This is tricky because you really _want_ to believe that it's smarter than you.  And it probably is if the thing you want to do is the same as the thing it wants to do, but you're probably not aligned, so pay attention (I wish I could tell you to what, but it's a crapshoot)

Now, your organizations testing enforcement will almost certainly vary, but it's probably dumb and makes use of some testing interface that's exposed to the developer so they can make improvements themselves without blindly fumbling around the codebase.  For example, one such unnamed coverage enforcement service (fed tool tbh) can be configured to read and evaluate coverage from a report generated by the `sbt-scoverage` plugin.  For no reason in particular we're going to use this and jimmy together some totally-not-contrived classes, accompanying tests, and then the solution to our problem.  The remainder of the blog is implementation detail, but the underlying idea remains the same throughout.  


Your blank canvas should look _something_ like this:[^2]

```zsh
  √ 12 [0:28:08] github/goodharts-law (master) δ tree
  .
  ├── build.sbt
  ├── project
  │   ├── plugins.sbt
  │   ├── project/
  │   └── target/
  ├── src
  │   ├── main/scala/com/murphypone/
  │   |   └── # this is where jank will have already been committed
  │   └── test/scala/com/murphypone/
  │       └── # this is where we're going to put our lies
  ├── target
  │   ├── global-logging/
  │   ├── scala-2.12classes
  │   │   │   └── com/murphypone/
  │   |   |       └── # vestiges of jank
  │   │   ├── coverage-report/
  │   │   ├── scoverage-data/
  │   │   ├── scoverage-report/
  │   │   │   ├── com.murphypone.package.html
  │   │   │   ├── index.html
  │   │   │   ├── overview.html
  │   │   │   ├── packages.html
  │   │   │   └── scoverage.xml
  .   .   .
```

Mainly we're concerned about the `build.sbt` and the `plugins.sbt` wherever they're located in your project. 

I'm sure there's a numerous, coherent examples of what a good `build.sbt` looks like.  And they probably will look much different than the disgusting thing I'm about to show you.  That's really cool: how flexible and non-standard the build configuration file is in SBT.  It's a great place to showcase some self-expression and really just deviate from the beaten path (on accident or on purpose, hard to say, really).  It's challenging to make CMake look appealing, but SBT really outdoes itself here. 


```scala
ThisBuild / version := "0.1.0-SNAPSHOT"
ThisBuild / scalaVersion := "2.12.1" // † 
ThisBuild / organization := "murphypone"

inConfig(Compile)(
  Seq(
    scalacOptions ++= Seq( // †† don't need
      "-Xexperimental", 
      "-language:higherKinds", 
      "-Xfatal-warnings"
    ) 
  )
)

// ††† known incantation
lazy val testSettings = inConfig(Test)(
  Seq(fork := true, testOptions += Tests.Argument(TestFrameworks.ScalaTest, "-o", "-u", "target/test-reports/"))
)

lazy val root = (project in file("."))
  .settings(
    name := "goodharts-law",
    libraryDependencies ++= Seq(
      "org.scalatest" %% "scalatest" % "3.2.11"
      "org.scalacheck" %% "scalacheck" % "1.17.0"
//      scalaCheck % Test
    ),
    testSettings
  )
```

- †: good luck choosing the right scala version for you.  It's not at all a contentious topic of debate
- ††: you probably certainly don't need these, I just prefer them.  
- †††: this is just some incantation you need to know or be lucky enough to find.  Don't worry, there's only like a thousand of them you need to keep track of when working with SBT.[^3]

and in the `plugins.sbt`, we have our coverage report provider `sbt-scoverage`:


```scala
addSbtPlugin("org.scoverage" % "sbt-scoverage" % "1.6.1")
```

Phew, I hope that works for you. 

## Not a Contrived Example

My muse as of late, dear reader, is Gogurt and it's acquisition by any means necessary.  Including from the clutches of starving children.  Scala is the perfect language to use for such a dastardly task.  Because we've spent a lot of time thinking about how we might scale this service to nab other snacks in the future, we wish to design our service somewhat generically.  Actually this is dumb – this code doesn't really matter at all. Here's some sample code we're going to write crappy tests for:


### src/main/scala/\<org.projectname\>/models

First, a model of our target: `Gogurt.scala`

```scala
package com.murphypone.models

sealed abstract class Gogurt(val value: String) {
  def toReasonableWebFmt: String
}

object Gogurt {

  case object Strawberry extends Gogurt("strawberry") {
    def toReasonableWebFmt: String = s"""{ "value": "$value" }"""
  }
  case object Vanilla extends Gogurt("vanilla") {
    def toReasonableWebFmt: String = s"""{ "value": "$value" }"""
  }
  case object Banana extends Gogurt("banana") {
    def toReasonableWebFmt: String = s"""{ "value": "$value" }"""
  }
  case object Mango extends Gogurt("Mango") {
    def toReasonableWebFmt: String = s"""{ "value": "$value" }"""
  }
}
```

Then the generic `TheftService.scala`

```scala
package com.murphypone.models

/** 
  * Service abstraction for maximizing starvation 
  * over some collection of people objects with ordered preferences 
  */
trait TheftService[F] {

  /** 
    * Given a sequences of preferences of ~some item~, 
    * determine which flavor to steal causes the most harm 
    */
  def steal(preferences: Seq[Seq[F]]): F

  /** 
   * Get weighted preferences from our subjects
   */
  def weightedPreferences(preferences: Seq[Seq[F]]): Seq[F]
}
```

### src/main/scala/\<org.projectname\>/impl

Then the specific instance of our Gogurt stealing service: `GogurtTheftService.scala` 

```scala
package com.murphypone.impl

import com.murphypone.models.Gogurt._
import com.murphypone.models.{Gogurt, TheftService}

import scala.util.Random

case class HungryChild[F](name: String, age: Int, flavorPreferences: Seq[F]) {

  override def toString: String =
    s"I'm just a wee little lad named $name of age $age 
      who likes my snacks in the following, descending order: $flavorPreferences"

}

// generic gogurt class
class GogurtTheftService[G <: Gogurt] extends TheftService[G] {

  override def steal(preferences: Seq[Seq[G]]): G = ???

  override def weightedPreferences(preferences: Seq[Seq[G]]): Seq[G] = ???
}

// want strawberry 😈
class StrawberryGogurtTheftService extends GogurtTheftService[Gogurt] {

  override def steal(preferences: Seq[Seq[Gogurt]]): Gogurt = Strawberry

  override def weightedPreferences(preferences: Seq[Seq[Gogurt]]): Seq[Gogurt] =
    List(Strawberry) ++ Random.shuffle(List(Mango, Vanilla, Banana))

}
```

Delightful.  We're on our way to getting so much freaking gogurt. Unreal.  Surely there will be no adverse consequences from our actions.  As the well-meaning junior SWE we are, _before we even wire this puppy up_ let's now write some unit tests to make sure our `StrawberryGogurtTheftService` behaves correctly.


### test/scala/\<org.projectname\>/

Let's define a `BaseSpec.scala` which our other unit test files can inherit from so we don't have repeated imports throughout our tests:

Again, YMMV and if you're a sadist, this is a great time to experiment with new ideas.

```scala
package com.murphypone

import org.scalatest.Inside
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

abstract class BaseSpec extends AnyFlatSpec with Matchers with Inside
```

And then of course our `GogurtTheftServiceSpec.scala`:

```scala
package com.murphypone

import com.murphypone.impl.{HungryChild, StrawberryGogurtTheftService}
import com.murphypone.models.Gogurt
import com.murphypone.models.Gogurt.{Banana, Mango, Strawberry, Vanilla}

class GogurtTheftServiceSpec extends BaseSpec {

  val sut = new StrawberryGogurtTheftService
  val hc1: HungryChild[Gogurt] = HungryChild(
    name = "marcus", 
    age = 9, 
    flavor = List(Mango, Strawberry, Vanilla, Banana)
  )
  val hc2: HungryChild[Gogurt] = HungryChild(
    name = "marcus",  // same name and age, I literally don't care 
    age = 9, 
    flavor = List(Vanilla, Banana, Mango, Strawberry))

  it should "select Strawberry irrespective of the given preferences" in {
    sut.steal(List(hc1.flavorPreferences, hc2.flavorPreferences)) shouldBe Strawberry
  }

}
```

blah blah blah.  If we spawn an `sbt` shell and run the following command:

```zsh
sbt:goodharts-law> ;clean;coverage;test;coverageReport
```

we get some nifty lil test coverage report files in our `target/scala-2.12/scoverage-report` directory that might look like the following:


![](/images/goodhart-1.png)

<details>
  <summary><strong><u class="my-link">hmm, things aren't looking good for us if we open a PR</u></strong></summary>
  
  <img src="https://media.tenor.com/sMQAhDrXU_oAAAAM/ep.gif" width=100%>
</details>
<br>

Now, in this case, it's glaringly obvious that we could simply write some more useless tests against our equally useless code.  But what if you're in the definitely-fictitious-and-didn't-happen-to-me situation described above?  Are you going to try to grok a testing library and methodology to move the needle by 1.3% so your PR isn't blocked in a high-stress situation?

(If you're reading this and are one of my coworkers, I just want to say: obviously I would take the time to do a good job 👍👍👍 you can click away now).

<details>
  <summary><strong><u class="my-link">Yes, of course, I'm a good little lad.</u></strong></summary>
  
  <img src="https://media.tenor.com/10i4quIbVEoAAAAC/absolutely-not-nope.gif" width=100%>
</details>
<br>

## 6σ Test Coverage Babyyyyy!

The plan is simple:  

1. Write a stupid class with a method that supposedly has lots of statements and lots of branching, 
2. Write a test to verify _anything at all_ while invoking that method,
3. Automate its proliferation 


### Write a Stupid Class

_Peter... It looks like every class you've written so far is pretty stupid_ 

> shut up

In a new package, I'll create the prototype `PunkBuster.scala`:

```scala
package com.murphypone.punkbuster

class PunkBuster {

  def doHardThing(coin: Boolean): Long = {
    var total = 0
    total = total + 1

    if (coin) total = total + 1
    
    total 
  }

}
```

Take note senior engineers, this is actually the only good place in the whole codebase so far where being devious and creative is a good thing.

### Write a Stupid Spec for the Stupid Class

As promised, a stupid spec to exercise _all_ those branching code paths:

```scala
package com.murphypone.punkbuster

import com.murphypone.BaseSpec

class PunkBusterSpec extends BaseSpec {
  val pb = new PunkBuster
  it should "improve test coverage" in {

    pb.doHardThing(true) should not be 0
    pb.doHardThing(false) should not be 0

  }

}
```

Great, now if we run the tests and coverage report again we might see a fraction of coverage improvement.  The naive fix to see instant mega-gains would be to copy/paste like a hundred thousand more `if (coin) total = total + 1` lines into the `PunkBuster` class.  Your editor will probably lock up around half a million lines copied to your clipboard, this may be the first instance of cowardice we encounter on our journey into darkness.  Let's write a script to do this for us.  


## now this is podracing

Since we've already relegated ourselves to Scala-land, we'll continue here, though what I'm about to present resembles a script moreso than anything that Brooks Curry would recognize as functional behavior.

Our project thus far doesn't yet have a `Main` function, so I'll just cannibalize that reservation.  It was never about stealing gogurts, the _main_ purpose was to fib.

Somewhere in the project, I'll throw down a `CoverageImprover.scala` object with a `main` definition in it which will parse (if you can call what we're about to do _parsing_) the coverage report to give us info about the lines of code in our file.  Now, at time of writing this, I haven't actually done anything with that information, but the idea is that you could improve upon the idea by tweaking the length and volume of fluffer `PunkBuster`s to precisely meet some amount of target coverage so as not to tip-off the powers that be to your craftiness – after all, near-perfect code coverage is nigh impossible to achieve legitimately.  But this section isn't called "76% Coverage" dammit, it's called **6σ** and that's what I intend to hit.

```scala
package com.murphypone.coverage

// import anything and everything, I'd import *._ if I could.  God is dead, and sbt-coverage killed him
import net.ruippeixotog.scalascraper.browser.JsoupBrowser // soup 🤗
...

object CoverageImprover {
  def main(args: Array[String]): Unit = {

    // path to coverage output file
    val browser = JsoupBrowser()
    val doc = browser.parseFile("target/scala-2.12/scoverage-report/overview.html")

    // yes, import a whole DOM traversal library and then do manual string splitting 
    // no, do not intelligently use this API to target specific table rows
    // it's important here that you do a real bang up job
    // don't want to give off the wrong impression
    val all = doc >> allText

    // this would be where you do something worthwhile with statistics
    val linesOfCodeMatcher = "Lines of code: (\\d)+".r

    linesOfCodeMatcher.findFirstMatchIn(all) match {
      case Some(value) =>
        val lines = value.toString.substring(15).trim
        println(s"Lines of code: ${lines.toInt}")

      case None => println("Lines of code: not found")
    }

    // configurable helper method to create new PunkBuster classes
    def writePunkBuster(fileIndex: Int, n: Int): Unit = {
      val file = new File(s"src/main/scala/com/murphypone/punkbuster/${genFileName(fileIndex, false)}")
      val bw = new BufferedWriter(new FileWriter(file))

      bw.write(s"""package com.murphypone.punkbuster
          |
          |class PunkBuster$fileIndex {
          |  def doHardThing(coin: Boolean): Long = {
          |    var total = 1
          |""".stripMargin)

      for (_ <- 1 to n)
        bw.write("    if (coin) total = total + 1\n")

      bw.write(s"""   total // $n
           |  }
           |}
           |""".stripMargin)
      bw.close()
    }

    // helper to write the corresponding specs
    def writePunkBusterSpec(fileIndex: Int): Unit = {
      val file = new File(s"src/test/scala/com/murphypone/punkbuster/${genFileName(fileIndex, true)}")
      val bw = new BufferedWriter(new FileWriter(file))

      bw.write(s"""package com.murphypone.punkbuster
                  |
                  |import com.murphypone.BaseSpec
                  |
                  |class PunkBuster${fileIndex}Spec extends BaseSpec {
                  |  val pb = new PunkBuster$fileIndex
                  |  it should "fuck up test coverage" in {
                  |
                  |    pb.doHardThing(true) should not be 0
                  |    pb.doHardThing(false) should not be 0
                  |
                  |  }
                  |
                  |}
                  |""".stripMargin)

      bw.close()
    }

    // instead of writing one big file, let's write many medium sized files
    // could add some noise here (along with the name and placement of these specs) 
    // this is a weak form of obfuscation though, and at this point the more care
    // we employ in covering our tracks, the less plausible-deniability we retain
    for (i <- 1 to 500) {
      writePunkBuster(fileIndex = i, n = 1000) 
      writePunkBusterSpec(fileIndex = i)
    }

  }
}

```

I think 1k is a good round limit for filesize before the JVM starts to tap out.  10K is not kosher on my machine with out-of-the-box JVM configurations.  Even 1K is too much for some of the IntelliJ plugins I have installed though:

![](/images/goodhart-2.png)

Coward!

Additionally, writing files much larger than 1,000 lines long may upset the JVM:

```
[error] Could not write class com/murphypone/punkbuster/PunkBuster1 because it exceeds JVM code size limits. Method doHardThing's code too large!
```

Coward!

(Incidentally, the JVM has no problem actually _writing_ this file which you can see for yourself by viewing the huge file, it just fails to interpret it as a class.)

Now, we could either find and adjust whatever JVM flag is preventing us from writing a singular 6σ test, or we can just write several files


But even just writing that many files at once might cause some issues: 

```
[error] GC overhead limit exceeded
java.lang.OutOfMemoryError: GC overhead limit exceeded
```

Coward!

Eventually, you'll find some settings that work for you, or just `run` the script a couple of times with higher indices.  

Anyways, our cheerful output now resembles something like this:

![](/images/goodhart-3.png)

<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/O2yPnnDfqpw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</center>

Merged, logged off, snoozed, put on do not disturb ✌️

## Conclusion

It is not recommended that you do this unless you want a stern warning from the security folks at your organization.

"But Peter," you might ask "didn’t it take longer to write all this than to just write a unit test?" no, dear reader, ... no. Behold the joy of industry software engineering.  

To summarize:
- SBT sucks
- 6σ test coverage is easy
- don't get caught

## Next time

> getting a CI user to commit these changes so your name isn't on the blame

[^1]: [sdkman](https://sdkman.io/jdks#librca) helps with this. Note to self: `sdk install java 8.0.362.fx-librca`

[^2]: I've cleaned up the output of the tree command because there's more chaff in it's output than useful information.  

[^3]: ††††: [Allegedly](http://printwiki.org/Footnote), it's inappropriate to use the double-double dagger unless one first exhausted the asterisk, single dagger, double dagger, paragraph symbol, section mark, parallel rules, number sign, and the doubles of each.  However, [double-double daggers](https://www.youtube.com/watch?v=UqS_tH2O7FY) are way cooler than regular footnotes  