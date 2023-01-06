import React, { Component } from "react"
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from "react-responsive-carousel"

export default class Testimonials extends Component {
  render() {
    return (
      <Carousel
        showArrows={true}
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        autoPlay={true}
        interval={6100}
      >
        <div>
          <div className="myCarousel">
            <h3>
              uOttaHack<sup>3</sup>
            </h3>
            <h4>Hackathon Organizer</h4>
            <p>
              Peter Murphy was the greatest MLH representative I could've asked
              for. As a volunteer who was put on the spot to watch after the MLH
              hardware lab equipment from time to time, he made my job very easy
              to handle. His explanations were thorough and even if I didn't
              understand everything, he'd allow me to ask him any and all
              questions to help me figure it out. Even when I had to take his
              place, I would be able to contact him and he'd try to solve the
              issue immediately. He was very kind, but still remained an
              authoritative figure in leading me and the other volunteers who
              worked the lab. Honestly, we couldn't have had such a good turnout
              without him.
            </p>
          </div>
        </div>

        <div>
          <div className="myCarousel">
            <h3>HackTJ</h3>
            <h4>Hackathon Organizer</h4>
            <p>
              Peter was great! He was constantly offering to help our team, even
              with manual labor. He was very approachable and helpful the whole
              time.
            </p>
          </div>
        </div>

        <div>
          <div className="myCarousel">
            <h3>DemonHacks</h3>
            <h4>Hackathon Organizer</h4>
            <p>
              The most helpful and inviting individual. If not for the
              exceptional guidance of Peter, our event would not have exceeded
              so many expectations as it did, especially for being run online
              for the first time. He was courteous, professional, extremely
              knowledgeable, and very fun to spend time with. I'm absolutely
              grateful to have been a part of the experience and to have had
              such an amazing addition to the team! I hope other hackathons are
              able to share this experience in the future.
            </p>
          </div>
        </div>

        <div>
          <div className="myCarousel">
            <h3>DemonHacks 2020</h3>
            <h4>Hackathon Organizer</h4>
            <p>
              Peter was a great help with our hackathon and was very attentive
              to any help that us or the hackers needed throughout the entirety
              of the event. He helped keep us on track and lended a hand
              whenever and wherever it was needed.
            </p>
          </div>
        </div>

        <div>
          <div className="myCarousel">
            <h3>Hoya Hacks</h3>
            <h4>Hackathon Organizer</h4>
            <p>
              I have been doing this for 6 years, this group was probably the
              best I have had in terms of MLH reps. Very helpful, organized,
              really enjoyed their work.
            </p>
          </div>
        </div>

        <div>
          <div className="myCarousel">
            <h3>SBUHacks</h3>
            <h4>Hackathon Organizer</h4>
            <p>
              Peter was awesome. He brought expertise from other online events,
              helped answer questions from both hackers and organizers, and
              overall kept everything running smoothly. As a particular
              instance, he (nicely) let us know our judging plan wouldn't work
              well, explained why, and recommended an alternative system while
              helping us implement it.
            </p>
          </div>
        </div>

        <div>
          <div className="myCarousel">
            <h3>Younger Brother</h3>
            <h4>Struggling with Physics Problem</h4>
            <p>thanks homie that makes a lot more sense</p>
          </div>
        </div>

        <div>
          <div className="myCarousel">
            <h3>DemonHacks 2022</h3>
            <h4>Hackathon Organizer</h4>
            <p>
              He made sure that he didn't just tell us what we should do rather
              he gave us some options and what he has seen that has worked in
              the past. In this way, he was extremely adaptive and helped us
              come to a good solution... Overall, he was extremely wonderful to
              work with and was vital to our hackathon being as successful as it
              was.
            </p>
          </div>
        </div>
      </Carousel>
    )
  }
}
