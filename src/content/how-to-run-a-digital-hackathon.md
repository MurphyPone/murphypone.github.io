---
title: "How to Improve Your Digital Hackathon"
date: "2020-09-01"
description: "Everything as before + remote tools, engagement tactics, and more!"
path: "/blog/how-to-run-a-digital-hackathon"
---

This post builds on [its predecessor](/blog/how-to-run-a-hackathon), focusing on new challenges warranted by the digital format that many organizers are having to adapt to due to the restrictions imposed by the ongoing COVID-19 pandemic. While some aspects such as maintaining hacker engagement and the "sense of community" associated with hackathons are much harder to achieve in digital contexts, other areas such as day-of logistics and fundraising have become easier.

# Table of Contents
  - [Digital Platforms and Tooling](#tooling)
  - [Hacker Engagement](#engagement)
  - [Judging](#judging)
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

Additionally, some useful Discord bots that I recommend are:
  - **Zira**: allow users to self-assign roles.  This can be useful in a variety of ways. Perhaps the most useful I've seen was having a single channel (`#self-assign-roles`, or `#become-a-mentor`, etc) where users can select which languages can help other hackers with, and then receive a role such as `@mentor-nodejs`, `@mentor-c++`, or `@mentor-python` such that hackers seeking debugging help can ping all other self-identified participants or mentors.
  - open to suggestions for other

At a minimum, your platform should have dedicated text channels for the following:
  - `#general` 
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
  > 🤠 My friend @Patrick and I are looking for two other folks for a team – let us know if >you’re interested!!!

  - `#hacker-questions` - for general FAQ
  - `#mentors` - for hackers to `@mentor-<language>`
  - `#sponsors` - for sponsors to ask questions directly to organizers (restricted to `@sponsor` and `@organizer` roles, if using Discord)
  - `#random` / `#social`
  - As well as channel groups for each sponsor (according to prospectus) containing text-sub-channels like `#<sponsor>-challenge`, `#talk-to-sponsor`, and perhaps voice channels as well 
  - Multiple `#checkpoint-n` voice/text channels for hackers to intermittently show off their progress 
  - And any other channels that make sense for your event!




 


<a name="engagement"></a>

## Hacker Engagement

Due to the lowered commitment levels of digital events (which could/should be marketed as _"it's never been easier to participate in a hackathon as you don't even have to leave your room!"_), organizers need to place increased focus on providing content for hackers to interact with one another through. 

- opening ceremony

- dual problem of attrition