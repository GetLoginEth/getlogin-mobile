import { StatusBar } from 'expo-status-bar'
import { Alert, Platform } from 'react-native'
import { View } from '../components/Themed'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import general from '../styles/general'
import { Button, Card, Layout, Text } from '@ui-kitten/components'
import { getDappInfo, selectDappsInfo, updateBalance } from '../redux/app/appSlice'
import { selectInitInfo, selectIsLogged } from '../redux/init/initSlice'
import { createAppSessionAndStore, getApplicationSession, isEnoughBalance } from '../api/GetLoginUtils'
import { LoaderOutline } from '../utils/ui'
import * as Linking from 'expo-linking'
import { Instances } from '../Instances'

export const ERROR_EMPTY_APPLICATION_ID = '"applicationId" is empty'
export const ERROR_OS_NOT_ALLOWED = 'current OS is not allowed'
export const ERROR_OS_URL_NOT_FOUND = 'not found implementation of the app for current OS'
export const ERROR_APP_PACKAGE_NAME_INCORRECT = 'external app package name is not correct'
export const ERROR_USER_NOT_LOGGED = 'user not logged to make this action'
export const ALLOWED_OSES = ['android', 'ios']
export const APPLICATION_SESSION_AMOUNT = '0.01'

function notEnoughErrorText(): string {
  return `you don't have enough balance for the action. You must have more than ${APPLICATION_SESSION_AMOUNT} ${
    Instances.data?.currency || ''
  }`
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function DAppAuthorizationModalScreen({ route, navigation }) {
  const [process, setProcess] = useState(false)
  const [enoughBalance, setEnoughBalance] = useState(false)
  const [externalAppPackageName, setExternalAppPackageName] = useState('')
  const [sessionToShare, setSessionToShare] = useState('')
  const dispatch = useAppDispatch()
  const dappsInfo = useAppSelector(selectDappsInfo)
  const isLogged = useAppSelector(selectIsLogged)
  const initInfo = useAppSelector(selectInitInfo)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  const isOsAllowed = ALLOWED_OSES.includes(Platform.OS)
  const id = (route.params || {}).applicationId
  const applicationId = id ? Number(id) : 0
  const application = applicationId > 0 ? dappsInfo[applicationId] : undefined
  const isAuthorizeDisabled = Boolean(error) || process || !isOsAllowed || !externalAppPackageName || !enoughBalance

  useEffect(() => {
    if (!applicationId) {
      setError(ERROR_EMPTY_APPLICATION_ID)

      return
    }

    dispatch(getDappInfo(applicationId))
  }, [applicationId])

  useEffect(() => {
    async function run() {
      const username = initInfo.username!

      if (!username) {
        setError(ERROR_USER_NOT_LOGGED)

        return
      }

      if (!isOsAllowed) {
        setError(ERROR_OS_NOT_ALLOWED)

        return
      }

      if (!application) {
        return
      }

      const osPrefix = `${Platform.OS}:`
      const externalAppUrl = application.allowedUrls.find(item => item.startsWith(osPrefix))

      if (!externalAppUrl) {
        setError(ERROR_OS_URL_NOT_FOUND)

        return
      }

      const packageName = externalAppUrl.substring(osPrefix.length, externalAppUrl.length)

      if (!packageName) {
        setError(ERROR_APP_PACKAGE_NAME_INCORRECT)

        return
      }

      try {
        const localSession = await getApplicationSession(username, applicationId)
        setSessionToShare(localSession.privateKey)
        // eslint-disable-next-line no-empty
      } catch (e) {}

      setExternalAppPackageName(packageName)

      if (await isEnoughBalance(Instances.currentWallet!.address, APPLICATION_SESSION_AMOUNT)) {
        setEnoughBalance(true)
      } else {
        setError(notEnoughErrorText())
      }
    }

    run().then()
  }, [application])

  const onShareSession = async () => {
    // todo or maybe open specific getlogin url which makes this redirection
    try {
      Linking.openURL(`${externalAppPackageName}?getlogin_session=${sessionToShare}`).then()
    } catch (e) {
      const error = e as Error
      setError(error.message)
    }
  }

  const createAlert = () =>
    Alert.alert('Confirmation', 'Really authorize? A paid transaction will be made in the blockchain', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          onCreateSession().then()
        },
      },
    ])

  const onCreateSession = async () => {
    setProcess(true)
    setStatus('')
    try {
      setStatus('Waiting for 1 confirmation...')
      const wallet = await createAppSessionAndStore(applicationId, APPLICATION_SESSION_AMOUNT)
      setSessionToShare(wallet.privateKey)
      dispatch(updateBalance(initInfo.address!))
    } catch (e) {
      const error = e as Error
      setError(error.message)
    } finally {
      setProcess(false)
      setStatus('')
    }
  }

  const onCancel = () => {
    navigation.navigate('TabOne')
  }

  const onOpenSignIn = () => {
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

      {!error && isLogged && (
        <>
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
            </Layout>
          </Card>

          {status && (
            <Layout style={[general.rowContainer, { marginBottom: 20 }]} level="1">
              <Text>{status}</Text>
            </Layout>
          )}

          {sessionToShare && (
            <Layout style={general.rowContainer} level="1">
              <Button style={[general.button]} status="primary" onPress={onShareSession}>
                {evaProps => <Text {...evaProps}>Share session with app</Text>}
              </Button>
            </Layout>
          )}

          {!sessionToShare && (
            <Layout style={general.rowContainer} level="1">
              <Button style={[general.button]} status="basic" onPress={onCancel} disabled={process}>
                {evaProps => <Text {...evaProps}>Cancel</Text>}
              </Button>
              <Button
                style={[general.button]}
                status="primary"
                onPress={createAlert}
                disabled={isAuthorizeDisabled}
                accessoryLeft={<LoaderOutline loading={process} />}
              >
                {evaProps => <Text {...evaProps}>Authorize</Text>}
              </Button>
            </Layout>
          )}
        </>
      )}

      {!isLogged && (
        <>
          <Layout style={[general.rowContainer, { marginBottom: 20 }]} level="1">
            <Text category="h6">Please, sign in before authorization</Text>
          </Layout>

          <Layout style={general.rowContainer} level="1">
            <Button style={[general.button]} status="basic" onPress={onOpenSignIn}>
              {evaProps => <Text {...evaProps}>Open sign in form</Text>}
            </Button>
          </Layout>
        </>
      )}

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}
