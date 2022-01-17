import React from 'react'
import styled from 'styled-components'
import StyledModal from 'styled-react-modal'

import { Close as CloseIcon } from 'components/Icons'
import { ChevronLeft as ChevronLeftIcon } from 'components/Icons'

export const Modal = StyledModal.styled`
  display: flex;
  flex-flow: column nowrap;
  background: rgb(13,13,13);
  box-shadow: inset 0px 0px 1px rgba(255, 255, 255, 0.7);
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: clamp(200px, 75%, 420px);
  border-radius: 10px;
`

export const ModalBackground = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(1px);
  justify-content: center;
`

const HeaderWrapper = styled.div<{
  border: boolean
}>`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${(props) => (props.border ? '#6D737D' : 'transparent')};
`

const Text = styled.div<{
  size: string
}>`
  font-size: ${(props) => props.size};
`

export const ModalHeader = ({
  title,
  headerSize = '15px',
  border = false,
  onClose,
  onBack,
}: {
  title?: string
  headerSize?: string
  border?: boolean
  onClose: () => void
  onBack?: () => void
}) => {
  return (
    <HeaderWrapper border={border}>
      {onBack && <ChevronLeftIcon onClick={onBack} width={parseFloat(headerSize)} height={parseFloat(headerSize)} />}
      {title && <Text size={headerSize}>{title}</Text>}
      <CloseIcon width={headerSize} height={headerSize} onClick={onClose} />
    </HeaderWrapper>
  )
}
