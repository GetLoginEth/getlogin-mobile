import { StatusBar } from 'expo-status-bar'
import { Alert, Platform } from 'react-native'
import { View } from '../components/Themed'
import { Text } from '@ui-kitten/components'
import React from 'react'
import { DismissKeyboard } from '../utils/ui'
import { Button, Input, Layout } from '@ui-kitten/components'
import general from '../styles/general'
import { useInputState } from '../utils/state'
import signupStyles from '../styles/signup'
import { STEP_CREATE, STEP_DONE, STEP_SIGNUP } from './create-wallet/CreateWalletModalScreen'
import { Wallet } from 'ethers'
import { isAddressUsed, isEnoughBalance, isUsernameRegisteredByAddressUsername } from '../api/GetLoginUtils'
import { isMnemonicLength, USERNAME_MIN_LENGTH } from '../utils/user'

export default function ImportMnemonicModalScreen({ navigation }) {
  const mnemonic = useInputState()
  const username = useInputState()

  const createAlert = () =>
    Alert.alert('Information', 'The mnemonic is not assigned to the username. Fix your info and try again.', [
      {
        text: 'OK',
      },
    ])

  return (
    <DismissKeyboard>
      <View style={general.container}>
        <Layout style={{ ...general.rowContainer, ...signupStyles.createWallet }} level="1">
          <Text style={{ ...general.text, ...general.greenText }} category="h3">
            Import mnemonic
          </Text>
        </Layout>

        <Layout style={general.rowContainer} level="1">
          <Input style={general.input} autoCapitalize="none" placeholder="Username" {...username} />
        </Layout>

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
            style={[general.button]}
            status="success"
            disabled={!isMnemonicLength(mnemonic.value) || username.value.trim().length < USERNAME_MIN_LENGTH}
            onPress={async () => {
              const value = mnemonic.value

              const navigateToStep = (step: string) => {
                navigation.goBack()
                navigation.navigate('Create Wallet', { step, mnemonic: value, username: username.value })
              }

              if (!isMnemonicLength(value)) {
                // todo show alert or display in specific place
                console.error('Incorrect mnemonic length')

                return
              }

              // todo open spinner while getting balance and username availability
              const wallet = Wallet.fromMnemonic(value)

              if (await isUsernameRegisteredByAddressUsername(wallet.address, username.value)) {
                console.log('step 1')
                navigateToStep(STEP_DONE)
              } else if (await isAddressUsed(wallet.address)) {
                console.log('step 11')
                createAlert()
              } else if (await isEnoughBalance(wallet.address)) {
                console.log('step 2')

                navigateToStep(STEP_SIGNUP)
              } else {
                console.log('step 3')

                navigateToStep(STEP_CREATE)
              }
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
