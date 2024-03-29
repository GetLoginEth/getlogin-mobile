import { GetLogin } from './api/GetLogin'
import { Contract, providers, Wallet } from 'ethers'
import dataAbi from './api/glDataAbi.json'
import logicAbi from './api/glLogicAbi.json'
import { setInitInfo, setIsLogged } from './redux/init/initSlice'
import { getAccountIsLogged, getAccountUsername, getLogged } from './services/storage'
import { Dispatch } from 'redux'
import { JsonRpcProvider } from '@ethersproject/providers'

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
  static currentWallet: Wallet | undefined

  static async init(dispatch: Dispatch) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    Instances.getGetLogin
    const { username, mnemonic, isLogged } = await getLogged()

    if (!(username && mnemonic && isLogged)) {
      dispatch(setIsLogged(false))

      return
    }

    return new Promise(resolve => {
      setTimeout(async () => {
        const rpcUrl = Instances.data?.jsonRpcProvider

        if (!rpcUrl) {
          throw new Error('Incorrect rpc url')
        }
        const wallet = Wallet.fromMnemonic(mnemonic).connect(new JsonRpcProvider(rpcUrl))
        Instances.currentWallet = wallet

        dispatch(
          setInitInfo({
            mnemonic,
            address: wallet.address,
            username: await getAccountUsername(),
            isLogged: await getAccountIsLogged(),
          }),
        )
        dispatch(setIsLogged(true))
        resolve(true)
      }, 10)
    })
  }

  static get getGetLogin() {
    const REACT_APP_NETWORK = __DEV__ ? 'poa' : 'xdai'
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
        jsonRpcProvider: 'https://xdai.fairdatasociety.org',
        currency: 'xDai',
        explorerUrl: 'https://blockscout.com/xdai/mainnet/tx/',
        bzz: { address: '0xdBF3Ea6F5beE45c02255B2c26a16F300502F68da', name: 'xBZZ' },
      },
    }
    const data = REACT_APP_NETWORKS[REACT_APP_NETWORK]
    const providerUrl = data.jsonRpcProvider

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
