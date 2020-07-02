import React from "react"
import styled from "@emotion/styled"
import Layout from "../components/layout"
import SEO from "../components/seo"

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: repeat(3 1fr);
  grid-gap: 15px;
`
const Col = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`

const Head = styled.h2`
 border-bottom: solid rgb(102, 102, 255) 3px;
 text-align: center;
`

const IndexPage = () => (
  <Layout>
    <SEO title="About" keywords={[`Graphics`, `Peter Murphy`, `blog`, `portfolio`, `design`]} />
    <center><h1>Graphic Design Portfolio</h1></center>
    <Container>
      <Col>
      <Head>Cover Art</Head>
        <div class="trigger">
          <img id="image" src="/gallery/thumbnails/thumb_Where I Stay.png" alt="where i stay"/>
          <a id="lbl">Where I Stay v3</a>
        </div>
        <br/>
        <div class="trigger">
          <img id="image" src="/gallery/thumbnails/thumb_faceTongue400.png" alt="face"/>
          <a id="lbl">HEF</a>
        </div>
        <br/>
        <div class="trigger">
          <img id="image" src="/gallery/thumbnails/thumb_Masonic Views Fade.png" alt="masonic"/>
          <a id="lbl">Masonic Views</a>
        </div>
        <br/>
        <div class="trigger">
          <img id="image" src="/gallery/thumbnails/thumb_riptide.png" alt="riptide"/>
          <a id="lbl">Riptide</a>
        </div>
      </Col>

      <Col>
        <Head>Doodles, Tattoos</Head>
        <div class="trigger">
          <img id="image" src="/gallery/thumbnails/thumb_Smoking Man.png"/>
          <a id="lbl">Smoking Man</a>
        </div>
        <br/>
        <div class="trigger">
          <img id="image" src="/gallery/thumbnails/thumb_smoking hand.png"/>
          <a id="lbl">Troll w/Winni Blue</a>
        </div>
        <br/>
        <div class="trigger">
          <img id="image" src="/gallery/thumbnails/thumb_abstract triangles.png" alt="triangles"/>
          <a id="lbl">Trapped in a Burning House Video</a>
        </div>
        <br/>
        <div class="trigger">
          <img id="image" src="/gallery/thumbnails/thumb_mountainglobe.png" alt="globe"/>
          <a id="lbl">Mountain Globe</a>
        </div>
        <br/>
        <div class="trigger">
          <img id="image" src="/gallery/thumbnails/thumb_Moon.png" alt="moon"/>
          <a id="lbl">Moonset</a>
        </div>
        <br/>
        <div class="trigger">
          <img id="image" src="/gallery/thumbnails/thumb_Ricardo's EYE.png" alt="eye"/>
          <a id="lbl">Ricardo Avolo</a>
        </div>
        <br/>
        <div class="trigger">
          <img id="image" src="/gallery/thumbnails/thumb_macmiller.png" alt="swimming"/>
          <a id="lbl">Swimming</a>
        </div>
      </Col>
      <Col>
        <Head>Commissions</Head>
        <div class="trigger">
            <img id="image" src="/gallery/thumbnails/thumb_ethanslogo.png"/>
            <a id="lbl">Cthulu</a>
          </div>
          <br/>
          <div class="trigger">
            <img id="image" src="/gallery/full/rap dog.png" />
            <a id="lbl">Just bad a pun</a>
          </div>
          <br/>
          <div class="trigger">
            <img id="image" src="/gallery/thumbnails/thumb_Buzzsaw.png" />
            <a id="lbl">Borderlands 2: Kreig's buzzsaw</a>
          </div> 
          <br/>
          <div class="trigger"> 
            <img id="image" src="/gallery/thumbnails/thumb_Lillith.png" />
            <a id="lbl">Borderlands 2: Lillith</a>
          </div>
          <br/>
      </Col>
    </Container>
  </Layout>
)

export default IndexPage
