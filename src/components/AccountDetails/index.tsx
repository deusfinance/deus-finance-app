import { useCallback } from 'react'
import { ExternalLink as LinkIcon } from 'react-feather'
import styled from 'styled-components'

import useWeb3React from 'hooks/useWeb3'
import { useAppDispatch } from 'state'
import { injected, walletlink } from '../../connectors'
import { SUPPORTED_WALLETS } from 'constants/wallet'
import { ExplorerDataType } from 'utils/explorers'
import { truncateAddress } from 'utils/account'
import { clearAllTransactions } from 'state/transactions/actions'

import { Connected as ConnectedIcon } from 'components/Icons'
import { ExplorerLink } from 'components/Link'
import Copy from 'components/Copy'
import Transaction from './Transaction'

const AccountWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  box-shadow: inset 0px 0px 1px rgba(255, 255, 255, 0.7);
  border-radius: 5px;
  padding: 10px;
  margin: 27px 15px;
  height: 125px;
`

const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: start;
  width: 100%;
`

const Title = styled.div`
  color: #6F7077;
  font-size: 15px;
`

const WalletAction = styled.button<{
  hide?: boolean,
  disable?: boolean,
}>`
  background: #0064FA;
  border-radius: 10px;
  outline: none;
  flex: 1;
  height: 25px;
  display: ${props => props.hide ? 'none' : 'flex'};
  justify-content: center;
  align-items: center;
  font-size: 12.5px;
  line-height: 30px;
  text-align: center;
  color: #FFFFFF;
  width: 100px;

  &:hover {
    background: #0050C8;
    cursor: pointer;
  }

  ${props => props.disable && `
    pointer-events: none;
    opacity: 0.3;
  `}
`

const MiddleRow = styled(Row)`
  justify-content: flex-start;
  align-items: center;
  color: #EFEFEF;
  gap: 5px;
  font-size: 20px;
`

const BottomRow = styled(Row)`
  justify-content: flex-start;
  align-items: center;
  color: #EFEFEF;
  gap: 5px;
  font-size: 12.5px;
`

const AddressLink = styled.div`
  display: flex;
  color: #0064FA;
  align-self: center;
  gap: 4px;
  font-size: 12.5px;
  margin-left: 10px;

  &:hover {
    color: #0050C8;
  }
`

const TransactionsWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  padding: 1.5rem;
  padding-top: 0;
  flex-grow: 1;
  overflow: auto;
  gap: 2px;
  & > * {
    &:first-child {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      font-size: 15px;
      margin-bottom: 2px;

      & > * {
        &:nth-child(2) {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 5px 6px;
          font-size: 12px;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
`

function renderTransactions(transactions: string[]) {
  return (
    <>
      {transactions.map((hash, i) => {
        return <Transaction key={i} hash={hash} />
      })}
    </>
  )
}

interface AccountDetailsProps {
  pendingTransactions: string[]
  confirmedTransactions: string[]
  openOptions: () => void
}

export default function AccountDetails({
  pendingTransactions,
  confirmedTransactions,
  openOptions,
}: AccountDetailsProps) {
  const { chainId, account, connector } = useWeb3React()
  const dispatch = useAppDispatch()

  function getConnectorName() {
    const isMetaMask = !!(window.ethereum && window.ethereum.isMetaMask)
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(k => SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'METAMASK')))
      .map((k) => SUPPORTED_WALLETS[k].name)[0]
    return (
      <Title>
        Connected with {name}
      </Title>
    )
  }

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  return (
    <>
      <AccountWrapper>
        <Row>
          {getConnectorName()}
          <div>
            {connector !== injected && connector !== walletlink && (
              <WalletAction
                style={{ fontSize: '.825rem', fontWeight: 400, marginRight: '8px' }}
                onClick={() => {
                  ;(connector as any).close()
                }}
              >
                Disconnect
              </WalletAction>
            )}
            <WalletAction
              style={{ fontSize: '.825rem', fontWeight: 400 }}
              onClick={() => {
                openOptions()
              }}
            >
              Change
            </WalletAction>
          </div>
        </Row>
        <MiddleRow>
          {connector && <ConnectedIcon />}
          {account && truncateAddress(account)}
        </MiddleRow>
        <BottomRow>
          {account && <Copy toCopy={account} text={'Copy Address'}/>}
          {chainId && account && (
            <ExplorerLink
              type={ExplorerDataType.ADDRESS}
              chainId={chainId}
              value={account}
            >
              <AddressLink>
                View on Explorer
                <LinkIcon size={12} style={{ transform: 'translateY(1px)'}} />
              </AddressLink>
            </ExplorerLink>
          )}
        </BottomRow>
      </AccountWrapper>
      {!!pendingTransactions.length || !!confirmedTransactions.length ? (
        <TransactionsWrapper>
          <div>
            <div>
              Recent Transactions
            </div>
            <div onClick={clearAllTransactionsCallback}>
              (clear all)
            </div>
          </div>
          {renderTransactions(pendingTransactions)}
          {renderTransactions(confirmedTransactions)}
        </TransactionsWrapper>
      ) : (
        <TransactionsWrapper>
          <div style={{fontSize: '13px'}}>
            Your transactions will appear here...
          </div>
        </TransactionsWrapper>
      )}
    </>
  )
}
