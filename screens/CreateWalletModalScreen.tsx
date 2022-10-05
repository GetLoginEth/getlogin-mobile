import { StatusBar } from 'expo-status-bar'
import { Platform } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import { Text, View } from '../components/Themed'
import React, { useEffect, useState } from 'react'
import { setAccountMnemonic } from '../services/storage'
import { Instances } from '../Instances'
import { Button, Icon, Input, Layout, Spinner } from '@ui-kitten/components'
import { DismissKeyboard } from '../utils/ui'
import general from '../styles/general'
import { utils } from 'ethers'

export const MIN_BALANCE = '0.01'

export default function CreateWalletModalScreen() {
  // const mnemonic = useInputState()
  const [mnemonic, setMnemonic] = useState('')
  const [address, setAddress] = useState('')
  const [isGenerating, setIsGenerating] = useState(true)
  const CopyOutline = (props: any) => <Icon {...props} name="copy-outline" />

  useEffect(() => {
    async function start() {
      // todo show spinner
      const wallet = Instances.getGetLogin.createWallet()
      console.log(wallet.address)
      console.log(wallet.mnemonic.phrase)
      setAddress(wallet.address)
      setMnemonic(wallet.mnemonic.phrase)
      await setAccountMnemonic(wallet.mnemonic.phrase)
      // todo hide spinner
      setIsGenerating(false)
    }

    setTimeout(() => {
      start().then()
    }, 1)
  }, [])

  // todo show info about network and cost of account creation

  return (
    <DismissKeyboard>
      <View style={general.container}>
        {isGenerating && (
          <Layout style={[general.rowContainer, { justifyContent: 'center' }]} level="1">
            <Spinner size="giant" />
          </Layout>
        )}

        {!isGenerating && (
          <>
            <Layout style={general.rowContainer} level="1">
              <Input
                style={general.input}
                label="Address"
                autoCapitalize="none"
                value={address}
                editable={false}
                accessoryRight={
                  <Button
                    appearance="ghost"
                    accessoryLeft={CopyOutline}
                    onPress={() => {
                      Clipboard.setString(address)
                    }}
                  />
                }
              />
            </Layout>

            <Layout style={[general.rowContainer]} level="1">
              <Input
                style={general.textarea}
                editable={false}
                label="Mnemonic phrase"
                autoCapitalize="none"
                multiline={true}
                textStyle={{ minHeight: 64 }}
                value={mnemonic}
                accessoryRight={
                  <Button
                    appearance="ghost"
                    accessoryLeft={CopyOutline}
                    onPress={() => {
                      Clipboard.setString(mnemonic)
                    }}
                  />
                }
              />
            </Layout>

            <Layout style={general.rowContainer} level="1">
              <Button
                style={[general.button, general.greenButton]}
                onPress={async () => {
                  console.log('getting balance...')
                  const balance = await Instances.getGetLogin.dataContract.provider.getBalance(address)
                  console.log('balance', balance)
                  const val = utils.parseUnits(MIN_BALANCE, 'ether')
                  console.log('val', val)
                  console.log('is >= 0.01', balance.gte(val))

                  if (balance.gte(val)) {
                    // todo show next step with username registration
                  }
                }}
              >
                {evaProps => <Text {...evaProps}>Check balance</Text>}
              </Button>
            </Layout>
          </>
        )}
        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    </DismissKeyboard>
  )
}
