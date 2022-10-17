import { StatusBar } from 'expo-status-bar'
import { Platform } from 'react-native'
import { View } from '../components/Themed'
import { useAppSelector } from '../redux/hooks'
import general from '../styles/general'
import { Button, Input, Layout, Text } from '@ui-kitten/components'
import React, { useEffect, useState } from 'react'
import { selectBalance } from '../redux/app/appSlice'
import { LoaderOutline, prepareBalance } from '../utils/ui'
import { useInputState } from '../utils/state'
import { USERNAME_MIN_LENGTH } from '../utils/wallet'
import { CryptoType, sendCrypto } from '../api/GetLoginUtils'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function SendModalScreen({ route }) {
  const [isSending, setIsSending] = useState(false)
  const balance = useAppSelector(selectBalance)
  const usernameOrAddress = useInputState()
  const amount = useInputState()

  useEffect(() => {
    const { address } = route.params || {}

    if (address) {
      usernameOrAddress.onChangeText(address)
    }
  }, [])

  return (
    <View style={[general.container, { alignItems: 'center' }]}>
      <Layout style={{ ...general.rowContainer }} level="1">
        <Text style={[general.text, general.greenText, { marginBottom: 20 }]} category="h3">
          Send crypto
        </Text>
      </Layout>

      <Layout style={{ ...general.rowContainer }} level="1">
        <Text style={[general.text, general.greenText]} category="h4">
          {prepareBalance(balance.xdai)} xDai
        </Text>
      </Layout>

      <Layout style={{ ...general.rowContainer }} level="1">
        <Text style={[general.text, general.greenText, { marginBottom: 20 }]} category="h4">
          {prepareBalance(balance.xbzz)} xBzz
        </Text>
      </Layout>

      <Layout style={general.rowContainer} level="1">
        <Input style={general.input} placeholder="Username or address" autoCapitalize="none" {...usernameOrAddress} />
      </Layout>

      <Layout style={general.rowContainer} level="1">
        <Input style={general.input} placeholder="Amount" autoCapitalize="none" {...amount} />
      </Layout>

      <Layout style={general.rowContainer} level="1">
        <Button
          style={[general.button]}
          status="success"
          // todo is send amount less than current balance
          disabled={isSending || usernameOrAddress.value.trim().length < USERNAME_MIN_LENGTH || !amount.value.trim()}
          accessoryLeft={<LoaderOutline loading={isSending} />}
          onPress={async () => {
            setIsSending(true)
            // todo add crypto type switcher to ui
            await (await sendCrypto(usernameOrAddress.value.trim(), amount.value.trim(), CryptoType.DAI)).wait()
            // todo update balance on ui
            setIsSending(false)
          }}
        >
          {evaProps => <Text {...evaProps}>Send</Text>}
        </Button>
      </Layout>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}
