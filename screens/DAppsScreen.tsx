import { RefreshControl, SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { Text, View } from '../components/Themed'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import general from '../styles/general'
import { Button, Layout } from '@ui-kitten/components'
import { Instances } from '../Instances'
import { selectInitInfo } from '../redux/init/initSlice'

export default function DAppsScreen() {
  const [refreshing, setRefreshing] = React.useState(false)

  const dispatch = useAppDispatch()
  const initInfo = useAppSelector(selectInitInfo)

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true)
    // todo update apps list and balances
    // await dispatch(updateBalance(initInfo.address!))
    setRefreshing(false)
  }, [])

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{
          height: '100%',
        }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.container}>
          <Text style={styles.title}>DApps screen</Text>
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

          <Layout style={[general.rowContainer, { marginTop: 15 }]} level="1">
            <Button
              style={[general.button]}
              status="success"
              onPress={async () => {
                console.log('Creating app...')
                const data = await (
                  await Instances.getGetLogin.createApplication(
                    'Test 1',
                    'My super test',
                    ['https://ya.ru'],
                    ['0x2A1B2788e73aDD0ED8128eAdBe878599F4f4E3b5'],
                    Instances.currentWallet!,
                  )
                ).wait()
                console.log('data', data)
                console.log('Created app!')
              }}
            >
              {evaProps => <Text {...evaProps}>Create APP</Text>}
            </Button>
          </Layout>

          <Layout style={[general.rowContainer, { marginTop: 15 }]} level="1">
            <Button
              style={[general.button]}
              status="success"
              onPress={async () => {
                console.log('Creating...')
                // todo before run create app with id === 2
                // todo it is necessary to check getting list of app sessions
                await (
                  await Instances.getGetLogin.createAppSession(
                    2,
                    '0x2A1B2788e73aDD0ED8128eAdBe878599F4f4E3b5',
                    Instances.currentWallet!,
                  )
                ).wait()
                console.log('Created!')
              }}
            >
              {evaProps => <Text {...evaProps}>Create session</Text>}
            </Button>
          </Layout>

          <Layout style={[general.rowContainer, { marginTop: 15 }]} level="1">
            <Button
              style={[general.button]}
              status="success"
              onPress={async () => {
                console.log('Loading...')
                // const sessions = await Instances.getGetLogin.getActiveAppSessions(
                //   initInfo.username!,
                //   Instances.currentWallet!,
                // )
                // console.log('sessions', sessions)
                const app = await Instances.getGetLogin.getApplication(2, Instances.currentWallet!)
                console.log('app', app)
                console.log('Loaded!')
              }}
            >
              {evaProps => <Text {...evaProps}>List</Text>}
            </Button>
          </Layout>
        </View>
      </ScrollView>
    </SafeAreaView>
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
})
