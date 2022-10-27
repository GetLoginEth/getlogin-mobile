import { Ionicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as React from 'react'
import { ColorSchemeName, Pressable } from 'react-native'
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import QrModalScreen from '../screens/QrModalScreen'
import NotFoundScreen from '../screens/NotFoundScreen'
import WalletScreen from '../screens/WalletScreen'
import DAppsScreen from '../screens/DAppsScreen'
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types'
import LinkingConfiguration from './LinkingConfiguration'
import SigninScreen from '../screens/SigninScreen'
import { updateBalance } from '../redux/app/appSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import ReceiveModalScreen from '../screens/ReceiveModalScreen'
import SendModalScreen from '../screens/SendModalScreen'
import SignupScreen from '../screens/SignupScreen'
import ImportMnemonicModalScreen from '../screens/ImportMnemonicModalScreen'
import { useEffect, useState } from 'react'
import { Instances } from '../Instances'
import CreateWalletModalScreen from '../screens/create-wallet/CreateWalletModalScreen'
import SettingsScreen from '../screens/SettingsScreen'
import LoaderModalScreen from '../screens/LoaderModalScreen'
import { selectInitInfo, selectIsLogged } from '../redux/init/initSlice'

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  )
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator() {
  const [isLoginChecked, setIsLoginChecked] = useState(false)
  const dispatch = useAppDispatch()
  const isLogged = useAppSelector(selectIsLogged)
  const initInfo = useAppSelector(selectInitInfo)

  // todo update balance after account import/login
  useEffect(() => {
    // todo remove setTimeout?
    setTimeout(async () => {
      await Instances.init(dispatch)
      setIsLoginChecked(true)
    }, 10)
  }, [])

  useEffect(() => {
    if (!(isLogged && initInfo && initInfo.address)) {
      return
    }

    dispatch(updateBalance(initInfo.address as string))
  }, [isLogged, initInfo?.address])

  let rootComponent

  if (!isLoginChecked) {
    rootComponent = LoaderModalScreen
  } else if (isLoginChecked && isLogged) {
    rootComponent = LoggedTabNavigator
  } else {
    rootComponent = LoginTabNavigator
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={rootComponent} options={{ headerShown: false }} />

      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="Loader"
          component={LoaderModalScreen}
          options={{ gestureEnabled: false, presentation: 'transparentModal', headerShown: false }}
        />
        <Stack.Screen name="Modal" component={QrModalScreen} options={{ headerTitle: 'Scan QR code' }} />
        <Stack.Screen name="ReceiveModal" component={ReceiveModalScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SendModal" component={SendModalScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Import Mnemonic" component={ImportMnemonicModalScreen} />
        <Stack.Screen name="Create Wallet" component={CreateWalletModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>()

function LoggedTabNavigator() {
  const colorScheme = useColorScheme()

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="TabOne"
        component={WalletScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'Wallet',
          tabBarIcon: ({ color }) => <TabBarIcon name="wallet-outline" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Ionicons name="qr-code-outline" size={30} color="black" style={{ marginRight: 15 }} />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={DAppsScreen}
        options={{
          title: 'DApps',
          tabBarIcon: ({ color }) => <TabBarIcon name="code-outline" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TabSettings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="settings-outline" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  )
}

function LoginTabNavigator() {
  const colorScheme = useColorScheme()

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="TabOne"
        component={SigninScreen}
        options={() => ({
          title: 'Sign in',
          tabBarIcon: ({ color }) => <TabBarIcon name="at-outline" color={color} />,
        })}
      />

      <BottomTab.Screen
        name="TabTwo"
        component={SignupScreen}
        options={{
          title: 'Sign up',
          tabBarIcon: ({ color }) => <TabBarIcon name="add-circle-outline" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  )
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />
}
