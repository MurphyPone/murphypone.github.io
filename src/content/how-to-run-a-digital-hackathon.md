---
title: "How to Improve Your Digital Hackathon"
date: "2020-10-26"
description: "Everything as before + remote tools, engagement tactics, and more!"
path: "/blog/how-to-run-a-digital-hackathon"
---

This post builds on [its predecessor](/blog/how-to-run-a-hackathon), focusing on new challenges warranted by the digital format that many organizers are having to adapt to due to the restrictions imposed by the ongoing COVID-19 pandemic. While some aspects such as maintaining hacker engagement and the "sense of community" associated with hackathons are much harder to achieve in digital contexts, other areas such as day-of logistics and fundraising have become easier.  

> As the 2021 hackathon season progresses, this post ought to assume a more structured, concise form, but for the time being it's more or less a container for my notes and observations.

# Table of Contents
  - [Digital Platforms and Tooling](#tooling)
  - [Hacker Engagement](#engagement)
  - [Submission and Judging](#judging)
  - [Prizes and Swag](#prizes)

<a name="tooling"></a>

## Digital Platforms and Tooling

### Platform 

A recurring theme throughout this post is the challenge of maintaining hacker engagement throughout your digital event, and the choice of hosting platform can make or break your ability to organize, as well as the hackers' experience.

Having experienced events taking place through Discord, the combination of Slack and Zoom, or "fourth" party platforms such as Swapcard or Hopin, I'm a strong proponent of Discord, for a few reasons. 

1. It's the most likely to be familiar to your participants
2. It supports voice channels
3. It supports customization via their streamlined bot development API
4. It offers versatile specification of roles (useful for tagging sponsors, judges, hackers, organizers, mentors, etc. independently rather than enumerating all the members of a group, or `@channel`ing a dedicated area where those members may exist)
5. It has a huge community of developers who have already satiated common feature requests

While there are some edge cases where it might make sense to opt for a different platform, I think that Discord is, out of the box, the optimal place to host the majority of communication for digital hackathons (and will likely win over Slack at in-person events as well for the same reasons listed above).

With this in mind, it's more important than ever to ensure that your participants are aware of this preference, and encourage them to install the desktop application ahead of time to take full advantage of it's features (few people tend to enable notifications for web apps, but having a direct line of communication to them via the desktop app will be crucial).

Regardless of your chosen platform, I strongly recommend providing a document/presentation/video for judges, mentors, sponsors, and even hackers walking them through the basics of Discord, tailored specifically to _your event's configuration_.  Here's an [excellent example](https://docs.google.com/presentation/d/1db4qyXdAsNRGhppQHSMFeMGWHQzIGtM9SzGd2_Asm6M/edit?usp=sharing) from DemonHacks 2020.

Additionally, some useful Discord bots that I recommend are:
  - **Zira**: allow users to self-assign roles.  This can be useful in a variety of ways. Perhaps the most useful I've seen was having a single channel (`#self-assign-roles`, or `#become-a-mentor`, etc) where users can select which languages can help other hackers with, and then receive a role such as `@mentor-nodejs`, `@mentor-c++`, or `@mentor-python` such that hackers seeking debugging help can ping all other self-identified participants or mentors. [Here's a repo of icons](https://github.com/MurphyPone/zira-lang-emojis) you can import to your Discord server for common programming languages, frameworks, platforms, etc.

#### Channels 
At a minimum, your platform should have dedicated text channels for the following:
  - `#general` - general questions and hackathon discussion 
  - `#announcements` - with restricted posting permissions to prevent clutter    
  - `#team-formation` - with and example/template post for hackers to find teammates:

  > Hey fellow hackers 👋 , my name is Peter, and I’m a Junior studying Computer Science at \<School\>!
  > 
  > I have experience with:
  >  - HTML/CSS,
  >  - JavaScript
  >  - Python,
  >  - Some UI design experience.
  >
  > This weekend, I’m interested in learning about:
  >  - Machine Learning,
  >  - React,
  >  - Hardware.
  >
  > 📊 I’ve got some project ideas addressing the \<sponsor\> challenge that I’d love to share and develop with a bigger team, but I’m open to working on other ideas too!
  >
  > 🤠 My friend @Patrick and I are looking for two other folks for a team – let us know if you’re interested!!!

  - `#hacker-questions` - for general FAQ
  - `#submission-questions` - for submission questions, more on this below.
  - `#ask-an-organizer` - for logistical FAQ
  - `#ask-a-mentor` - for hackers to `@mentor-<language>`
  - `#sponsors` - for sponsors to ask questions directly to organizers (restricted to `@sponsor` and `@organizer` roles, if using Discord)
  - `#random` / `#social`
  - As well as channel groups for each sponsor (according to prospectus) containing text-sub-channels like `#<sponsor>-challenge`, `#talk-to-sponsor`, and perhaps voice channels as well 

Additional channels/structuring that I've seen be utilized with decent success include: 

 - `#helpful-links` - to contain all the resources provided by sponsors/organizers
 - `#<mini-event>` - to contain info/links about each specific mini-event or workshop taking place during your event.  This can help centralize discussion, and give a specific place for hackers to follow-up with questions or share their own results from the mini-event.  **The tradeoff** here is that more channels can be overwhelming for newer users. 
 - `#meet-your-mentors` - a place for mentors to introduce themselves so that hackers _can_ reach out to specific mentors according to their skill-set.  Similar to the `#team-formation` channel, providing structure can make it easier for hackers and other mentors to quickly digest the information here without being overwhelmed:

  > Hey everyone 👋, 
  >
  > My name is Peter and I'm a Coach from Major League Hacking which means that I help out at hackathons all across North America to make sure hackers like 👉 you 👈  have  the best experience possible!
  >
  > Outside of Coaching, I'm a CS student just like many of you, as well as a part time Software Engineer for a startup where I research Deep Reinforcement Learning techniques for cloud infrastructure optimization.  
  >
  > I'm happy to help with: 
  > - troubleshooting DNS issues to get your website hosted on Domain.com for free, as 
  > - Python (Flask, Pandas, PyTorch), 
  > - Javascript, 
  > - C 

- Voice/Text channels for each team.  This can be a huge undertaking, but on the whole can drastically improve hacker retention as it keeps hackers _in_ your server, rather than leaving them to the birds and create their own team servers where they might miss your announcements.  Create and share a form with hackers a month or two ahead of your event to allow them to register a team.  I'm unaware of a tool that automates the process, but if your team can manage, you can create the aforementioned channels for each team.  This also allows hackers to `@mentor` within their own text channel where a mentor can then quickly join and get quick context about their issue without cluttering the general `#mentor` channel.  Another tradeoff to consider here is the impracticality of moderating potentially hundreds of text/voice channels. However, other Discord bots such as [MEE6](https://mee6.xyz/) provide some auto-moderation functionality for text channels.

Nonetheless, I still recommend inviting hackers to join your server as soon as possible, and maybe even consider running some-pre-event workshops/mini-events to start to create your sense of community and allow hackers to familiarize themselves with the layout of your server.

#### Roles and Permissions

One of the drawbacks/tradeoffs of digital events is that _the more content you provide to hackers, the more likely they are to be overwhelmed_. As mentioned above, though many-specialized channels make it easy for seasoned-Discord users to quickly navigate and find the information they're looking for, novice hackers. mentors, and sponsors may be turned off of your communication platform if they're met with hundreds of channels with no guidance as to how to tweak their notifications/permissions to refine the scope of information that may be blasted at them once they join your server. 

Shout out to [Kyle Suero](https://kylesuero.com/), this section is dedicated to you.  **Overuse of `@everyone` and `@here` can quickly sever a hacker's connection to the server.**  There's no hard-fast rules about tagging everyone, but I strongly recommend keeping such announcements to a minimum. My 2¢: permissions to tag whole channels/servers should be restricted to an as-needed Organizer-only basis, and should be kept to a minimum for information that everyone needs to know.  The overwhelming majority of the time, no announcement pertains to _everyone_.  Tailor your messages and relevant tags to the specific audience you want to communicate with.  

Broad categories include:
- `@Organizers`
- `@Hackers`
- `@Mentors`
- `@Judges`
- `@Sponsors`

If you choose to create voice/text channels for each team, it only takes one more step to create roles for each specific team as well, which can be useful in a variety of situations (announcing winning teams, communicating with the rest of a team if a the PoC is offline, etc.)

Additionally, it's important to note that substituting `@everyone` with `@Hackers` would cause the same problem as before, to remember to be deliberate and concise in your communications with all the attendees of your event at risk of losing hackers to the onslaught of information coming at them from all angles/channels.


<a name="engagement"></a>

## Hacker Engagement

Due to the lowered commitment levels of digital events (which could/should be marketed as _"it's never been easier to participate in a hackathon as you don't even have to leave your room!"_), organizers need to place increased focus on providing content for hackers to interact with one another through. 

- opening ceremony

- dual problem of attrition


<a name="judging"></a>

## Submission and Judging


### Making sure everyone's on the same page 

Despite all your efforts to communicate submission guidelines, deadlines, and advice with hackers, digital contexts appear to be at odds with ensuring that everyone is on the same page when it comes to crucial information like submission guidelines and judging logistics.  From an organizational perspective, it can be difficult to refine your judging plan if you don't have a good gauge for how many projects will be submitted.

Encouraging hackers to submit to Devpost early, even as just a placeholder submission is a good start, but without something more formalized than a mere announcement, many hackers will just ignore this recommendation. Personally, I'm a proponent of incentivizing hackers with "door" prizes for taking action on things like this, e.g. "submit to Devpost prior to midnight the day before judging for a chance to win XYZ small prize." 

Along with a dedicated `#submission-questions` channel, scheduled submission checkpoints or "office hours" throughout the event can help ensure that hackers are familiar with the submission platform (in my examples, Devpost).

The aforementioned channel can/should contained a pin message reflecting your submissions guidelines (which should be duplicated across your Devpost home page and livesite, if you have it; additionally these guidelines should be highlighted during opening ceremony).  Here's an example which can be tailored for your event:

>👨‍⚖️ **JUDGING INFORMATION** 👩‍⚖️
> 1. Submit to Devpost early at `<devpost link>` - you can edit everything in your submission (write up, video, code, website, prizes, etc) all the way up to the deadline which is **9:00 AM EST, Sunday**
>
> 2. **Every submission must have a video demo** attached to it.  There's a required field on the submission page where you can link to a video. You can upload any video as a placeholder until you actually have time record a demo :slight_smile: .  You can record a video using free software like Open Broadcast Studio or the Google Chrome plugin: Loom.
>
> 3. Don't know what to put in your demo video/project write up?  No sweat, there will be a submission checkpoint at 9:00 PM EST Friday and Saturday evening. Also, checkout this example post which has information about how to make a great demo! https://devpost.com/software/example-template-submission.  
>     - definitely mention if this is your (or any of your teammates) first hackathon!!
>     - include links to your project code if it's on repl.it, Netlify, GitHub, or anywhere else.  
>     - Also be sure to include the domain of any website you registered through Domain.com, even if you didn't end up using it.
>
> 4. The judging phase start at 10 AM and ends at 11:30 AM CDT.  **The Judging process will be totally asynchronous** meaning that judges are only going to view your Devpost write-up, and submission video (which should be ≤ 5 minutes long), so make sure your submission page looks neat!!†
>
>5. If you have questions about how to submit to Devpost, drop a question here in  #submission-questions (and also read the questions that have already been asked, odds are that your question has been answered) 
> 
> 6. Remember that you are only allowed to submit projects made during DemonHacks (and not at other events).

† - the 4th bullet point may or may not be relevant, which brings us the the next section

### Asynchronous Judging

This is an option which is gaining popularity at digital events. As there's an increased likelihood that hackers may be in different timezones across the world, imposing a time frame for them to be online and available to live demo their project to judges can impact your overall turnout.  The largest trade-off with this approach is that hackers may miss announcements about Devpost requirements, not realize that they need to upload a video, and be too hard-pressed for time leading up to the deadline to submit a demo video to qualify.  Additionally, judges are unable to effectively ask questions about projects via an async judging schema - though it is possible if each team has their own role on your communication platform that the more-proficient judges can tag.

Again, this relies on **making sure everyone's on the same page** in terms of submission expectations and requirements.  With respect to early submissions if you require a video attachment, just remind hackers that they can always go back and revise any part of their submission, so any (appropriate) video will work as a placeholder.

### Cheat Prevention

Another challenge that arises from digital events is the ability to "participate" in several events at a time. Organizer discretion determines how you set the rules for your event, but in an attempt to maximize hacker engagement with the content of _your hackathon_, I'm in favor of disallowing multiple submissions in an effort to keep the hackers at your event _at your event_.  Regardless of your preference about multiple submission, or anything else pertaining to your event, it's important to communicate the rules clearly and **make sure everyone's on the same page**.

If you opt to disallow duplicate submissions, there's a few steps you can take to enforce this. 

#### Devpost Cheat Check

1. On a Devpost submission page, click on one of the usernames of the submitters to view their profile/portfolio.

![](/images/cheat-1.png)

2. From here, you should be able to re-select the project submitted to your event, click it again

![](/images/cheat-2.png)

3. This page will have a list of all the other events that the project was submitted to, allowing you to verify if the project was created during your event or a prior event, as well as if it was multiply submitted

![](/images/cheat-3.png)

Clearly _this hacker_ has submitted the same project to several prior events: disqualified!!

#### Other Cheat Checks

If you suspect that a project was developed outside of the time frame of your event, or was multiply submitted, or in violation of your rules som other ways, there's a few other ways you can verify the integrity of the submission. If the submission includes a link to a GitHub repo, you can do some investigating in there to see when the first commit was, as well as what the commits entailed (e.g. one 10,000 line commit for the whole weekend might be suspicious unless there's just a single team member). Additionally, you can compare the current submission against prior submissions visible in the users' portfolios to see if they took the effort to recycle the same idea from a prior/different event into a new submission.

Another indicator that a project might be multiply submitted is if it doesn't seem to conform to any of the presented challenge/prize categories for your event.  While hackers are of course always able to work on whatever they like, high quality submissions that seem to ignore the theme of your event may be indicative of cheating...  