import { View } from '../components/Themed'
import general from '../styles/general'
import React from 'react'
import { Button, Layout, Text } from '@ui-kitten/components'
import { Alert, Linking } from 'react-native'
import { resetLogged } from '../services/storage'
import { useAppDispatch } from '../redux/hooks'
import { setInitInfo } from '../redux/init/initSlice'

export default function SettingsScreen() {
  const dispatch = useAppDispatch()

  const createAlert = () =>
    Alert.alert('Confirmation', 'Clear your local account? Application session also will be removed', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          await resetLogged()
          dispatch(setInitInfo({ mnemonic: '', username: '', address: '', isLogged: false }))
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
          {evaProps => <Text {...evaProps}>Clear local account</Text>}
        </Button>
      </Layout>
    </View>
  )
}
