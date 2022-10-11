import { Contract, Signer, utils, Wallet } from 'ethers'
import { Provider } from '@ethersproject/abstract-provider'
import { ContractTransaction } from '@ethersproject/contracts/src.ts'

export class GetLogin {
  constructor(public dataContract: Contract, public logicContract: Contract) {}

  /**
   * Creates random wallet
   */
  createWallet(): Wallet {
    return Wallet.createRandom()
  }

  /**
   * Checks is address assigned to username
   *
   * @param address Ethereum wallet address
   */
  async isAddressAssigned(address: string): Promise<boolean> {
    const response = await this.dataContract.callStatic.UsersAddressUsername(address)

    return response.length > 0 ? Boolean(response[0]) : false
  }

  async isAddressAssignedToUsername(address: string, username: string): Promise<boolean> {
    const usernameHash = utils.keccak256(utils.toUtf8Bytes(username))
    const response = await this.dataContract.callStatic.UsersAddressUsername(address)

    if (response.length > 0) {
      return response[1] === usernameHash
    } else {
      return false
    }
  }

  /**
   * Logins with username and password
   */
  async login(username: string, password: string): Promise<Wallet> {
    const usernameHash = utils.keccak256(utils.toUtf8Bytes(username))
    const filters = await this.dataContract.filters['EventStoreWallet(bytes32,address,string,string,string,string)'](
      usernameHash,
    )
    const result = await this.dataContract.queryFilter(filters)
    const args = result[0]?.args

    if (!args) {
      throw new Error('Received empty data from contract')
    }

    // todo simplify it with my own parser or find a solution
    const walletAddress = args[1] as string
    const ciphertext = args[2] as string
    const iv = args[3] as string
    const salt = args[4] as string
    const mac = args[5] as string

    const jsonWallet = JSON.stringify({
      version: 3,
      id: 'c218cc5a-d31b-4b29-9881-84421a719882',
      address: walletAddress.replace('0x', ''),
      crypto: {
        ciphertext,
        cipherparams: { iv },
        kdfparams: {
          dklen: 32,
          n: 8192,
          r: 8,
          p: 1,
          salt,
        },
        cipher: 'aes-128-ctr',
        kdf: 'scrypt',
        mac,
      },
    })

    return await Wallet.fromEncryptedJson(jsonWallet, password)
  }

  // todo all methods should be covered with tests with blockchain or at least mocks (correct and incorrect)

  /**
   * Creates user from an invite
   *
   * Storing account is less secure, but faster. Without storing all funds will be transferred from an invite to the accountWallet
   *
   * @param username username to register
   * @param invite invite (eth private key)
   * @param accountWallet wallet created for managing an account
   * @param isStoreWallet store account wallet in smart contract or not
   */
  async createUserFromInvite(
    username: string,
    invite: string,
    accountWallet: Wallet,
    isStoreWallet = false,
  ): Promise<void> {
    // INVITE
    // todo if user created with an invite and wallet SHOULD be stored in data use - function createUserFromInvite(bytes32 _usernameHash, address payable _walletAddress, string memory _ciphertext, string memory _iv, string memory _salt, string memory _mac, bool _allowReset)
    // todo if user created with an invite and wallet SHOULD NOT be stored in data use - Transfer all finance to the new wallet then function createUser(bytes32 _usernameHash)
    // todo would be great to have `createUserFromInvite` in smart contract without storing the wallet data
  }

  /**
   * Creates user with signer
   *
   * @param username text representation of username
   * @param signerOrProvider signer which will sign the registration transaction
   */
  async createUser(username: string, signerOrProvider: Signer | Provider | string): Promise<ContractTransaction> {
    const contract = this.logicContract.connect(signerOrProvider)
    const usernameHash = utils.keccak256(utils.toUtf8Bytes(username))

    return contract.functions.createUser(usernameHash)
  }

  // async getGlobalSettings(signerOrProvider: Signer | Provider | string): Promise<void> {
  //   const contract = this.logicContract.connect(signerOrProvider)
  //   const result = await contract.callStatic.getGlobalSettings('settingsInvitesOnly')
  //   console.log('result', result)
  // }

  /**
   * Creates app session (Ethereum wallet) with some funds
   *
   * @param applicationId target application id
   * @param sessionAddress address of session Ethereum wallet
   * @param options options with storing configuration
   */
  async createAppSession(applicationId: number, sessionAddress: string, options?: any): Promise<void> {
    // todo options = {isStoreSession: boolean, ...(session params)}
    // todo if (isStoreSession) - call "function createAppSession(uint64 _appId, address payable _sessionAddress, string memory _iv, string memory _ephemPublicKey, string memory _ciphertext, string memory _mac) public payable"
    // todo if (!isStoreSession) - call "function createSimpleAppSession(uint64 _appId, address payable _sessionAddress) public payable"
    // todo if this session wallet encrypted async - then could be used isStoreSession = true as default because main wallet will be safe locally
  }

  /**
   * Get application session (Ethereum wallet)
   *
   * @param username username of the session owner
   * @param applicationId application id
   * @param accountPrivateKey private key of the main account to decrypt the session
   */
  async getAppSession(username: string, applicationId: number, accountPrivateKey: string): Promise<Wallet> {}

  // todo write this class to make compatible with frontend. similar methods/params types
  // todo check if possible to interact with smart contract without uploading wallet to sm-data
  // todo signup with local wallet. optionally upload it to smart contract
  // todo signup with local wallet + invite. optionally upload it to smart contract
  // async signupWithInvite(username: string, password: string, invite: string): Promise<void> {}
}
