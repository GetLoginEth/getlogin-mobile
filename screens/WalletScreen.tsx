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
import { RootTabScreenProps } from '../types'
import { Ionicons } from '@expo/vector-icons'
import balanceBack from '../assets/images/wallet-back.png'
import { selectBalance, updateBalance } from '../redux/app/appSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { Instances } from '../Instances'
import { prepareBalance } from '../utils/ui'
import general from '../styles/general'
import { Layout, Text } from '@ui-kitten/components'
import React from 'react'
import signupStyles from '../styles/signup'
import { selectInitInfo } from '../redux/init/initSlice'

export default function WalletScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [refreshing, setRefreshing] = React.useState(false)
  const balance = useAppSelector(selectBalance)
  const initInfo = useAppSelector(selectInitInfo)
  const dispatch = useAppDispatch()

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true)
    await dispatch(updateBalance(initInfo.address!))
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
              style={styles.balanceBack}
            >
              <Text style={styles.balanceText}>
                {prepareBalance(balance.xdai)} {Instances.data?.currency || ''}
              </Text>
              <Text style={styles.balanceTextSmall}>
                {prepareBalance(balance.xbzz)} {Instances.data?.bzz.name || ''}
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
    height: 120,
  },
})
