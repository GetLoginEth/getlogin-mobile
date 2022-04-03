/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import QrModalScreen from '../screens/QrModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import WalletScreen from '../screens/WalletScreen';
import DAppsScreen from '../screens/DAppsScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import SigninScreen from '../screens/SigninScreen';
import { selectIsLogged, setBalance } from '../redux/app/appSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import ReceiveModalScreen from "../screens/ReceiveModalScreen";
import SendModalScreen from "../screens/SendModalScreen";
import SignupScreen from "../screens/SignupScreen";

export default function Navigation({colorScheme}: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator/>
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const dispatch = useAppDispatch();

  const isLogged = useAppSelector(selectIsLogged);
  setTimeout(() => {
    // if (!isLogged) {
    //   return;
    // }
    dispatch(setBalance({xdai: '1111.4444444', xbzz: '9999.9999999999999999'}))
  }, 2000);

  return (
    <Stack.Navigator>
      {isLogged ?
        <Stack.Screen name="Root" component={BottomTabNavigator} options={{headerShown: false}}/> :
        <Stack.Screen name="Root" component={LoginTabNavigator} options={{headerShown: false}}/>
      }

      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{title: 'Oops!'}}/>
      <Stack.Group screenOptions={{presentation: 'modal'}}>
        <Stack.Screen name="Modal" component={QrModalScreen}/>
        <Stack.Screen name="ReceiveModal" component={ReceiveModalScreen}/>
        <Stack.Screen name="SendModal" component={SendModalScreen}/>
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="TabOne"
        component={WalletScreen}
        options={({navigation}: RootTabScreenProps<'TabOne'>) => ({
          title: 'Wallet',
          tabBarIcon: ({color}) => <TabBarIcon name="wallet-outline" color={color}/>,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({pressed}) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <Ionicons name="qr-code-outline" size={30} color="black" style={{marginRight: 15}}/>
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={DAppsScreen}
        options={{
          title: 'DApps',
          tabBarIcon: ({color}) => <TabBarIcon name="code-outline" color={color}/>,
        }}
      />
    </BottomTab.Navigator>
  );
}

function LoginTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="TabOne"
        component={SigninScreen}
        options={({navigation}: RootTabScreenProps<'TabOne'>) => ({
          title: 'Sign in',
          tabBarIcon: ({color}) => <TabBarIcon name="at-outline" color={color}/>,

        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={SignupScreen}
        options={{
          title: 'Sign up',
          tabBarIcon: ({color}) => <TabBarIcon name="add-circle-outline" color={color}/>,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  // return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
  return <Ionicons size={30} style={{marginBottom: -3}} {...props} />;
}
