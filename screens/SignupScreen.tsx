import { View } from '../components/Themed'
import { RootTabScreenProps } from '../types'
import { Button, Layout, Text } from '@ui-kitten/components'
import general from '../styles/general'
import signup from '../styles/signup'
import React from 'react'
import { CreditCardOutline, EditOutline } from '../utils/ui'
import { Animated } from 'react-native'
import logo from '../assets/images/icon.png'

export default function SignupScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  return (
    <View style={general.container}>
      {/*<Text style={[general.text, signup.wallet, { marginBottom: 15 }]} category="h1">*/}
      {/*  Sign up*/}
      {/*</Text>*/}

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Animated.Image style={[general.logo]} source={logo} />
      </View>

      <View style={general.viewCorner}>
        <Layout style={{ ...general.rowContainer, ...signup.createWallet }} level="1">
          <Text style={{ ...general.text, ...general.greenText }} category="h3">
            Create an account
          </Text>
        </Layout>

        <Layout style={general.rowContainer} level="1">
          <Button
            style={[general.button]}
            status="success"
            accessoryLeft={EditOutline}
            onPress={() => navigation.navigate('CreateWallet')}
          >
            {evaProps => <Text {...evaProps}>Create an account</Text>}
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
            {evaProps => <Text {...evaProps}>I already have an account</Text>}
          </Button>
        </Layout>
      </View>
    </View>
  )
}
