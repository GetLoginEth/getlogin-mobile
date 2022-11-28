import { StatusBar } from 'expo-status-bar'
import { Platform } from 'react-native'
import { View } from '../../components/Themed'
import React, { useEffect, useState } from 'react'
import { saveAccountMnemonic, saveLogged } from '../../services/storage'
import { Instances } from '../../Instances'
import { Layout, Spinner } from '@ui-kitten/components'
import { DismissKeyboard } from '../../utils/ui'
import general from '../../styles/general'
import StepCreate from './StepCreate'
import StepSignup from './StepSignup'
import StepDone from './StepDone'
import { useAppDispatch } from '../../redux/hooks'
import { setInitInfo, setIsLogged } from '../../redux/init/initSlice'
import { setGlobalWallet } from '../../utils/wallet'

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

  /**
   * Creates mnemonic from scratch
   */
  const createMnemonic = async () => {
    const wallet = setGlobalWallet(Instances.getGetLogin.createWallet())
    setAddress(wallet.address)
    setMnemonic(wallet.mnemonic.phrase)
    await saveAccountMnemonic(wallet.mnemonic.phrase)
    setIsGenerating(false)
  }

  /**
   * Import from mnemonic modal
   */
  const handleImport = (step: string, mnemonic: string, username: string) => {
    setIsGenerating(false)
    setStep(step)
    setMnemonic(mnemonic)
    setAddress(Instances.currentWallet!.address)
    setUsername(username)
  }

  useEffect(() => {
    const { step, mnemonic, username } = route.params || {}
    const isImport = step && mnemonic && username

    setIsGenerating(true)
    // workaround for Wallet method that freezes screen
    setTimeout(() => {
      if (isImport) {
        handleImport(step, mnemonic, username)
      } else {
        createMnemonic().then()
      }
    }, 1)
  }, [])

  useEffect(() => {
    // save information about created wallet and navigate to the main window after all steps are done (from scratch or from import)
    if (username && mnemonic && step === STEP_DONE) {
      saveLogged(username, mnemonic).then()
      dispatch(setIsLogged(true))
      dispatch(setInitInfo({ isLogged: true, username, mnemonic, address }))
      navigation.navigate('TabOne')
    }
  }, [username, mnemonic, step])

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
