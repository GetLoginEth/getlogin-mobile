import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppSession } from '../api/GetLogin'

export interface LoggedUser {
  username: string | null
  mnemonic: string | null
  isLogged: boolean
}

export const ACCOUNT_MNEMONIC_KEY = 'account_mnemonic'
export const ACCOUNT_USERNAME_KEY = 'account_username'
export const ACCOUNT_IS_LOGGED_KEY = 'account_is_logged'
export const APP_SESSIONS_LIST = 'app_sessions_list'

/**
 *
 * @param session
 */
export async function addAppSession(session: AppSession): Promise<void> {
  const listString = await AsyncStorage.getItem(APP_SESSIONS_LIST)
  let items = []

  if (listString) {
    items = JSON.parse(listString)
  }

  items.push(session)

  return AsyncStorage.setItem(APP_SESSIONS_LIST, JSON.stringify(items))
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
