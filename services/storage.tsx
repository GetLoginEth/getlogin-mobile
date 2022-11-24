import AsyncStorage from '@react-native-async-storage/async-storage'
import { isObject, isString } from '../utils/type'

export interface LoggedUser {
  username: string | null
  mnemonic: string | null
  isLogged: boolean
}

export interface ApplicationSessionWallet {
  applicationId: number
  address: string
  privateKey: string
}

export const ACCOUNT_MNEMONIC_KEY = 'account_mnemonic'
export const ACCOUNT_USERNAME_KEY = 'account_username'
export const ACCOUNT_IS_LOGGED_KEY = 'account_is_logged'
export const APP_SESSIONS_LIST = 'app_sessions_list'

export function assertApplicationSessionWallet(value: unknown): asserts value is ApplicationSessionWallet {
  const data = value as ApplicationSessionWallet

  if (
    !(isObject(data) && Number.isInteger(data.applicationId) && isString(data.privateKey) && isString(data.address))
  ) {
    throw new Error('Local storage: incorrect session wallet')
  }
}

/**
 * Adds new application session wallet or replace for specified application id
 */
export async function addApplicationSession(sessionWallet: ApplicationSessionWallet): Promise<void> {
  assertApplicationSessionWallet(sessionWallet)
  const items = (await getApplicationSessions()).filter(item => item.applicationId !== sessionWallet.applicationId)
  items.push(sessionWallet)

  return AsyncStorage.setItem(APP_SESSIONS_LIST, JSON.stringify(items))
}

/**
 * Gets application session wallets list from local storage
 */
export async function getApplicationSessions(): Promise<ApplicationSessionWallet[]> {
  const listString = await AsyncStorage.getItem(APP_SESSIONS_LIST)
  let items = []

  if (listString) {
    items = JSON.parse(listString)
  }

  items.forEach(assertApplicationSessionWallet)

  return items
}

/**
 * Gets application session for specific app
 */
export async function getApplicationSession(applicationId: number): Promise<ApplicationSessionWallet> {
  const result = (await getApplicationSessions()).find(item => item.applicationId === applicationId)

  if (!result) {
    throw new Error(`Local storage: session for "${applicationId}" not found`)
  }

  return result
}

export async function setLogged(username: string, mnemonic: string): Promise<void> {
  return AsyncStorage.multiSet([
    [ACCOUNT_USERNAME_KEY, username],
    [ACCOUNT_MNEMONIC_KEY, mnemonic],
    [ACCOUNT_IS_LOGGED_KEY, 'true'],
  ])
}

export async function resetLogged(): Promise<void> {
  return AsyncStorage.multiSet([
    [ACCOUNT_USERNAME_KEY, ''],
    [ACCOUNT_MNEMONIC_KEY, ''],
    [ACCOUNT_IS_LOGGED_KEY, ''],
  ])
}

export async function getLogged(): Promise<LoggedUser> {
  const data = await AsyncStorage.multiGet([ACCOUNT_USERNAME_KEY, ACCOUNT_MNEMONIC_KEY, ACCOUNT_IS_LOGGED_KEY])

  return {
    username: data[0][1],
    mnemonic: data[1][1],
    isLogged: Boolean(data[2][1]),
  }
}

export async function setAccountMnemonic(mnemonic: string): Promise<void> {
  // todo save to encrypted storage
  return AsyncStorage.setItem(ACCOUNT_MNEMONIC_KEY, mnemonic)
}

export async function getAccountMnemonic(): Promise<string | null> {
  return AsyncStorage.getItem(ACCOUNT_MNEMONIC_KEY)
}

export async function getAccountUsername(): Promise<string | null> {
  return AsyncStorage.getItem(ACCOUNT_USERNAME_KEY)
}

export async function getAccountIsLogged(): Promise<boolean> {
  return Boolean(AsyncStorage.getItem(ACCOUNT_IS_LOGGED_KEY))
}
