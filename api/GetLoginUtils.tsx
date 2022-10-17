import { Instances } from '../Instances'
import { Contract, ContractReceipt, utils, Wallet } from 'ethers'
import { JsonRpcProvider, TransactionResponse } from '@ethersproject/providers'
import { MIN_BALANCE } from '../utils/wallet'

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

export async function sendToken(address: string, tokenAddress: string, amount: string): Promise<TransactionResponse> {
  if (!Instances.currentWallet) {
    throw new Error('ERC20: Empty current wallet')
  }
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

  const erc20 = new Contract(address, abi, Instances.currentWallet.provider)

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
