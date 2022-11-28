import { StatusBar } from 'expo-status-bar'
import { Alert, Platform } from 'react-native'
import { View } from '../components/Themed'
import { Text } from '@ui-kitten/components'
import React, { useState } from 'react'
import { DismissKeyboard, LoaderOutline } from '../utils/ui'
import { Button, Input, Layout } from '@ui-kitten/components'
import general from '../styles/general'
import { useInputState } from '../utils/state'
import signupStyles from '../styles/signup'
import { STEP_CREATE, STEP_DONE, STEP_SIGNUP } from './create-wallet/CreateWalletModalScreen'
import { isAddressUsed, isEnoughBalance, isUsernameRegisteredByAddressUsername } from '../api/GetLoginUtils'
import { isMnemonicLength, setGlobalWallet, USERNAME_MIN_LENGTH } from '../utils/wallet'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function ImportMnemonicModalScreen({ navigation }) {
  const mnemonic = useInputState()
  const username = useInputState()
  const [loading, setLoading] = useState(false)
  const isImportDisabled =
    !isMnemonicLength(mnemonic.value) || username.value.trim().length < USERNAME_MIN_LENGTH || loading

  const mnemonicIsNotAssignedAlert = () =>
    Alert.alert('Information', 'The mnemonic is not assigned to the username. Fix your info and try again.', [
      {
        text: 'OK',
      },
    ])

  return (
    <DismissKeyboard>
      <View style={general.container}>
        <Layout style={[general.rowContainer, signupStyles.createWallet]} level="1">
          <Text style={[general.text, general.greenText]} category="h3">
            Import mnemonic
          </Text>
        </Layout>

        <Layout style={general.rowContainer} level="1">
          <Input style={general.input} autoCapitalize="none" placeholder="Username" {...username} disabled={loading} />
        </Layout>

        <Layout style={[general.rowContainer]} level="1">
          <Input
            style={general.textarea}
            placeholder="Mnemonic phrase"
            disabled={loading}
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
            disabled={isImportDisabled}
            accessoryLeft={<LoaderOutline loading={loading} />}
            onPress={async () => {
              const mnemonicValue = mnemonic.value

              const navigateToStep = (step: string) => {
                navigation.goBack()
                navigation.navigate('CreateWallet', { step, mnemonic: mnemonicValue, username: username.value })
              }

              if (!isMnemonicLength(mnemonicValue)) {
                // todo show alert or display in specific place
                console.error('Incorrect mnemonic length')

                return
              }

              setLoading(true)

              // workaround to prevent freezing from `Wallet.fromMnemonic`
              setTimeout(async () => {
                let finalStep
                try {
                  const wallet = setGlobalWallet(mnemonicValue)

                  if (await isUsernameRegisteredByAddressUsername(wallet.address, username.value)) {
                    // user already registered
                    finalStep = () => navigateToStep(STEP_DONE)
                  } else if (await isAddressUsed(wallet.address)) {
                    mnemonicIsNotAssignedAlert()
                  } else if (await isEnoughBalance(wallet.address)) {
                    // restoring account after app closing by mnemonic + enough balance
                    finalStep = () => navigateToStep(STEP_SIGNUP)
                  } else {
                    // restoring account after app closing by mnemonic and NOT enough balance
                    finalStep = () => navigateToStep(STEP_CREATE)
                  }
                  // eslint-disable-next-line no-empty
                } catch (e) {
                } finally {
                  setLoading(false)

                  if (finalStep) {
                    finalStep()
                  }
                }
              }, 1)
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
