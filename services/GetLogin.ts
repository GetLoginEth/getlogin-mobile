import { Contract, utils, Wallet } from "ethers";

export class GetLogin {
  constructor(public dataContract: Contract, public logicContract: Contract) {

  }

  async login(username: string, password: string): Promise<Wallet> {
    const usernameHash = utils.keccak256(utils.toUtf8Bytes(username))
    const filters = await this.dataContract.filters['EventStoreWallet(bytes32,address,string,string,string,string)'](usernameHash)
    const result = await this.dataContract.queryFilter(filters)

    if (!result[0]?.args){
      throw new Error('Received empty data from contract')
    }

    const walletAddress = result[0].args[1] as string
    const ciphertext = result[0].args[2] as string
    const iv = result[0].args[3] as string
    const salt = result[0].args[4] as string
    const mac = result[0].args[5] as string

    const jsonWallet = JSON.stringify({
      version: 3,
      id: 'c218cc5a-d31b-4b29-9881-84421a719882',
      address: walletAddress.replace('0x', ''),
      crypto:{
        ciphertext,
        cipherparams: {iv},
        kdfparams: {
          dklen: 32,
          n: 8192,
          r: 8,
          p: 1,
          salt
        },
        cipher: 'aes-128-ctr',
        kdf: 'scrypt',
        mac
      }
    })

    return await Wallet.fromEncryptedJson(jsonWallet, password)
  }

  async signupWithInvite(username: string, password: string, invite: string): Promise<void> {

  }
}