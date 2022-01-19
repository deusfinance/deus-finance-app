import React, { useMemo } from 'react'
import styled from 'styled-components'

import useWeb3React from 'hooks/useWeb3'
import useRpcChangerCallback from 'hooks/useRpcChangerCallback'
import { SupportedChainId, SUPPORTED_CHAIN_IDS } from 'constants/chains'
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
  background: ${({ theme }) => theme.bg0};
  border: 1px solid ${({ theme }) => theme.border2};
  color: ${({ theme }) => theme.text2};

  ${({ theme, active }) =>
    active &&
    `
    background: ${theme.bg1};
    border: 1px solid ${theme.primary2};
    color: ${theme.text2};
  `}

  &:first-child {
    border-radius: 10px 0 0 10px;
  }

  &:last-child {
    border-radius: 0 10px 10px 0;
  }

  &:hover {
    cursor: pointer;
  }
`

export default function NetworkSelect({ chains = [] }: { chains?: number[] }) {
  const { chainId, account } = useWeb3React()
  const rpcChangerCallback = useRpcChangerCallback()

  const isConnected = useMemo(() => chainId && account, [chainId, account])

  return (
    <Wrapper>
      {isConnected &&
        (chains ?? SUPPORTED_CHAIN_IDS).map((id: SupportedChainId, index) => {
          return (
            <Item active={id == chainId} onClick={() => rpcChangerCallback(id)} key={index}>
              {ChainInfo[id]['label']}
            </Item>
          )
        })}
    </Wrapper>
  )
}
