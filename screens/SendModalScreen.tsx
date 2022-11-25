import { StatusBar } from 'expo-status-bar'
import { Alert, Platform } from 'react-native'
import { View } from '../components/Themed'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import general from '../styles/general'
import { Button, Input, Layout, Text } from '@ui-kitten/components'
import React, { useEffect, useState } from 'react'
import { selectBalance, updateBalance } from '../redux/app/appSlice'
import { ErrorText, LoaderOutline, parseBNStringOrZero, prepareBalance, StatusText } from '../utils/ui'
import { useInputState } from '../utils/state'
import { USERNAME_MIN_LENGTH } from '../utils/wallet'
import { CryptoType, getCurrencyName, getTokenName, isUIBalanceEnough, sendCrypto } from '../api/GetLoginUtils'
import { selectInitInfo } from '../redux/init/initSlice'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function SendModalScreen({ route }) {
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [currentCurrency, setCurrentCurrency] = useState(CryptoType.DAI)
  const balance = useAppSelector(selectBalance)
  const usernameOrAddress = useInputState()
  const amount = useInputState()
  const dispatch = useAppDispatch()
  const initInfo = useAppSelector(selectInitInfo)

  const amountPrepared = parseBNStringOrZero(amount.value)
  const isEnoughBalance =
    currentCurrency === CryptoType.DAI
      ? isUIBalanceEnough(balance.xdai, amountPrepared)
      : isUIBalanceEnough(balance.xbzz, amountPrepared)
  const isSendDisabled = isSending || usernameOrAddress.value.trim().length < USERNAME_MIN_LENGTH || !isEnoughBalance

  useEffect(() => {
    const { address } = route.params || {}

    if (address) {
      usernameOrAddress.onChangeText(address)
    }
  }, [])

  const sendTransaction = async () => {
    setIsSending(true)
    try {
      setStatus('Sending transaction...')
      const tx = await sendCrypto(usernameOrAddress.value.trim(), amountPrepared, currentCurrency)
      setStatus('Waiting for 1 confirmation...')
      await tx.wait(1)
      usernameOrAddress.onChangeText('')
      amount.onChangeText('')
      setStatus('Sent!')
    } catch (e) {
      const error = e as Error
      setError(error.message)
    } finally {
      dispatch(updateBalance(initInfo.address!))
      setIsSending(false)
    }
  }

  const createAlert = () =>
    Alert.alert('Confirmation', 'Really send? A paid transaction will be made in the blockchain', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => sendTransaction(),
      },
    ])

  return (
    <View style={[general.container, { alignItems: 'center' }]}>
      <Layout style={{ ...general.rowContainer }} level="1">
        <Text style={[general.text, general.greenText, { marginBottom: 20 }]} category="h3">
          Send
        </Text>
      </Layout>

      {error && <ErrorText text={error} />}

      <Layout style={[general.rowContainer, { marginBottom: 20 }]} level="1">
        <Text
          onPress={() => setCurrentCurrency(CryptoType.DAI)}
          style={[general.text, { fontWeight: currentCurrency === CryptoType.DAI ? 'bold' : 'normal' }]}
          category="h5"
        >
          {prepareBalance(balance.xdai)} {getCurrencyName()}
        </Text>
      </Layout>

      <Layout style={[general.rowContainer, { marginBottom: 30 }]} level="1">
        <Text
          onPress={() => setCurrentCurrency(CryptoType.BZZ)}
          style={[general.text, { fontWeight: currentCurrency === CryptoType.BZZ ? 'bold' : 'normal' }]}
          category="h5"
        >
          {prepareBalance(balance.xbzz)} {getTokenName()}
        </Text>
      </Layout>

      <Layout style={general.rowContainer} level="1">
        <Input style={general.input} placeholder="Username or address" autoCapitalize="none" {...usernameOrAddress} />
      </Layout>

      <Layout style={general.rowContainer} level="1">
        <Input style={general.input} placeholder="Amount" autoCapitalize="none" {...amount} disabled={isSending} />
      </Layout>

      {status && <StatusText text={status} />}

      <Layout style={general.rowContainer} level="1">
        <Button
          style={[general.button]}
          status="success"
          disabled={isSendDisabled}
          accessoryLeft={<LoaderOutline loading={isSending} />}
          onPress={() => createAlert()}
        >
          {evaProps => (
            <Text {...evaProps}>Send {currentCurrency === CryptoType.DAI ? getCurrencyName() : getTokenName()}</Text>
          )}
        </Button>
      </Layout>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}
