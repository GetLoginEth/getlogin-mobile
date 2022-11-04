import { Instances } from '../Instances'
import { BigNumber, Contract, ContractReceipt, utils, Wallet } from 'ethers'
import { JsonRpcProvider, TransactionResponse } from '@ethersproject/providers'
import { MIN_BALANCE } from '../utils/wallet'
import { Provider } from '@ethersproject/abstract-provider'
import { ApplicationInformation, AppSession } from './GetLogin'

export enum CryptoType {
  DAI,
  BZZ,
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
 */
export async function isEnoughBalance(address: string): Promise<boolean> {
  const balance = await Instances.getGetLogin.dataContract.provider.getBalance(address)
  const value = utils.parseUnits(MIN_BALANCE, 'ether')

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
  if (!Instances.currentWallet) {
    throw new Error('ERC20: Empty current wallet')
  }

  const erc20 = getErc20Contract(tokenAddress, Instances.currentWallet.provider)

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
  if (!Instances.currentWallet) {
    throw new Error('ERC20: Empty current wallet')
  }

  const erc20 = getErc20Contract(address, Instances.currentWallet.provider)

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
  if (!Instances.currentWallet) {
    throw new Error('Send crypto: Empty current wallet')
  }

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
    return Instances.currentWallet.sendTransaction(txDai)
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
  // todo optimize this validation for every call. move somewhere or reorganize the code
  if (!Instances.currentWallet) {
    throw new Error('getApplication: empty web provider')
  }

  return Instances.getGetLogin.getApplication(applicationId, Instances.currentWallet!)
}

/**
 * Gets information about active sessions
 */
export async function getActiveAppSessions(username: string): Promise<AppSession[]> {
  if (!Instances.currentWallet) {
    throw new Error('getActiveAppSessions: empty web provider')
  }

  return Instances.getGetLogin.getActiveAppSessions(username, Instances.currentWallet!)
}

/**
 * Closes application session for current user
 */
export async function closeAppSession(applicationId: number): Promise<void> {
  if (!Instances.currentWallet) {
    throw new Error('closeAppSession: empty signer')
  }

  await Instances.getGetLogin.closeAppSession(applicationId, Instances.currentWallet)
}
