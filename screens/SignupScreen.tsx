import { View } from '../components/Themed'
import { useAppDispatch } from '../redux/hooks'
import { RootTabScreenProps } from '../types'
import { Button, Icon, Layout, Spinner, Text } from '@ui-kitten/components'
import general from '../styles/general'
import signup from '../styles/signup'
import React from 'react'

const EditOutline = (props: any) => <Icon {...props} name="edit-outline" />
const CreditCardOutline = (props: any) => <Icon {...props} name="credit-card-outline" />

export default function SignupScreen({ navigation }: RootTabScreenProps<'TabTwo'>) {
  const dispatch = useAppDispatch()

  return (
    <View style={general.container}>
      <Text style={[general.text, signup.wallet, { marginBottom: 15 }]} category="h1">
        Sign up
      </Text>

      <View style={general.viewCorner}>
        <Layout style={{ ...general.rowContainer, ...signup.createWallet }} level="1">
          <Text style={{ ...general.text, ...general.greenText }} category="h3">
            Create a wallet
          </Text>
        </Layout>

        <Layout style={general.rowContainer} level="1">
          <Button
            accessoryLeft={EditOutline}
            style={[general.button, general.greenButton]}
            onPress={() => navigation.navigate('Create Wallet')}
          >
            {evaProps => <Text {...evaProps}>Create a wallet</Text>}
          </Button>
        </Layout>

        <Layout style={general.rowContainer} level="1">
          <Button
            accessoryLeft={CreditCardOutline}
            appearance="ghost"
            status={'basic'}
            style={general.button}
            onPress={() => navigation.navigate('Import Mnemonic')}
          >
            {evaProps => <Text {...evaProps}>I already have a wallet</Text>}
          </Button>
        </Layout>
      </View>

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
  )
}
