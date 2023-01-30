import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import GoogleApiWrapper from "../components/map"
import Testimonials from "../components/testimonials"

const IndexPage = () => (
  <Layout>
    <SEO
      title="about"
      keywords={[
        `About`,
        `Peter Murphy`,
        `blog`,
        `MLH`,
        `Major League Hacking`,
      ]}
    />
    <center>
      <h1>About me</h1>
    </center>
    <img src={"../../images/profilepic.JPG"} alt="profile pic" />
    <p>👋Hi!</p>
    <p>
      My name is Peter, I'm a Software Enginer at Credit Karma. In 2021, I
      graduated from Virginia Tech where I studied Computer Science and minored
      in Philosophy, Politics, and Economics.
    </p>
    <p>
      On the weekends, I'm a{" "}
      <a href="https://mlh.io/" target="_blank">
        Major League Hacking
      </a>{" "}
      Coach, which means that I travel to events to assist hackathon organizers
      in order to provide the best possible experience to their attendees.
    </p>
    <p>
      Formerly, I worked as a part time Software Engineer at{" "}
      <a href="https://greymatter.io/grey-matter" target="_blank">
        Decipher Technology Studios
      </a>{" "}
      where I contributed to the product’s backend control-plane features
      extending Envoy’s service mesh API, as well as the Grey Matter Sense
      team's Log Anomaly Detector.
    </p>
    <p>
      <a href="/images/resume.pdf" target="_blank">
        Here's the full CV
      </a>
    </p>
    <p>
      In my spare time, I enjoy helping organize{" "}
      <a href="https://vthacks.com/" target="_blank">
        my own hackathons
      </a>
      , working on side projects, researching reinforcment learning techniques,
      and solving Rubik's cubes!
    </p>

    <center>
      <h3>Testimonials</h3>
    </center>
    <Testimonials />
    <br />
    <center>
      <h3 id="map">
        Hackathons I've organized, Coached, attended, and mentored
      </h3>
    </center>
    <GoogleApiWrapper />

    {/* <iframe title="resume" src={"/images/resume.pdf#tool"} width="100%" height="700px" style={{border: "10px black", marginTop: '105vh'}}></iframe> */}
  </Layout>
)

export default IndexPage
