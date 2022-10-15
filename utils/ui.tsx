import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { Icon } from '@ui-kitten/components'

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
