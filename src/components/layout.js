/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
import styled from "@emotion/styled"
import { SocialIcon } from 'react-social-icons';

import Header from "./header"
import "./layout.css"

const Content = styled.div`
  margin: 0 auto;
  max-width: 860px;
  padding: 0 1.0875rem 1rem;
  padding-top: 0;
`

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  border-top: 3px solid   rgb(102, 102, 255);
`

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Header siteTitle={data.site.siteMetadata.title} />
        <Content>
          <main>{children}</main>
          <Footer>
            <SocialIcon url="https://www.linkedin.com/in/petersmurphy7/" target="_blank" fgColor="#6666ff" bgColor="#ffffff" />
            <SocialIcon url="http://github.com/murphypone" target="_blank" fgColor="#6666ff" bgColor="#ffffff" />
            <SocialIcon url="http://twitter.com/petersmurphy7" target="_blank" fgColor="#6666ff" bgColor="#ffffff" />
            <SocialIcon url="http://instagram.com/petersmurphy7" target="_blank" fgColor="#6666ff" bgColor="#ffffff" />
            <SocialIcon url="http://youtube.com/plotsmurphy" target="_blank" fgColor="#6666ff" bgColor="#ffffff" />
          </ Footer>
        </Content>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
