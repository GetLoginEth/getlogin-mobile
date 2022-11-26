import {
  Dimensions,
  ImageBackground,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { View } from '../components/Themed'
import { Ionicons } from '@expo/vector-icons'
import balanceBack from '../assets/images/wallet-back.png'
import { selectBalance, updateBalance } from '../redux/app/appSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { prepareBalance } from '../utils/ui'
import general from '../styles/general'
import { Layout, Text } from '@ui-kitten/components'
import React, { useEffect } from 'react'
import signupStyles from '../styles/signup'
import { selectInitInfo } from '../redux/init/initSlice'
import { getCurrencyName, getTokenName } from '../api/GetLoginUtils'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function WalletScreen({ navigation, route }) {
  const [refreshing, setRefreshing] = React.useState(false)
  const balance = useAppSelector(selectBalance)
  const initInfo = useAppSelector(selectInitInfo)
  const dispatch = useAppDispatch()

  const id = (route.params?.params || {}).applicationId
  const applicationId = id ? Number(id) : 0

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true)
    await dispatch(updateBalance(initInfo.address!))
    setRefreshing(false)
  }, [])

  useEffect(() => {
    onRefresh().then()
  }, [])

  useEffect(() => {
    if (applicationId && route.params?.path?.startsWith('dapp-authorize')) {
      navigation.navigate('DAppAuthorizationModal', { applicationId })
    }
  }, [route.params?.path])

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{
          height: '100%',
        }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={general.container}>
          <Layout style={[general.rowContainer, signupStyles.createWallet]} level="1">
            <Text style={[general.text, general.greenText]} category="h3">
              {initInfo.username || ''}
            </Text>
          </Layout>

          <View style={styles.balanceContainer}>
            <ImageBackground
              source={balanceBack}
              imageStyle={{ borderRadius: 16 }}
              resizeMode="cover"
              style={[styles.balanceBack, general.shadowProp]}
            >
              <Text style={styles.balanceText}>
                {prepareBalance(balance.xdai)} {getCurrencyName()}
              </Text>
              <Text style={styles.balanceTextSmall}>
                {prepareBalance(balance.xbzz)} {getTokenName()}
              </Text>
            </ImageBackground>
          </View>

          <View style={styles.walletButtonsHolder}>
            <Pressable
              onPress={() => navigation.navigate('ReceiveModal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <View style={styles.walletButton}>
                <Ionicons style={styles.walletIcon} name="arrow-down-circle-outline" size={60} color="black" />
                <Text style={styles.walletButtonTitle}>Receive</Text>
                <Text style={{ textAlign: 'center', fontSize: 12, marginTop: 5 }} appearance="hint">
                  From any address
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate('SendModal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <View style={styles.walletButton}>
                <Ionicons style={styles.walletIcon} name="arrow-up-circle-outline" size={60} color="black" />
                <Text style={styles.walletButtonTitle}>Send</Text>
                <Text style={{ textAlign: 'center', fontSize: 12, marginTop: 5 }} appearance="hint">
                  To any address
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  balanceContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  balanceText: {
    marginLeft: 10,
    color: 'white',
    fontSize: 40,
  },
  balanceTextSmall: {
    marginLeft: 10,
    color: 'white',
    fontSize: 30,
  },
  balanceBack: {
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.9,
    height: 210,
    padding: 10,
  },
  walletButtonsHolder: {
    marginTop: 20,
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  walletButtonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  walletIcon: {
    textAlign: 'center',
  },
  walletButton: {
    padding: 8,
    marginLeft: 5,
    marginRight: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#d7d7d7',
    borderRadius: 16,
    width: 150,
    height: 130,
  },
})
