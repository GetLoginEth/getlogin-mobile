import { StatusBar } from 'expo-status-bar'
import { Alert, Platform } from 'react-native'
import { View } from '../components/Themed'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import general from '../styles/general'
import { Button, Card, Layout, Text } from '@ui-kitten/components'
import { getDappInfo, selectDappsInfo } from '../redux/app/appSlice'

export const ERROR_EMPTY_APPLICATION_ID = '"applicationId" is empty'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function DAppAuthorizationModalScreen({ route, navigation }) {
  const dispatch = useAppDispatch()
  const dappsInfo = useAppSelector(selectDappsInfo)
  const [error, setError] = useState('')

  const { applicationId } = route.params || {}
  const application = dappsInfo[applicationId]
  const isAuthorizeDisabled = Boolean(error)

  useEffect(() => {
    if (!applicationId) {
      setError(ERROR_EMPTY_APPLICATION_ID)

      return
    }

    dispatch(getDappInfo(applicationId))
  }, [applicationId])

  const createAlert = () =>
    Alert.alert('Confirmation', 'Really authorize?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          console.log('ok Authorize clicked')
        },
      },
    ])

  const onCancel = () => {
    navigation.navigate('TabOne')
  }

  return (
    <View style={[general.container]}>
      <Layout style={{ ...general.rowContainer }} level="1">
        <Text style={[general.text, general.greenText, { marginBottom: 20 }]} category="h3">
          DApp Authorization
        </Text>
      </Layout>

      {error && (
        <Layout style={[general.rowContainer, { marginBottom: 20 }]} level="1">
          <Text style={[{ color: 'red', fontWeight: 'bold' }]}>Error: {error}</Text>
        </Layout>
      )}

      {!error && (
        <Card
          style={{ width: '100%', marginBottom: 20 }}
          header={
            <View>
              <Text category="h6">{(application?.title || '...').substring(0, 50)}</Text>
            </View>
          }
        >
          <Layout style={{ ...general.rowContainer }} level="1">
            <Text>{application?.description || '...'}</Text>
            {/*<Text style={[general.text, { marginBottom: 20 }]}>{application?.description || '...'}</Text>*/}
          </Layout>
        </Card>
      )}

      <Layout style={general.rowContainer} level="1">
        <Button style={[general.button]} status="basic" onPress={onCancel}>
          {evaProps => <Text {...evaProps}>Cancel</Text>}
        </Button>
        <Button style={[general.button]} status="primary" onPress={createAlert} disabled={isAuthorizeDisabled}>
          {evaProps => <Text {...evaProps}>Authorize</Text>}
        </Button>
      </Layout>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}
