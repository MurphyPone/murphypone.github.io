import styled from "@emotion/styled"
import React from "react"

const Content = styled.div`
  font-style: italic;
  text-align: center;
  font-weight: 3px;
`

const Lyric = () => {
  const lyrics = [
    "I just had so much to say but you don't want to hear it anyway so I will sit and keep my mouth shut",
    "You won't hear from me for months or years, or I don't even care how long cause I don't want to think about you anymore",
    "It's up to you to fix your faults",
    "Less morose and more present; dwell on my gifts for a second",
  ]

  return (
    <Content>
      {lyrics[Math.floor((Math.random()*lyrics.length))]}
    </Content>
  )
}


export default Lyric
