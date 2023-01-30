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

const Books = ({ data }) => {
  return (
    <Layout>
      <SEO title="typo factory" />
      <Content>
        <center>
          <h1>reading list</h1>
        </center>

        <p>
          In which I've taken the leisurely activity of reading and{" "}
          <em>RUINED</em> it by throwing it into a spreadsheet. Buncha books I
          mostly enjoyed reading or look forward to reading. Except some bad
          ones which I threw in there to balance out the scores.
        </p>

        <iframe
          width="100%"
          height="1000px"
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTBZPsE486ozTtLsaeS5YoxzR0indiaZv3HCWMyYMJcyDyNe-AagmfBYYChX95zC--To_ULwY24s04z/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false"
        ></iframe>
      </Content>
    </Layout>
  )
}

export default Books
