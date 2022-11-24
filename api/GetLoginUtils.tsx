import { Instances } from '../Instances'
import { BigNumber, Contract, ContractReceipt, ContractTransaction, utils, Wallet } from 'ethers'
import { JsonRpcProvider, TransactionResponse } from '@ethersproject/providers'
import { MIN_BALANCE } from '../utils/wallet'
import { Provider } from '@ethersproject/abstract-provider'
import { ApplicationInformation, AppSession } from './GetLogin'
import {
  addApplicationSession,
  ApplicationSessionWallet,
  getApplicationSession as getApplicationSessionStorage,
} from '../services/storage'

export enum CryptoType {
  DAI,
  BZZ,
}

export function validateCurrentWallet(): void {
  if (!Instances.currentWallet) {
    throw new Error('GL Utils: empty current wallet')
  }
}

/**
 * Checks is enough balance by UI value of balance
 */
export function isUIBalanceEnough(balance: string): boolean {
  const bnBalance = utils.parseUnits(balance, 'ether')
  const value = utils.parseUnits(MIN_BALANCE, 'ether')

  return bnBalance.gte(value)
}

/**
 * Checks is enough balance on address
 *
 * @param address address to check
 * @param ethAmount amount in ETH
 */
export async function isEnoughBalance(address: string, ethAmount: string = MIN_BALANCE): Promise<boolean> {
  const balance = await Instances.getGetLogin.dataContract.provider.getBalance(address)
  const value = utils.parseUnits(ethAmount, 'ether')

  return balance.gte(value)
}

/**
 * Signup new user with username and funded mnemonic
 *
 * @param username username to register
 * @param mnemonic wallet with balance
 */
export async function signup(username: string, mnemonic: string): Promise<ContractReceipt> {
  const rpcUrl = Instances.data?.jsonRpcProvider

  if (!rpcUrl) {
    throw new Error('Incorrect rpc url')
  }

  const wallet = Wallet.fromMnemonic(mnemonic).connect(new JsonRpcProvider(rpcUrl))

  if (await Instances.getGetLogin.isAddressAssigned(wallet.address)) {
    throw new Error('Wallet address already assigned to some username')
  }

  if (!(await isEnoughBalance(wallet.address))) {
    throw new Error(`Is not enough balance on the address: ${wallet.address}`)
  }

  return (await Instances.getGetLogin.createUser(username, wallet)).wait()
}

/**
 * Checks if address from mnemonic assigned to some username
 */
export async function isUsernameRegisteredByAddressUsername(address: string, username: string): Promise<boolean> {
  return Instances.getGetLogin.isAddressAssignedToUsername(address, username)
}

/**
 * Checks if address already used
 */
export async function isAddressUsed(address: string): Promise<boolean> {
  return Instances.getGetLogin.isAddressAssigned(address)
}

/**
 * Checks if username registered
 */
export async function isUsernameRegistered(username: string): Promise<boolean> {
  return Instances.getGetLogin.isUsernameRegistered(username)
}

/**
 * Asserts that username registered
 */
export async function assertUsernameAvailable(username: string): Promise<void> {
  if (await isUsernameRegistered(username)) {
    throw new Error('Username already registered')
  }
}

export async function getAddressByUsername(username: string): Promise<string> {
  return Instances.getGetLogin.getAddressByUsername(username)
}

export function isEthereumAddress(address: string): boolean {
  return address.length === 42 && address.startsWith('0x')
}

/**
 * Get ERC-20 contract instance based on address and provider
 *
 * @param address address of the contract
 * @param provider provider for interacting with the contract
 */
export function getErc20Contract(address: string, provider: Provider): Contract {
  const abi = [
    // Read-Only Functions
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    // Authenticated Functions
    'function transfer(address to, uint amount) returns (bool)',
    // Events
    'event Transfer(address indexed from, address indexed to, uint amount)',
  ]

  return new Contract(address, abi, provider)
}

/**
 * Gets balance of token on user address
 *
 * @param tokenAddress address of token smart contract
 * @param userAddress user address who hold the tokens
 */
