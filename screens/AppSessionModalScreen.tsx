import { StatusBar } from 'expo-status-bar'
import { Alert, Platform } from 'react-native'
import { View } from '../components/Themed'
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import general from '../styles/general'
import { Button, Layout, Text } from '@ui-kitten/components'
import { selectDappsInfo, updateBalance, updateDappsSessionsList } from '../redux/app/appSlice'
import { closeAppSession } from '../api/GetLoginUtils'
import { LoaderOutline } from '../utils/ui'
import { selectInitInfo } from '../redux/init/initSlice'
import { removeApplicationSession } from '../services/storage'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function AppSessionModalScreen({ route, navigation }) {
  const [process, setProcess] = useState(false)
  const dispatch = useAppDispatch()
  const initInfo = useAppSelector(selectInitInfo)
  const dappsInfo = useAppSelector(selectDappsInfo)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  const id = (route.params || {}).applicationId
  const applicationId = id ? Number(id) : 0
  const application = dappsInfo[applicationId]

  const createAlert = () =>
    Alert.alert('Confirmation', 'Really revoke? A paid transaction will be made in the blockchain', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          setProcess(true)
          setStatus('')
          try {
            setStatus('Sending transaction...')
            const tx = await closeAppSession(applicationId)
            setStatus('Waiting for 1 confirmation...')
            await tx.wait(1)
            await removeApplicationSession(applicationId)
            dispatch(updateBalance(initInfo.address!))
            dispatch(updateDappsSessionsList(initInfo.username!))
            navigation.navigate('TabOne')
          } catch (e) {
            const error = e as Error
            setError(error.message)
          } finally {
            setProcess(false)
            setStatus('')
          }
        },
      },
    ])

  return (
    <View style={[general.container, { alignItems: 'center' }]}>
      {error && (
        <Layout style={[general.rowContainer, { marginBottom: 20 }]} level="1">
          <Text style={[{ color: 'red', fontWeight: 'bold' }]}>Error: {error}</Text>
        </Layout>
      )}

      <Layout style={{ ...general.rowContainer }} level="1">
        <Text style={[general.text, general.greenText, { marginBottom: 20 }]} category="h3">
          {(application?.title || '...').substring(0, 50)}
        </Text>
      </Layout>

      <Layout style={{ ...general.rowContainer }} level="1">
        <Text style={[general.text, { marginBottom: 20 }]}>{application?.description || '...'}</Text>
      </Layout>

      {status && (
        <Layout style={[general.rowContainer, { marginBottom: 20 }]} level="1">
          <Text>{status}</Text>
        </Layout>
      )}

      <Layout style={general.rowContainer} level="1">
        <Button
          style={[general.button]}
          status="warning"
          disabled={process}
          onPress={createAlert}
          accessoryLeft={<LoaderOutline loading={process} />}
        >
          {evaProps => <Text {...evaProps}>Revoke</Text>}
        </Button>
      </Layout>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}
