import { MuonResponse, IError } from '../types'
import { Type, isError, getErrorMessage } from '../error'
import { MuonClient } from './base'
import { MUON_BASE_URL } from '../config'

interface RequestParams {
  depositAddress: string
  depositTxId: string
  depositNetwork: number
}

interface ClaimData {
  success: true
  data: {
    response: MuonResponse
    calldata: {
      reqId: string
      txId: string
      tokenId: string
      fromChainId: string
      toChainId: string
      amount: string
      sigs: {
        signature: string
        owner: string
        nonce: string
      }[]
    }
  }
}

export class BridgeClient extends MuonClient {
  constructor(baseURL?: string) {
    super({
      baseURL: baseURL ?? MUON_BASE_URL,
      nSign: 4,
      APP_ID: 'deus_bridge',
      APP_METHOD: 'claim',
    })
  }

  private _getRequestParams(depositAddress: string, depositTxId: string, depositNetwork: number): Type<RequestParams> {
    if (!depositAddress || !depositTxId || !depositNetwork) return new Error('missing claim dependencies.')

    const address = this._getChecksumAddress(depositAddress)
    if (!address) return new Error('Param `depositAddress` is not a valid address.')

    return {
      depositAddress: address,
      depositTxId,
      depositNetwork,
    }
  }

  public async getClaimData(
    depositAddress: string,
    depositTxId: string,
    depositNetwork: number
  ): Promise<ClaimData | IError> {
    try {
      const requestParams = this._getRequestParams(depositAddress, depositTxId, depositNetwork)
      if (isError(requestParams)) throw new Error(requestParams.message)
      console.info('Requesting data from Muon: ', requestParams)

      const response = await this._makeRequest(requestParams)
      if (isError(response)) throw new Error(response.message)
      console.info('Response from Muon: ', response)

      if ('error' in response) {
        throw new Error(response.error)
      } else if (!response.success || !response.result.confirmed) {
        throw new Error('An unknown Muon error has occurred')
      }

      const result = response.result
      const reqId = `0x${result?.cid?.substring(1)}`

      const depositResult = result?.data?.result
      const txId = depositResult?.txId
      const tokenId = depositResult?.tokenId
      const fromChainId = depositResult?.fromChain
      const toChainId = depositResult?.toChain
      const amount = depositResult?.amount

      const signature = result?.signatures[0]?.signature
      const owner = result?.signatures[0]?.owner
      const nonce = result?.data?.init?.nonceAddress

      const sigs = [
        {
          signature,
          owner,
          nonce,
        },
      ]

      return {
        success: true,
        data: {
          response,
          calldata: {
            reqId,
            txId,
            tokenId,
            fromChainId,
            toChainId,
            amount,
            sigs,
          },
        },
      }
    } catch (err) {
      console.error(err)
      return {
        success: false,
        error: getErrorMessage(err),
      }
    }
  }
}
