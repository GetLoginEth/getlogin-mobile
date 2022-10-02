import { GetLogin } from './api/GetLogin'
import { Contract, providers } from 'ethers'
import dataAbi from './api/glDataAbi.json'
import logicAbi from './api/glLogicAbi.json'
import { setInitInfo } from './redux/init/initSlice'
import { getAccountIsLogged, getAccountMnemonic, getAccountUsername } from './services/Storage'
import { Dispatch } from 'redux'

export interface ABIAddress {
  networks: { [key: string]: Network }
}

export interface Network {
  address: string
}

export interface NetworkDescription {
  id: number
  jsonRpcProvider: string
  currency: string
  explorerUrl: string
  bzz: { address: string; name: string }
}

export class Instances {
  static getLogin: GetLogin | undefined
  static data: NetworkDescription | undefined

  static async init(dispatch: Dispatch) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    Instances.getGetLogin
    dispatch(
      setInitInfo({
        mnemonic: await getAccountMnemonic(),
        username: await getAccountUsername(),
        isLogged: await getAccountIsLogged(),
      }),
    )
  }

  static get getGetLogin() {
    // todo get network id from .env
    const REACT_APP_NETWORK = 'poa'
    const REACT_APP_NETWORKS = {
      poa: {
        id: 77,
        jsonRpcProvider: 'https://sokol.poa.network',
        currency: 'sPoa',
        explorerUrl: 'https://blockscout.com/poa/sokol/tx/',
        bzz: { address: '0xe14848E35424aff947E5aF94f9196538149a72fB', name: 'sBZZ' },
      },
      xdai: {
        id: 100,
        jsonRpcProvider: 'https://gno.getblock.io/mainnet/?api_key=243ac6b9-e198-4dc8-a7df-ab493ec7b7cd',
        currency: 'xDai',
        explorerUrl: 'https://blockscout.com/xdai/mainnet/tx/',
        bzz: { address: '0xdBF3Ea6F5beE45c02255B2c26a16F300502F68da', name: 'xBZZ' },
      },
    }
    const data = REACT_APP_NETWORKS[REACT_APP_NETWORK]
    const providerUrl = data.jsonRpcProvider

    // todo move to state
    if (Instances.data === undefined) {
      Instances.data = data
    }

    if (Instances.getLogin === undefined) {
      const dataAddress = (dataAbi as ABIAddress).networks[data.id].address
      const logicAddress = (logicAbi as ABIAddress).networks[data.id].address
      const dataContract = new Contract(dataAddress, dataAbi.abi, new providers.JsonRpcProvider(providerUrl))
      const logicContract = new Contract(logicAddress, logicAbi.abi)
      Instances.getLogin = new GetLogin(dataContract, logicContract)
    }

    return Instances.getLogin
  }
}
