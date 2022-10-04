import { StatusBar } from 'expo-status-bar'
import { Platform, StyleSheet } from 'react-native'
import { Text, View } from '../components/Themed'
import React, { useEffect, useState } from 'react'
import { setAccountMnemonic } from '../services/Storage'
import { Instances } from '../Instances'
import { Button, Input, Layout, Spinner } from '@ui-kitten/components'
import { DismissKeyboard } from '../utils/ui'

export default function CreateWalletModalScreen() {
  const [mnemonic, setMnemonic] = useState('')
  const [address, setAddress] = useState('')
  const [isGenerating, setIsGenerating] = useState(true)

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
      <View style={styles.container}>
        {isGenerating && <Spinner size="giant" />}

        {!isGenerating && (
          <>
            <Text lightColor="rgba(0,0,0,0.8)" darkColor="rgba(255,255,255,0.8)">
              Address: {address}
            </Text>

            <Layout style={styles.rowContainer} level="1">
              <Input multiline={true} textStyle={{ minHeight: 64 }} value={mnemonic} editable={false} />
            </Layout>

            <Layout style={styles.rowContainer} level="1">
              <Button
                onPress={async () => {
                  console.log('click')
                }}
              >
                {evaProps => <Text {...evaProps}>Next</Text>}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  // todo merge with signin styles and move to separated file
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlContainer: {
    borderRadius: 4,
    margin: 2,
    padding: 6,
    backgroundColor: '#3366FF',
  },
})
