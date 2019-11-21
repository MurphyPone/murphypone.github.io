import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
import styled from "@emotion/styled"

const Container = styled.div`
  text-align: center;
`

const OuterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
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
          <p>//TODO Create project card component</p>
          <p>Because I promise I have worthwhile code to look at maybe¿</p>
        </Container>
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
