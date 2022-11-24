import { StatusBar } from 'expo-status-bar'
import { Alert, Platform } from 'react-native'
import { View } from '../components/Themed'
import React from 'react'
import { useAppSelector } from '../redux/hooks'
import general from '../styles/general'
import { Button, Layout, Text } from '@ui-kitten/components'
import { selectDappsInfo } from '../redux/app/appSlice'
import { closeAppSession } from '../api/GetLoginUtils'

export default function AppSessionModalScreen({ route }: { route: any }) {
  const dappsInfo = useAppSelector(selectDappsInfo)
  const { applicationId } = route.params || {}
  const application = dappsInfo[applicationId]

  const createAlert = () =>
    Alert.alert('Confirmation', 'Really revoke?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          // todo show progress, update the list of sessions. deny to modify any sessions for tx time
          // todo close after revoke
          // todo update the list of apps after revoke
          // todo remove from local storage
          // todo move funds to main wallet before close (could be implemented in future)
          closeAppSession(applicationId).then()
        },
      },
    ])

  return (
    <View style={[general.container, { alignItems: 'center' }]}>
      <Layout style={{ ...general.rowContainer }} level="1">
        <Text style={[general.text, general.greenText, { marginBottom: 20 }]} category="h3">
          {(application?.title || '...').substring(0, 50)}
        </Text>
      </Layout>

      <Layout style={{ ...general.rowContainer }} level="1">
        <Text style={[general.text, { marginBottom: 20 }]}>{application?.description || '...'}</Text>
      </Layout>

      <Layout style={general.rowContainer} level="1">
        <Button style={[general.button]} status="warning" onPress={createAlert}>
          {evaProps => <Text {...evaProps}>Revoke</Text>}
        </Button>
      </Layout>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}
