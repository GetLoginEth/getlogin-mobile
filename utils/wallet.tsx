export const MNEMONIC_WORDS = 12
export const USERNAME_MIN_LENGTH = 3
export const PASSWORD_MIN_LENGTH = 8
// minimum balance for registration
export const MIN_BALANCE = '0.1'
// default value for application session top up
export const APPLICATION_SESSION_AMOUNT = '0.02'

export function isMnemonicLength(mnemonic: string): boolean {
  return (
    mnemonic
      .split(' ')
      .map(item => item.trim())
      .filter(item => Boolean(item)).length === MNEMONIC_WORDS
  )
}
