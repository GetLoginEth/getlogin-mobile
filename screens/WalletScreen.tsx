import { Dimensions, ImageBackground, Pressable, StyleSheet } from 'react-native'
import { Text, View } from '../components/Themed'
import { RootTabScreenProps } from '../types'
import { Ionicons } from '@expo/vector-icons'
import balanceBack from '../assets/images/wallet-back.png'
import { selectBalance } from '../redux/app/appSlice'
import { useAppSelector } from '../redux/hooks'
import { Instances } from '../Instances'
import { prepareBalance } from '../utils/ui'

export default function WalletScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const balance = useAppSelector(selectBalance)

  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <ImageBackground
          source={balanceBack}
          imageStyle={{ borderRadius: 16 }}
          resizeMode="cover"
          style={styles.balanceBack}
        >
          <Text style={styles.balanceText}>
            {prepareBalance(balance.xdai)} {Instances.data?.currency}
          </Text>
          <Text style={styles.balanceTextSmall}>
            {prepareBalance(balance.xbzz)} {Instances.data?.bzz.name}
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
