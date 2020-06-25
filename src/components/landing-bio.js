import styled from "@emotion/styled"
import { graphql, StaticQuery } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Container = styled.div`
  text-align: center;
`

const OuterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 78vh;
`

const Description = styled.p`
  padding: 0;
  margin-bottom: 1rem;
  font-size: 1.4rem;
`

const NameHeader = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 0;
  border-left: 3px solid rgba(102, 102, 255, 0.8);
  border-top: 3px solid rgba(102, 102, 255, 0.8);
  padding-top: .1em;
  padding-left: .1em;
  margin-bottom: 0.2em;
`

// const Break = styled.div`
//   flex-basis: 100%;
//   width: 0;
// `

const ProjectCard = styled.div`
  border: 3px solid rgba(102, 102, 255, 0.8);
  border-radius: 4px;
  padding-top: 20%;
  padding-left: .2em;
  margin: 0.2em;
  text-align: center;
  height: 7em;
  background-repeat:no-repeat;
  background-size: cover;
  background-position: center;
`

const ProjectTitle = styled.a`
  font-weight: bold;
  font-size: 1.5em;
  color: white; 
  text-decoration: none;
`

const GridContainer = styled.div`
  border-top: 3px solid rgba(102, 102, 255, 0.8);
  padding-top: 20px;
  width: 100%;
  display: grid;
  width: 100%;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
`


const LandingBio = () => (
  <StaticQuery
    query={graphql`
      query LandingSiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <OuterContainer>
        <Container>
          <NameHeader>{data.site.siteMetadata.title}</NameHeader>
          <Description style={{color: 'rgb(102, 102, 255)'}}>Projects and <a href="" style={{pointerEvents: "none", cursor: "default", textDecoration: "line-through", color: "rgba(102, 102, 255, 0.8)"}}>shitposts</a> blog</Description>
        </Container>
        <GridContainer>
            <ProjectCard style={{ backgroundImage: 'url("/static/images/AECOM.png")', backgroundSize: "40%", backgroundPositionY: "10%"}}><ProjectTitle href="https://github.com/MurphyPone/AECOM-CallTracker" target="_blank"  style={{color: "black"}}>Call Tracker</ProjectTitle></ProjectCard>          
            <ProjectCard style={{ backgroundImage: 'url("/static/images/ML.png")', paddingTop: "15%"}}><ProjectTitle href="https://github.com/MurphyPone/PyTorch-basics" target="_blank" style={{color: "black"}}>Machine Learning with PyTorch</ProjectTitle></ProjectCard>          
            <ProjectCard style={{ backgroundImage: 'url("/static/images/love.png")', backgroundSize: "20%", backgroundPositionY: "10%", paddingTop: "25%"}}><ProjectTitle href="https://github.com/MurphyPone/LUA-Love2D" target="_blank" style={{color: "black", fontSize: "1.2em"}}>Lua/LÖVE Projects</ProjectTitle></ProjectCard>     

            <ProjectCard style={{ backgroundImage: 'url("/static/images/katacoda.png")', backgroundSize: "30%", backgroundPositionY: "10%", paddingTop: "25%"}}><ProjectTitle href="https://www.katacoda.com/petersmurphy7" target="_blank" style={{color: "black", fontSize: "1.2em"}}>Grey Matter/Katacoda</ProjectTitle></ProjectCard>     
            <ProjectCard>Project y</ProjectCard>
            <ProjectCard>Project z</ProjectCard>

            <a href="https://vthacks.com" target="_blank"><ProjectCard style={{ backgroundImage: 'url("/static/images/vthacks.png")'}}></ProjectCard></a>
            <a href="https://hackbi.org" target="_blank"><ProjectCard style={{ backgroundImage: 'url("/static/images/hackbi.png")'}}></ProjectCard></a>
            <ProjectCard>MLH</ProjectCard>
          </GridContainer>
      </OuterContainer>
    )}
  />
) 

NameHeader.propTypes = {
  siteTitle: PropTypes.string,
}

NameHeader.defaultProps = {
  siteTitle: ``,
}

export default LandingBio
