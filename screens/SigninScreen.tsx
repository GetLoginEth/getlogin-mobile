import { Dimensions, StyleSheet, Animated, Easing } from 'react-native'
import { View } from '../components/Themed'
import React, { useRef, useState } from 'react'
import logo from '../assets/images/icon.png'
import { Button, Input, Layout, Text } from '@ui-kitten/components'
import { DismissKeyboard, LoaderOutline } from '../utils/ui'
import general from '../styles/general'
import { useInputState } from '../utils/state'
import { Instances } from '../Instances'
import { PASSWORD_MIN_LENGTH, USERNAME_MIN_LENGTH } from '../utils/wallet'
import { RootTabScreenProps } from '../types'

export default function SigninScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const username = useInputState()
  const password = useInputState()
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
  const isLoginDisabled =
    loading || username.value.trim().length < USERNAME_MIN_LENGTH || password.value.length < PASSWORD_MIN_LENGTH

  return (
    <DismissKeyboard>
      <View style={[general.container, { alignItems: 'center' }]}>
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

        {error && (
          <Layout style={[general.rowContainer]} level="1">
            <Text style={{ color: 'red' }}>{error}</Text>
          </Layout>
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
            accessoryLeft={<LoaderOutline loading={loading} />}
            disabled={isLoginDisabled}
            onPress={async () => {
              setLoading(true)
              try {
                setError('')
                await Instances.getGetLogin.login(username.value.trim(), password.value)
              } catch (e) {
                const error = e as Error
                setError(error.message)
              } finally {
                setLoading(false)
              }
            }}
          >
            {evaProps => <Text {...evaProps}>Sign in</Text>}
          </Button>
        </Layout>

        <Layout style={general.rowContainer} level="1">
          <Button
            // accessoryLeft={CreditCardOutline}
            appearance="ghost"
            status={'basic'}
            style={general.button}
            onPress={() => navigation.navigate('ImportMnemonic')}
          >
            {evaProps => <Text {...evaProps}>I already have a wallet</Text>}
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
