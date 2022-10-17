import { View } from '../components/Themed'
import general from '../styles/general'
import React from 'react'
import { Button, Layout, Text } from '@ui-kitten/components'
import { Alert } from 'react-native'
import { resetLogged } from '../services/storage'
import { useAppDispatch } from '../redux/hooks'
import { setIsLogged } from '../redux/app/appSlice'

export default function SettingsScreen() {
  const dispatch = useAppDispatch()

  const createAlert = () =>
    Alert.alert('Confirmation', 'Reset your local account?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          await resetLogged()
          dispatch(setIsLogged(false))
        },
      },
    ])

  return (
    <View style={general.container}>
      <Layout style={[general.rowContainer, { marginBottom: 20 }]} level="1">
        <Text style={{ ...general.text, ...general.greenText }} category="h3">
          Settings
        </Text>
      </Layout>

      <Layout style={general.rowContainer} level="1">
        <Button style={[general.button]} status={'danger'} onPress={createAlert}>
          {evaProps => <Text {...evaProps}>Reset account</Text>}
        </Button>
      </Layout>
    </View>
  )
}
