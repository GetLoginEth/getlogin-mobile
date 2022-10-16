import { StatusBar } from 'expo-status-bar'
import { Platform } from 'react-native'
import { View } from '../../components/Themed'
import React, { useEffect, useState } from 'react'
import { setAccountMnemonic, setLogged } from '../../services/storage'
import { Instances } from '../../Instances'
import { Layout, Spinner } from '@ui-kitten/components'
import { DismissKeyboard } from '../../utils/ui'
import general from '../../styles/general'
import StepCreate from './StepCreate'
import StepSignup from './StepSignup'
import StepDone from './StepDone'
import { Wallet } from 'ethers'
import { setIsLogged } from '../../redux/app/appSlice'
import { useAppDispatch } from '../../redux/hooks'

export const STEP_CREATE = 'step_create'
export const STEP_SIGNUP = 'step_signup'
export const STEP_DONE = 'step_done'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function CreateWalletModalScreen({ route, navigation }) {
  const dispatch = useAppDispatch()
  const [step, setStep] = useState(STEP_CREATE)
  const [mnemonic, setMnemonic] = useState('')
  const [address, setAddress] = useState('')
  const [username, setUsername] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    async function start() {
      const wallet = Instances.getGetLogin.createWallet()
      setAddress(wallet.address)
      setMnemonic(wallet.mnemonic.phrase)
      await setAccountMnemonic(wallet.mnemonic.phrase)
      setIsGenerating(false)
    }

    const { mnemonic, step, username } = route.params || {}

    setIsGenerating(true)
    // workaround for Wallet method that freezes screen
    setTimeout(() => {
      if (step && mnemonic) {
        setIsGenerating(false)
        setStep(step)
        setMnemonic(mnemonic)
        setAddress(Wallet.fromMnemonic(mnemonic).address)

        if (username) {
          setUsername(username)
        }
      } else {
        start().then()
      }
    }, 1)
  }, [])

  useEffect(() => {
    if (username && mnemonic && step === STEP_DONE) {
      setLogged(username, mnemonic).then()
      dispatch(setIsLogged(true))
      navigation.navigate('TabOne')
    }
  }, [username, mnemonic, step])

  // todo show info about network and cost of account creation

  return (
    <DismissKeyboard>
      <View style={general.container}>
        {isGenerating && (
          <Layout style={[general.rowContainer, { justifyContent: 'center' }]} level="1">
            <Spinner size="giant" />
          </Layout>
        )}

        {!isGenerating && step === STEP_CREATE && (
          <StepCreate
            mnemonic={mnemonic}
            address={address}
            onNextStep={() => {
              setStep(STEP_SIGNUP)
            }}
          />
        )}

        {!isGenerating && step === STEP_SIGNUP && (
          <StepSignup
            mnemonic={mnemonic}
            onNextStep={(username: string) => {
              setUsername(username)
              setStep(STEP_DONE)
            }}
          />
        )}

        {!isGenerating && step === STEP_DONE && <StepDone navigation={navigation} />}

        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    </DismissKeyboard>
  )
}
