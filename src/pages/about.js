import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import GoogleApiWrapper from "../components/map"


const IndexPage = () => (
  <Layout>
    <SEO title="About" keywords={[`About`, `Peter Murphy`, `blog`, `MLH`, `Major League Hacking`]} />
    <center><h1>About me</h1></center>
    <img src={"../../images/profilepic.JPG"} alt="profile pic" />
    <p>
    Hi! My name is Peter, I'm a student at Virginia Tech, studying Computer Science.
    On the weekends, I'm a Major League Hacking Coach, which means at any given time
    I'm probably at a hackathon, or at least en route to the next one.
    </p>
    <p>
    I'm interested in reinforcement learning, Alan Turing, Rubik's Cubes, long
    walks on the beach, 3D modeling with respect audio visualization, and hackathons! 
    </p>

    <h3>Hackathons I've organized, Coached, attended, and mentored</h3>
    <GoogleApiWrapper/>                                                         
    {/* <h3>Resume</h3> */}
    <iframe title="resume" src={"/images/resume.pdf#tool"} width="100%" height="700px" style={{border: "10px black", marginTop: '105vh'}}></iframe>
  </Layout>
)

export default IndexPage
