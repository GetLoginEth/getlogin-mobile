import { Dimensions, StyleSheet, Animated, Easing } from 'react-native'
import { View } from '../components/Themed'
import { useAppSelector } from '../redux/hooks'
import React, { useRef } from 'react'
import logo from '../assets/images/icon.png'
import { selectInitInfo } from '../redux/init/initSlice'
import { Button, Input, Layout, Text } from '@ui-kitten/components'
import { DismissKeyboard } from '../utils/ui'
import general from '../styles/general'
import { useInputState } from '../utils/state'
import { Instances } from '../Instances'
import { PASSWORD_MIN_LENGTH, USERNAME_MIN_LENGTH } from '../utils/wallet'

export default function SigninScreen() {
  const username = useInputState()
  const password = useInputState()
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
        {/*<LoadingModal />*/}
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
          <Text>Fast login with user: {initState.username}</Text>
        )}

        <Layout style={general.rowContainer} level="1">
          <Input style={general.input} autoCapitalize="none" placeholder="Username" {...username} />
        </Layout>

        <Layout style={general.rowContainer} level="1">
          <Input
            style={general.input}
            placeholder="Password"
            {...password}
            textContentType="password"
            secureTextEntry={true}
          />
        </Layout>

        <Layout style={general.rowContainer} level="1">
          <Button
            style={[general.button]}
            status="success"
            disabled={username.value.trim().length < USERNAME_MIN_LENGTH || password.value.length < PASSWORD_MIN_LENGTH}
            onPress={async () => {
              // const gl = Instances.getGetLogin
              // // todo set status start login
              try {
                await Instances.getGetLogin.login(username.value.trim(), password.value)
                console.log('login ok')
                // todo set ok login
              } catch (e) {
                console.log('login error', e)
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
  balanceContainer: {},
  balanceBack: {
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.9,
    height: 180,
    padding: 10,
  },
  logo: {
    width: 180,
    height: 180,
  },
})
