import AsyncStorage from '@react-native-async-storage/async-storage'

export const ACCOUNT_MNEMONIC_KEY = 'account_mnemonic'
export const ACCOUNT_USERNAME_KEY = 'account_username'
export const ACCOUNT_IS_LOGGED_KEY = 'account_is_logged'

export async function setAccountMnemonic(mnemonic: string): Promise<void> {
  // todo save to encrypted storage
  await AsyncStorage.setItem(ACCOUNT_MNEMONIC_KEY, mnemonic)
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
