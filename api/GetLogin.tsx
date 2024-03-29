import { Contract, Signer, utils, Wallet, ContractTransaction } from 'ethers'
import { Provider } from '@ethersproject/abstract-provider'

/**
 * Information for storing application session in smart contract
 */
export interface EncryptedApplicationSession {
  iv: string
  ephemPublicKey: string
  ciphertext: string
  mac: string
}

/**
 * Information for amount of ETH to transfer during application session creation
 */
export interface ApplicationSessionPayment {
  amountEth: string
}

/**
 * Information about session tied to the app
 */
export interface AppSession {
  address: string
  applicationId: number
  isActive: boolean
}

/**
 * Information about 3rd party application
 */
export interface ApplicationInformation {
  applicationId: number
  usernameHash: string
  title: string
  description: string
  allowedUrls: string[]
  allowedContracts: string[]
  isActive: boolean
}

/**
 * Options for storing application sessions
 */
export interface StoreSessionOptions {
  isStoreApplicationSession: boolean
  encryptedApplicationSession?: EncryptedApplicationSession
  applicationSessionPayment?: ApplicationSessionPayment
}

export class GetLogin {
  constructor(public dataContract: Contract, public logicContract: Contract) {}

  /**
   * Creates random wallet
   */
  createWallet(): Wallet {
    return Wallet.createRandom()
  }

  /**
   * Checks that username registered
   */
  async isUsernameRegistered(username: string): Promise<boolean> {
    const usernameHash = utils.keccak256(utils.toUtf8Bytes(username))
    const response = await this.dataContract.callStatic.Users(usernameHash)

    return response.length >= 3 && response[2]
  }

  /**
   * Gets address by username
   */
  async getAddressByUsername(username: string): Promise<string> {
    const usernameHash = utils.keccak256(utils.toUtf8Bytes(username))
    const response = await this.dataContract.callStatic.Users(usernameHash)

    const result = response.length >= 3 && response[1]

    if (!result || result === '0x0000000000000000000000000000000000000000') {
      throw new Error('Address is not assigned')
    }

    return result
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

    if (!(await this.isUsernameRegistered(username))) {
      throw new Error('User not registered')
    }
    const filters = await this.dataContract.filters['EventStoreWallet(bytes32,address,string,string,string,string)'](
      usernameHash,
    )
    const result = await this.dataContract.queryFilter(filters)
    const args = result[0]?.args

    if (!args) {
      throw new Error("User registered with your local wallet. You can't login with password")
    }

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

  /**
   * Creates application
   *
   * @param title title of the application
   * @param description description of the application
   * @param allowedUrls array or allowed urls for authentication (for web version)
   * @param allowedContracts allowed contracts for interaction
   * @param signerOrProvider signer for interaction with the logic contract
   */
  async createApplication(
    title: string,
    description: string,
    allowedUrls: string[],
    allowedContracts: string[],
    signerOrProvider: Signer | Provider | string,
  ): Promise<ContractTransaction> {
    const contract = this.logicContract.connect(signerOrProvider)

    return contract.createApplication(title, description, allowedUrls, allowedContracts)
  }

  /**
   * Creates app session (Ethereum wallet) with some funds
   *
   * @param applicationId target application id
   * @param sessionAddress address of session Ethereum wallet
   * @param signerOrProvider signer of the account
   * @param options storing options
   */
  async createAppSession(
    applicationId: number,
    sessionAddress: string,
    signerOrProvider: Signer | Provider | string,
    options?: StoreSessionOptions,
  ): Promise<ContractTransaction> {
    const contract = this.logicContract.connect(signerOrProvider)

    const isStoreApplicationSession = options?.isStoreApplicationSession
    const encryptedApplicationSession = options?.encryptedApplicationSession
    const applicationSessionPayment = options?.applicationSessionPayment

    const params = {
      value: applicationSessionPayment ? utils.parseUnits(applicationSessionPayment.amountEth) : 0,
    }

    if (isStoreApplicationSession && encryptedApplicationSession) {
      const { iv, ephemPublicKey, ciphertext, mac } = encryptedApplicationSession

      return contract.createAppSession(applicationId, sessionAddress, iv, ephemPublicKey, ciphertext, mac, params)
    } else {
      return contract.createSimpleAppSession(applicationId, sessionAddress, params)
    }
  }

  /**
   * Closes application session for current user
   */
  async closeAppSession(
    applicationId: number,
    signerOrProvider: Signer | Provider | string,
  ): Promise<ContractTransaction> {
    const contract = this.logicContract.connect(signerOrProvider)

    return contract.closeAppSession(applicationId)
  }

  async getAppSession(
    applicationId: number,
    username: string,
    signerOrProvider: Signer | Provider | string,
  ): Promise<AppSession> {
    const usernameHash = utils.keccak256(utils.toUtf8Bytes(username))
    const contract = this.dataContract.connect(signerOrProvider)
    const response = (await contract.callStatic.getAppSessions(applicationId, usernameHash)).filter((item: any) => {
      if (item.length < 4) {
        return false
      }

      return Boolean(item[3])
    })

    if (response.length > 0) {
      const data = response[0]

      return {
        applicationId,
        address: data[1] as string,
        isActive: data[3] as boolean,
      }
    } else {
      throw new Error(`Application session for not found for id: ${applicationId}`)
    }
  }

  /**
   * Gets the list of active sessions
   *
   * @param username username of the owner of sessions
   * @param signerOrProvider provider for logic contract reading
   */
  async getActiveAppSessions(username: string, signerOrProvider: Signer | Provider | string): Promise<AppSession[]> {
    const usernameHash = utils.keccak256(utils.toUtf8Bytes(username))
    const contract = this.logicContract.connect(signerOrProvider)
    const response = await contract.callStatic.getActiveAppSessions(usernameHash)

    return response.map((item: any) => ({
      address: item[1],
      applicationId: Number(item[2].toString()),
      isActive: item[3],
    }))
  }

  /**
   * Gets information about specific application
   *
   * @param applicationId application id
   * @param signerOrProvider provider for logic contract reading
   */
  async getApplication(
    applicationId: number,
    signerOrProvider: Signer | Provider | string,
  ): Promise<ApplicationInformation> {
    const contract = this.logicContract.connect(signerOrProvider)
    const response = await contract.callStatic.getApplication(applicationId)

    return {
      applicationId: Number(response[0].toString()),
      usernameHash: response[1],
      title: response[2],
      description: response[3],
      allowedUrls: response[4],
      allowedContracts: response[5],
      isActive: response[6],
    }
  }
}
