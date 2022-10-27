import { RefreshControl, SafeAreaView, ScrollView, StyleSheet } from 'react-native'

import EditScreenInfo from '../components/EditScreenInfo'
import { Text, View } from '../components/Themed'
import React from 'react'
import { useAppDispatch } from '../redux/hooks'

export default function DAppsScreen() {
  const [refreshing, setRefreshing] = React.useState(false)
  const dispatch = useAppDispatch()

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
          <EditScreenInfo path="/screens/DAppsScreen.tsx" />
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
