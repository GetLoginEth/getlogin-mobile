import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { Icon } from '@ui-kitten/components'
import { utils } from 'ethers'
import { Instances } from '../Instances'

/**
 * Hide keyboard by clicking to screen out of inputs
 */
export const DismissKeyboard = (data: any) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{data.children}</TouchableWithoutFeedback>
)

/**
 * Displaying loader without animation inside elements
 */
export const LoaderOutline = (props: any) => {
  return (props.loading && <Icon {...props} name="loader-outline" />) || <></>
}

/**
 * Gets balance suitable for displaying on UI
 */
export async function getUIBalance(address: string): Promise<string> {
  return utils.formatEther(await Instances.getGetLogin.dataContract.provider.getBalance(address))
}

/**
 * Prepare balance by cutting zeros after dot
 */
export function prepareBalance(balance: string) {
  const maxLengthAfterZero = 4
  const split = balance.split('.')

  if (split.length === 2 && split[1].length > 2) {
    return `${split[0]}.${split[1].substr(0, maxLengthAfterZero)}`
  } else {
    return balance
  }
}