export async function getTokenBalance(tokenAddress: string, userAddress: string): Promise<BigNumber> {
  validateCurrentWallet()
  const erc20 = getErc20Contract(tokenAddress, Instances.currentWallet!.provider)

  return erc20.balanceOf(userAddress)
}

/**
 * Sends ERC-20 tokens to address
 *
 * @param address address of the receiver
 * @param tokenAddress address of the token smart contract
 * @param amount amount tokens to transfer
 */
export async function sendToken(address: string, tokenAddress: string, amount: string): Promise<TransactionResponse> {
  validateCurrentWallet()
  const erc20 = getErc20Contract(address, Instances.currentWallet!.provider)

  return erc20.transfer(address, utils.parseUnits(amount))
}

/**
 * Sends crypto to defined address or username
 */
export async function sendCrypto(
  addressOrUsername: string,
  amount: string,
  cryptoType: CryptoType,
): Promise<TransactionResponse> {
  validateCurrentWallet()

  if (!Instances.data || !Instances.data.bzz.address) {
    throw new Error('Send crypto: Bzz address is not defined')
  }

  let address = ''

  if (isEthereumAddress(addressOrUsername)) {
    address = addressOrUsername
  } else {
    address = await getAddressByUsername(addressOrUsername)
  }

  const txDai = {
    to: address,
    value: utils.parseEther(amount),
  }

  if (cryptoType === CryptoType.DAI) {
    return Instances.currentWallet!.sendTransaction(txDai)
  } else if (cryptoType === CryptoType.BZZ) {
    return sendToken(address, Instances.data.bzz.address, amount)
  } else {
    throw new Error('Incorrect crypto type')
  }
}

/**
 * Gets application information
 */
export async function getApplication(applicationId: number): Promise<ApplicationInformation> {
  validateCurrentWallet()

  return Instances.getGetLogin.getApplication(applicationId, Instances.currentWallet!)
}

/**
 * Gets information about active sessions
 */
export async function getActiveAppSessions(username: string): Promise<AppSession[]> {
  validateCurrentWallet()

  return Instances.getGetLogin.getActiveAppSessions(username, Instances.currentWallet!)
}

/**
 * Closes application session for current user
 */
export async function closeAppSession(applicationId: number): Promise<ContractTransaction> {
  validateCurrentWallet()

  return Instances.getGetLogin.closeAppSession(applicationId, Instances.currentWallet!)
}

/**
 * Gets session for specific application from local storage with blockchain validation
 */
export async function getApplicationSession(
  username: string,
  applicationId: number,
): Promise<ApplicationSessionWallet> {
  validateCurrentWallet()
  const blockchainSession = await Instances.getGetLogin.getAppSession(applicationId, username, Instances.currentWallet!)
  const localSession = await getApplicationSessionStorage(applicationId)

  if (blockchainSession.address !== localSession.address) {
    throw new Error(
      `Session addresses in the blockchain and in local storage do not match. Blockchain: ${blockchainSession.address}, local: ${localSession.address}`,
    )
  }

  return localSession
}

/**
 * Creates encrypted application session, register it in blockchain and store it locally
 *
 * @param applicationId application for which we want to give an access
 * @param amountEth amount ETH to send to created session address
 */
export async function createAppSessionAndStore(applicationId: number, amountEth: string): Promise<Wallet> {
  validateCurrentWallet()
  const currentWallet = Instances.currentWallet!

  if (!(await isEnoughBalance(currentWallet.address, amountEth))) {
    throw new Error('Session creation: not enough funds in the wallet')
  }

  const wallet = Wallet.createRandom()
  await (
    await Instances.getGetLogin.createAppSession(applicationId, wallet.address, currentWallet, {
      isStoreApplicationSession: false,
      applicationSessionPayment: {
        amountEth,
      },
    })
  ).wait(1)
  await addApplicationSession({
    applicationId,
    address: wallet.address,
    privateKey: wallet.privateKey,
  })

  return wallet
}
