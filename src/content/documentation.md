---
title: "Digest: Documentation"
date: "2019-07-17"
description: "Tips from Industry Professionals"
path: "/blog/documentation.md"
---

## Preface
This article contains my summary of Kismet's presentation on how to write documentation that doesn't suck

## Process, Information Architecture, and Voice

The documentation process includes each of these three cornerstones (docs live in triangular prisms).

# Process

The industry standard for documentation follows these five steps:
1. Request
2. Track
3. Develop
4. Review
5. Deliver

It's important to be able to identify where you are in the process and be able to describe with clarity what it is that you are *currently* working on.  Metrics are hugely important throughout the entire development process, but especially in documentation as tracking open vs. resolved issues is a powerful means of evaluating progress and achievement.

## Readability

Additionally, the quality of documentation can be evaluated in terms of readability according to several standards such as Flesch-Kincaid, Gunning-fog, and Dale-Chall formulas.  The target readability level hovers around the 5th-grade reading level, should be succinct and avoids use of jargon without clear definitions/detracting from the focus of the topic at hand.  Readability also contributes to SEO.

## How to Follow the Process

1. Create a ticket/issue and tag a Subject Matter Expert to oversee your progress - this makes your task trackable
2. Define terms, establish dependencies, and identify areas of ambiguity
3. Write content with readability and audience in mind
4. Review / QA (via SME/PoC)
5. Merge and close ticket
  - Deliver
  - Deploy
  - Reject/repeat

There should always be at least one Point of Contact who can verify/provide oversight on a given issue.

## Audience

Obviously, identifying the audience of your documentation depends on what problem you're solving/what you're documenting.  Directions as to how you would put on shoes varies between a 2 year old and a 20 year old.  I can assume that the 20 year old knows how to install shoes.

## Planning

| Category | Amount* | Time |
|----------|--------|------|
| Original Content | 1-3 pages/hr | 25-750 words/hr |
| Refactoring, Restructuring, Editing | 1-6 pages/hr | 250-1,500 words/hr |
| Formatting | 2-5 pages/hr | ... |
| Basic Copyedit | 5-10 pages/hr | ... |
| Proof Reading | 9-13 pages/hr | ... |

\* Data from the Editorial Freelance Association on general documentation, not necessarily technical docs.  Thank God

When reading other issues and writing your own:
 - Tag relevant people
 - Over communicate, ON THE ISSUE/TICKET, rather than undercommunicate secretly (e.g. private slack, email that gets lost, sticky note)
 - Comment of anything is unclear

## Interviewing SMEs

![img](https://vignette.wikia.nocookie.net/villains/images/0/08/Mr._Smee_Transparent/revision/latest?cb=20170713193443)

From an interns perspective, SMEs could knock out any task you get assigned for a month in a day. Their time is valuable, which is why you write the docs, and they reinvent clocks.  If you manage to pin one of them down for a meeting time, it's important to clarify your problem space as quickly and clearly as possible.  Some questions that can optimize the time you get with them:

- What existing, relevant sources should I read before starting?
- What is the main use case?
- Who is the intended audience, what level of experience can I assume?
- ... Matt
