import { Instances } from '../Instances'
import { ContractReceipt, utils, Wallet } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
import { MIN_BALANCE } from '../utils/user'

/**
 * Checks is enough balance on address
 *
 * @param address address to check
 */
export async function isEnoughBalance(address: string): Promise<boolean> {
  const balance = await Instances.getGetLogin.dataContract.provider.getBalance(address)
  const val = utils.parseUnits(MIN_BALANCE, 'ether')

  return balance.gte(val)
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
