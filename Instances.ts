import { GetLogin } from "./services/GetLogin";
import { Contract, providers } from "ethers";
import dataAbi from "./services/glDataAbi.json"
import logicAbi from "./services/glLogicAbi.json"

export class Instances {
  static getLogin: GetLogin | undefined

  static get getGetLogin() {
    const REACT_APP_NETWORK = 'xdai'
    let REACT_APP_NETWORKS = {
      "poa": {
        "id": 77,
        "jsonRpcProvider": "https://sokol.poa.network",
        "currency": "xPoa",
        "explorerUrl": "https://blockscout.com/poa/sokol/tx/",
        "bzz": {"address": "0xe14848E35424aff947E5aF94f9196538149a72fB", "name": "sBZZ"}
      },
      "xdai": {
        "id": 100,
        "jsonRpcProvider": "https://rpc.xdaichain.com",
        "currency": "xDai",
        "explorerUrl": "https://blockscout.com/xdai/mainnet/tx/",
        "bzz": {"address": "0xdBF3Ea6F5beE45c02255B2c26a16F300502F68da", "name": "xBZZ"}
      }
    }
    const data = REACT_APP_NETWORKS[REACT_APP_NETWORK]
    const providerUrl = data.jsonRpcProvider
    if(Instances.getLogin === undefined){
      // todo or get them from abi?
      const dataAddress = '0xCaC5144CDf47C4e5BB58D572E56234510f818D81'
      const logicAddress = '0x96aa32F603C8f813C74479Bb4973ec4b46Ad2adE'
      const dataContract = new Contract(dataAddress, dataAbi.abi, new providers.JsonRpcProvider(providerUrl))
      const logicContract = new Contract(logicAddress, logicAbi.abi)
      Instances.getLogin = new GetLogin(dataContract, logicContract)
    }

    return Instances.getLogin;
  }
}