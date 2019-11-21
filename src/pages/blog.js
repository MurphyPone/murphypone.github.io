import React from "react"
import { Link, graphql } from "gatsby"
import { css } from "@emotion/core"
import styled from "@emotion/styled"

import Layout from "../components/layout"
import SEO from "../components/seo"

const Content = styled.div`
  margin: 0 auto;
  max-width: 860px;
  padding: 1.45rem 1.0875rem;
`

const ArticleDate = styled.h5`
  display: inline;
  color: #606060;
  margin-bottom: 15px;
  margin-top: 15px;
`

const MarkerHeader = styled.h3`
  display: inline;
  padding: 3px;
  margin-bottom: 15px;
  /*
    -100deg,
    rgba(26, 224, 204, 0.15),
    rgba(102, 102, 255, 0.8) 100%,
    rgba(26, 224, 204, 0.3)
  );
  border-radius: 0.25em 0 0 0.25em;
  */
`

const ReadingTime = styled.h5`
  display: inline;
  color: #606060;
  margin-bottom: 15px;
`

const outlineStyle = {
  borderLeft: '3px solid rgba(102, 102, 255, 0.8)',
  borderBottom: '3px solid rgba(102, 102, 255, 0.8)',
  marginBottom: '1em',
  paddingLeft: '0.5em',
  paddingTop: '0.5em',
  paddingBottom: '0em'

};

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <SEO title="Blog" />
      <Content>
        <h1>Blog</h1>
        {data.allMarkdownRemark.edges.map(({ node }) => (
          <div key={node.id} style={outlineStyle} >
            <Link
              to={node.frontmatter.path}
              css={css`
                text-decoration: none;
                color: inherit;
              `}>
              <MarkerHeader>{node.frontmatter.title} </MarkerHeader>
              <div>
                <ArticleDate>{node.frontmatter.date}</ArticleDate>
                <ReadingTime> - {node.fields.readingTime.text}</ReadingTime>
              </div>
              <p>Using: <i>{node.frontmatter.description}</i></p>
            </Link>
          </div>
        ))}
      </Content>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
            path
            description
          }
          fields {
            slug
            readingTime {
              text
            }
          }
          excerpt
        }
      }
    }
  }
`
