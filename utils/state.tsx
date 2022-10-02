import React from 'react'

const useInputState = (initialValue = '') => {
  const [value, setValue] = React.useState(initialValue)

  return { value, onChangeText: setValue }
}
