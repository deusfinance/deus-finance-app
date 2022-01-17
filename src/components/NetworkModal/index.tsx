import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'

import { useModalOpen, useNetworkModalToggle } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import useWeb3React from 'hooks/useWeb3'
import useRpcChangerCallback from 'hooks/useRpcChangerCallback'

import { SupportedChainId, SUPPORTED_CHAIN_IDS } from 'constants/chains'
import { ChainInfo } from 'constants/chainInfo'
import { Modal, ModalHeader } from 'components/Modal'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  gap: 8px;
  padding: 25px 20px;
  overflow-y: auto;
`

const Option = styled.div<{
  active?: boolean
}>`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  background: rgb(28, 28, 28);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #efefef;
  font-size: 20px;
  border-radius: 5px;
  outline: none;
  height: 50px;
  align-items: center;
  padding: 12px 20px;

  ${(props) =>
    props.active &&
    `
    background: #0D121D;
    border: 1px solid #0064FA;
  `}

  &:focus,
  &:hover {
    background: #0d121d;
    cursor: pointer;
  }

  & > * {
    &:first-child {
      border-radius: 3px;
    }
  }
`

export default function NetworkModal() {
  const { chainId } = useWeb3React()
  const modalOpen = useModalOpen(ApplicationModal.NETWORK)
  const toggleModal = useNetworkModalToggle()
  const rpcChangerCallback = useRpcChangerCallback()
  if (!chainId) return null

  return (
    <Modal isOpen={modalOpen} onBackgroundClick={toggleModal} onEscapeKeydown={toggleModal}>
      <ModalHeader onClose={toggleModal} title="Select a Network" />
      <Wrapper>
        {Object.values(SUPPORTED_CHAIN_IDS).map((id: SupportedChainId, index) => {
          const active = chainId == id
          return (
            <Option
              key={index}
              active={active}
              onClick={() => {
                if (active) return
                toggleModal()
                rpcChangerCallback(id)
              }}
            >
              <div>{ChainInfo[id]['label']}</div>
              <Image
                src={require(`../../assets/images/network/${SupportedChainId[id]}.jpg`)}
                alt={`${ChainInfo[id]['label']} Network`}
                width={30}
                height={30}
              />
            </Option>
          )
        })}
      </Wrapper>
    </Modal>
  )
}
