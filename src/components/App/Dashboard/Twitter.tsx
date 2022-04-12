import React from 'react'
import styled from 'styled-components'

import { TwitterTimelineEmbed } from 'react-twitter-embed'

const TwitterWrap = styled.div`
  border-radius: 10px;
  flex-grow: 1;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  margin: 0 10px;
  background: ${({ theme }) => theme.bg0};

  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin: 20px;
  `};
`

const Header = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  background: ${({ theme }) => theme.specialBG3};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export default function Twitter() {
  return (
    <TwitterWrap>
      <Header>Announcements</Header>
      <TwitterTimelineEmbed
        sourceType="profile"
        screenName="DeusDao"
        options={{ height: 652 }}
        noHeader={true}
        theme="dark"
        transparent
        noBorders={true}
      />
    </TwitterWrap>
  )
}
