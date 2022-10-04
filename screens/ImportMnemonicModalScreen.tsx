import { StatusBar } from 'expo-status-bar'
import { Platform, TouchableOpacity } from 'react-native'
import { Text, View } from '../components/Themed'
import React, { useState } from 'react'
import { setAccountMnemonic } from '../services/Storage'
import { DismissKeyboard } from '../utils/ui'
import { Input, Layout } from '@ui-kitten/components'
import general from '../styles/general'

export default function ImportMnemonicModalScreen() {
  const [mnemonic, setMnemonic] = useState('')

  return (
    <DismissKeyboard>
      <View style={general.container}>
        <Layout style={general.rowContainer} level="1">
          <Input multiline={true} textStyle={{ minHeight: 64 }} value={mnemonic} onChangeText={setMnemonic} />
        </Layout>

        <TouchableOpacity
          onPress={async () => {
            if (!mnemonic) {
              console.log('mnemonic is empty')

              return
            }

            const split = mnemonic.split(' ')

            if (split.length !== 12) {
              console.log('Incorrect words length')

              return
            }

            await setAccountMnemonic(mnemonic)
          }}
        >
          <Text>Save mnemonic</Text>
        </TouchableOpacity>

        {/* Use a light status bar on iOS to account for the black space above the modal */}
        {/*// todo check if it necessary everywhere*/}
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    </DismissKeyboard>
  )
}
