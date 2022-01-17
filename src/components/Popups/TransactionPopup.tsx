import React from 'react'
import styled from 'styled-components'

import useWeb3React from 'hooks/useWeb3'
import { ExplorerLink } from 'components/Link'
import { CheckMark, Copy as CopyIcon, Close } from 'components/Icons'
import { ExplorerDataType } from 'utils/explorers'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  width: 100%;
  padding: 14px 20px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
  color: #919191;
`

const SuccessBox = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  gap: 10px;
  align-items: center;
  margin-top: 15px;
  background: #293241;
  border: 1px solid #00e376;
  border-radius: 10px;
  height: 35px;
  padding: 10px;
  text-decoration: none;

  & > * {
    font-size: 12.5px;
    line-height: 35px;
    &:first-child {
      margin-right: 8px;
    }
    &:last-child {
      margin-left: auto;
    }
  }
`

export default function TransactionPopup({
  hash,
  success,
  summary,
  removeThisPopup,
}: {
  hash: string
  success?: boolean
  summary?: string
  removeThisPopup: () => void
}) {
  const { chainId } = useWeb3React()

  const getHeader = () => {
    return (
      <Header>
        {summary}
        <Close onClick={removeThisPopup} />
      </Header>
    )
  }

  const getBox = () => {
    return (
      <ExplorerLink chainId={chainId ?? 1} type={ExplorerDataType.TRANSACTION} value={hash}>
        <SuccessBox color={success ? '#00E376' : 'red'}>
          <CheckMark color={success ? '#00E376' : 'red'} />
          <div>Transaction {success ? 'successful' : 'failed'}</div>
          <CopyIcon />
        </SuccessBox>
      </ExplorerLink>
    )
  }

  return (
    <Wrapper>
      {getHeader()}
      {getBox()}
    </Wrapper>
  )
}
