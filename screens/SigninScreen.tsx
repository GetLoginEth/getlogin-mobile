import { Dimensions, StyleSheet, Animated, Easing } from 'react-native'
import { View } from '../components/Themed'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { selectSigninInfo, setSigninInfo } from '../redux/login/loginSlice'
import React, { useRef } from 'react'
import logo from '../assets/images/icon.png'
import { selectInitInfo } from '../redux/init/initSlice'
import { Button, Input, Layout, Text } from '@ui-kitten/components'
import { Instances } from '../Instances'
import { DismissKeyboard } from '../utils/ui'
import general from '../styles/general'

export default function SigninScreen() {
  const dispatch = useAppDispatch()
  const signinInfo = useAppSelector(selectSigninInfo)
  const initState = useAppSelector(selectInitInfo)
  const rotateAnimation = useRef(new Animated.Value(0)).current
  const animationTime = 1000
  const animationChangeValue = 3
  const animate = () => {
    Animated.sequence([
      Animated.timing(rotateAnimation, {
        useNativeDriver: true,
        toValue: animationChangeValue,
        easing: Easing.linear,
        duration: animationTime,
      }),
      Animated.timing(rotateAnimation, {
        useNativeDriver: true,
        toValue: 0,
        easing: Easing.linear,
        duration: animationTime,
      }),
      Animated.timing(rotateAnimation, {
        useNativeDriver: true,
        toValue: -animationChangeValue,
        easing: Easing.linear,
        duration: animationTime,
      }),
      Animated.timing(rotateAnimation, {
        useNativeDriver: true,
        toValue: 0,
        easing: Easing.linear,
        duration: animationTime,
      }),
    ]).start(() => {
      animate()
    })
  }
  // animate()

  const spin = rotateAnimation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <DismissKeyboard>
      <View style={{ ...general.container, ...{ alignItems: 'center' } }}>
        <View style={styles.balanceContainer}>
          <Animated.Image
            style={[
              styles.logo,
              {
                transform: [{ rotate: spin }],
              },
            ]}
            source={logo}
          />
        </View>

        {initState.mnemonic && initState.username && !initState.isLogged && (
          <Text
          // lightColor="rgba(0,0,0,0.8)"
          // darkColor="rgba(255,255,255,0.8)"
          >
            Fast login with user: {initState.username}
          </Text>
        )}

        <Layout style={general.rowContainer} level="1">
          <Input
            style={general.input}
            autoCapitalize="none"
            placeholder="Username"
            value={signinInfo.username}
            onChangeText={value => {
              dispatch(setSigninInfo({ ...signinInfo, username: value }))
            }}
          />
        </Layout>

        <Layout style={general.rowContainer} level="1">
          <Input
            style={general.input}
            placeholder="Password"
            value={signinInfo.password}
            onChangeText={value => {
              dispatch(setSigninInfo({ ...signinInfo, password: value }))
            }}
            textContentType="password"
            secureTextEntry={true}
          />
        </Layout>

        {/*<TouchableOpacity onPress={() => {*/}
        {/*  dispatch(setIsLogged(true))*/}
        {/*}}>*/}
        {/*  <Text>Login fake!</Text>*/}
        {/*</TouchableOpacity>*/}

        <Layout style={general.rowContainer} level="1">
          <Button
            style={{ ...general.button, ...general.greenButton }}
            onPress={async () => {
              const gl = Instances.getGetLogin
              // todo set status start login
              try {
                await gl.login(signinInfo.username, signinInfo.password)
                // todo set ok login
              } catch (e) {
                // todo set status error login
              }
            }}
          >
            {evaProps => <Text {...evaProps}>Sign in</Text>}
          </Button>
        </Layout>
      </View>
    </DismissKeyboard>
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
    // width:'100%',
    // flex: 1,
    // flexDirection: 'column',
  },
  balanceBack: {
    // flex: 1,
    justifyContent: 'center',
    // textAlignVertical:'center',
    // alignItems:'center',
    width: Dimensions.get('window').width * 0.9,
    height: 180,
    padding: 10,
  },
  logo: {
    width: 180,
    height: 180,
  },
})
