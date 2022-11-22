import { View } from '../components/Themed'
import { RootTabScreenProps } from '../types'
import { Button, Layout, Text } from '@ui-kitten/components'
import general from '../styles/general'
import signup from '../styles/signup'
import React from 'react'
import { CreditCardOutline, EditOutline } from '../utils/ui'

export default function SignupScreen({ navigation }: RootTabScreenProps<'TabTwo'>) {
  return (
    <View style={general.container}>
      <Text style={[general.text, signup.wallet, { marginBottom: 15 }]} category="h1">
        Sign up
      </Text>

      <View style={general.viewCorner}>
        <Layout style={{ ...general.rowContainer, ...signup.createWallet }} level="1">
          <Text style={{ ...general.text, ...general.greenText }} category="h3">
            Create a wallet
          </Text>
        </Layout>

        <Layout style={general.rowContainer} level="1">
          <Button
            style={[general.button]}
            status="success"
            accessoryLeft={EditOutline}
            onPress={() => navigation.navigate('CreateWallet')}
          >
            {evaProps => <Text {...evaProps}>Create a wallet</Text>}
          </Button>
        </Layout>

        <Layout style={general.rowContainer} level="1">
          <Button
            accessoryLeft={CreditCardOutline}
            appearance="ghost"
            status={'basic'}
            style={general.button}
            onPress={() => navigation.navigate('ImportMnemonic')}
          >
            {evaProps => <Text {...evaProps}>I already have a wallet</Text>}
          </Button>
        </Layout>
      </View>
    </View>
  )
}
