import React from 'react'

export const useInputState = (initialValue = '') => {
  const [value, setValue] = React.useState(initialValue)

  return { value, onChangeText: setValue }
}
