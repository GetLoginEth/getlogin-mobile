import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text, View } from '../components/Themed'
import { useAppDispatch } from '../redux/hooks'
import { RootTabScreenProps } from '../types'

export default function SignupScreen({ navigation }: RootTabScreenProps<'TabTwo'>) {
  const dispatch = useAppDispatch()

  return (
    <View style={styles.container}>
      {/*<Text style={styles.title}>Sign up</Text>*/}
      {/*<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />*/}
      {/*<Text lightColor="rgba(0,0,0,0.8)" darkColor="rgba(255,255,255,0.8)">*/}
      {/*  Hello world*/}
      {/*</Text>*/}

      {/*<TouchableOpacity*/}
      {/*  onPress={() => {*/}
      {/*    dispatch(setIsLogged(true))*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Text>Login fake!</Text>*/}
      {/*</TouchableOpacity>*/}

      {/*<UI.Text blue50 text20>*/}
      {/*  Welcome*/}
      {/*</UI.Text>*/}

      <TouchableOpacity
        style={{
          marginTop: 20,
        }}
        onPress={() => navigation.navigate('Create Wallet')}
      >
        <Text>Create a wallet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          marginTop: 20,
        }}
        onPress={() => navigation.navigate('Import Mnemonic')}
      >
        <Text>I already have a wallet</Text>
      </TouchableOpacity>

      {/*<TouchableOpacity*/}
      {/*  style={{*/}
      {/*    marginTop: 20,*/}
      {/*  }}*/}
      {/*  onPress={async () => {*/}
      {/*    const mnemonic = await getAccountMnemonic()*/}

      {/*    if (!mnemonic) {*/}
      {/*      console.log('Mnemonic not found in local storage')*/}

      {/*      return*/}
      {/*    }*/}

      {/*    const rpcUrl = Instances.data?.jsonRpcProvider*/}

      {/*    if (!rpcUrl) {*/}
      {/*      console.log('Incorrect rpc url')*/}

      {/*      return*/}
      {/*    }*/}

      {/*    console.log('rpcUrl', rpcUrl)*/}
      {/*    const wallet = Wallet.fromMnemonic(mnemonic).connect(new JsonRpcProvider(rpcUrl))*/}
      {/*    console.log(wallet)*/}
      {/*    // console.log(await Instances.getGetLogin.getGlobalSettings(wallet))*/}
      {/*    console.log(await Instances.getGetLogin.isAddressAssignedToUser(wallet.address))*/}
      {/*    // try {*/}
      {/*    //   const data = await (await Instances.getGetLogin.createUser('hello1', wallet)).wait()*/}
      {/*    //   console.log(data)*/}
      {/*    // } catch (e) {*/}
      {/*    //   console.log(e)*/}
      {/*    //   console.log('can not create a user')*/}
      {/*    // }*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Text>Register with exists wallet</Text>*/}
      {/*</TouchableOpacity>*/}
    </View>
    // <UI.View flex paddingH-25 paddingT-120>
    //   <UI.Text blue50 text20>
    //     Welcome
    //   </UI.Text>
    //   <UI.TextField text50 placeholder="username" grey10 />
    //   <UI.TextField text50 placeholder="password" secureTextEntry grey10 />
    //   <UI.View marginT-100 center>
    //     <UI.Button text70 white background-orange30 label="Login" />
    //     <UI.Button link text70 orange30 label="Sign Up" marginT-20 />
    //   </UI.View>
    // </UI.View>
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
