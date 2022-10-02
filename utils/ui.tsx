import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import React from 'react'

/**
 * Hide keyboard by clicking to screen out of inputs
 */
export const DismissKeyboard = (data: any) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{data.children}</TouchableWithoutFeedback>
)
