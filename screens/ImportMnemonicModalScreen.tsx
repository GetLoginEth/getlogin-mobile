import { StatusBar } from 'expo-status-bar'
import { Platform } from 'react-native'
import { View } from '../components/Themed'
import { Text } from '@ui-kitten/components'
import React from 'react'
import { setAccountMnemonic } from '../services/storage'
import { DismissKeyboard } from '../utils/ui'
import { Button, Input, Layout } from '@ui-kitten/components'
import general from '../styles/general'
import { useInputState } from '../utils/state'
import signup from '../styles/signup'

export const MNEMONIC_WORDS = 12
export function isMnemonicLength(mnemonic: string): boolean {
  return (
    mnemonic
      .split(' ')
      .map(item => item.trim())
      .filter(item => Boolean(item)).length === MNEMONIC_WORDS
  )
}

export default function ImportMnemonicModalScreen() {
  const mnemonic = useInputState()
  // const username = useInputState()

  return (
    <DismissKeyboard>
      <View style={general.container}>
        <Text style={[general.text, signup.wallet, { marginBottom: 15 }]} category="h1">
          Import Mnemonic
        </Text>

        {/*<Layout style={general.rowContainer} level="1">*/}
        {/*  <Input style={general.input} placeholder="Username" autoCapitalize="none" {...username} />*/}
        {/*</Layout>*/}

        <Layout style={[general.rowContainer]} level="1">
          <Input
            style={general.textarea}
            placeholder="Mnemonic phrase"
            autoCapitalize="none"
            multiline={true}
            textStyle={{ minHeight: 64 }}
            {...mnemonic}
          />
        </Layout>

        <Layout style={general.rowContainer} level="1">
          <Button
            style={[general.button, general.greenButton]}
            // disabled={!isMnemonicLength(mnemonic.value) || !username.value}
            disabled={!isMnemonicLength(mnemonic.value)}
            onPress={async () => {
              const value = mnemonic.value

              if (!isMnemonicLength(value)) {
                // todo show alert or display in specific place
                console.error('Incorrect mnemonic length')

                return
              }

              // todo check is address assigned with username
              // todo ask user about username if it is assigned to some username

              await setAccountMnemonic(value)
            }}
          >
            {evaProps => <Text {...evaProps}>Import</Text>}
          </Button>
        </Layout>

        {/* Use a light status bar on iOS to account for the black space above the modal */}
        {/*// todo check if it necessary everywhere*/}
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    </DismissKeyboard>
  )
}
