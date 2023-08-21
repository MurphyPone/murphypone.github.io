import React from "react"
// import axios from "axios"
import { Link } from "gatsby"
import styled from "@emotion/styled"
import SEO from "../components/seo"
import { InfinitySpin } from "react-loader-spinner"
// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css";

// gross

const ThinContent = styled.div`
  max-width: 860px;
  padding: 1rem 1.0875rem;
  font-size: 1.2rem;
`

const NavLink = styled(Link)`
  color: black;
  margin-left: 15px;
  text-decoration: none;
  display: inline-block;
  position: relative;

  ::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: rgba(102, 102, 255, 0.8);
    transform-origin: bottom right;
    transition: transform 0.4s cubic-bezier(0.86, 0, 0.07, 1);
  }

  :hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`

const HomeLink = styled(NavLink)`
  margin-left: 0;
`

const SiteHeader = styled.header`
  background: transparent;
  display: flex;
  align-content: center;
  justify-content: center;
`

const Header = () => (
  <SiteHeader>
    <ThinContent>
      <p>
        <HomeLink to="/">projects</HomeLink>
        <NavLink to="/blog">blog</NavLink>
        <NavLink to="/psco">psco</NavLink>
        <NavLink to="/about">about</NavLink>
        <NavLink to="/about">reading list</NavLink>
      </p>
    </ThinContent>
  </SiteHeader>
)

const Layout = styled.div`
  margin: 0 auto;
  max-width: 1600px;
  padding: 0 1.0875rem 1rem;
  padding-top: 0;
`

// gross

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: repeat(3 1fr);
  grid-gap: 5px;
  border-top: solid rgb(102, 102, 255) 3px;
`

const Col = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`

const ImgContainer = styled.div`
  margin-top: 5px;
  margin-bottom: 5px;
`

const Head = styled.h1`
  text-align: center;
`

const Description = styled.div`
  text-align: center;
`

// for parsing the response list of individual images
const regex = /\["(https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9\-_]*)"/g

// Calls the proxy on the left
async function getAlbum() {
  const proxyUrl = "https://psco-cors-proxy.vercel.app/" // "http://127.0.0.1:5000"
  const response = await fetch(`${proxyUrl}`).then(data => data.json())

  console.log("array length: ", response, response.length)

  return { data: response }
}

const IndexPage = () => {
  const [images, setImages] = React.useState(null)
  React.useEffect(() => {
    let shouldCancel = false

    const call = async () => {
      const res1 = await getAlbum()

      if (!shouldCancel && res1.data && res1.data.length > 0) {
        const response = { data: res1.data }
        console.log(response)
        if (response.data && response.data.length > 0) {
          setImages(response.data.map(url => url))
        }
      }
    }
    call()

    // return () => shouldCancel = true
  }, [])

  if (images) {
    let reversed = images.slice().reverse()
    const images_left = reversed.filter(function(value, index, Arr) {
      return index % 3 === 0
    })

    const images_middle = reversed.filter(function(value, index, Arr) {
      return index % 3 === 1
    })

    const images_right = reversed.filter(function(value, index, Arr) {
      return index % 3 === 2
    })

    return (
      <Layout>
        <Header siteTitle="psco" />
        <SEO
          title="psco"
          keywords={[`Graphics`, `Peter Murphy`, `blog`, `portfolio`, `design`]}
        />
        <Head>psco</Head>
        <Container>
          <Col>
            {images_left.map(url => (
              <ImgContainer>
                <img
                  id="image"
                  src={url}
                  alt={""}
                  key={url}
                  referrerPolicy="no-referrer"
                />
              </ImgContainer>
            ))}
          </Col>

          <Col>
            {images_middle.map(url => (
              <ImgContainer>
                <img
                  id="image"
                  src={url}
                  alt={""}
                  key={url}
                  referrerPolicy="no-referrer"
                />
              </ImgContainer>
            ))}
          </Col>

          <Col>
            {images_right.map(url => (
              <ImgContainer>
                <img
                  id="image"
                  src={url}
                  alt={""}
                  key={url}
                  referrerPolicy="no-referrer"
                />
              </ImgContainer>
            ))}
          </Col>
        </Container>
      </Layout>
    )
  } else {
    return (
      <Layout>
        <SEO
          title="psco"
          keywords={[`Graphics`, `Peter Murphy`, `blog`, `portfolio`, `design`]}
        />
        <Head>psco</Head>
        {/* <p>something about a bunch of dead dogs</p> */}
        <div style={{ textAlign: "center" }}>
          <InfinitySpin width="200" color="#6666ff" />
        </div>
        <Container>
          <Col></Col>
          <Col></Col>
          <Col></Col>
        </Container>
      </Layout>
    )
  }
}

export default IndexPage
