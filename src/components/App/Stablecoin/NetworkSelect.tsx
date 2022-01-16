import React from 'react'
import styled from 'styled-components'

import useWeb3React from 'hooks/useWeb3'
import useRpcChangerCallback from 'hooks/useRpcChangerCallback'
import { SUPPORTED_CHAIN_IDS } from 'constants/chains'
import { ChainInfo } from 'constants/chainInfo'

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  width: 100%;
`

const Item = styled.div<{
  active?: boolean
}>`
  flex: 1;
  font-size: 13px;
  line-height: 30px;
  text-align: center;
  align-items: center;
  background: rgba(13, 18, 29, 0.5);
  border: 1px solid #212936;
  color: #7E7E7E;

  &:hover {
    cursor: pointer;
  }

  ${props => props.active && `
    filter: drop-shadow(0px 0px 45px rgba(0, 0, 0, 0.05));
    background: #0D121D;
    border: 1px solid #FFA76A;
    color: #EFEFEF;
  `}

  &:first-child {
    border-radius: 10px 0 0 10px;
  }

  &:last-child {
    border-radius: 0 10px 10px 0;
  }
`

export default function NetworkSelect ({ chains = [] }: { chains?: number[] }) {
  const { chainId } = useWeb3React()
  const rpcChangerCallback = useRpcChangerCallback()

  return (
    <Wrapper>
      {(chains ?? SUPPORTED_CHAIN_IDS).map((id: number, index) => {
        return (
          <Item
            active={id == chainId}
            onClick={() => rpcChangerCallback(id)}
            key={index}
          >{ChainInfo[id]['label']}</Item>
        )
      })}
    </Wrapper>
  )
}
