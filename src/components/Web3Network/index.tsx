import React from 'react'
import styled from 'styled-components'

import useWeb3React from 'hooks/useWeb3'
import { useNetworkModalToggle } from 'state/application/hooks'
import { ChainInfo } from 'constants/chainInfo'

import NetworkModal from 'components/NetworkModal'
import { NavButton } from 'components/Button'

const Text = styled.p`
  width: fit-content;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: bold;
`

export default function Web3Network() {
  const { chainId } = useWeb3React()
  const toggleNetworkModal = useNetworkModalToggle()
  if (!chainId) return null

  return (
    <>
      <NavButton onClick={() => toggleNetworkModal()}>
        <Text>{ChainInfo[chainId]['label']}</Text>
      </NavButton>
      <NetworkModal />
    </>
  )
}
