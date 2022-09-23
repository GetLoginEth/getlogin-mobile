import { Keyboard, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { Text, View } from '../components/Themed'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { Instances } from '../Instances'
import { selectSigninInfo, setSigninInfo } from '../redux/login/loginSlice'
import React from 'react'

const DismissKeyboard = (data: any) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{data.children}</TouchableWithoutFeedback>
)

export default function SigninScreen() {
  const dispatch = useAppDispatch()
  const signinInfo = useAppSelector(selectSigninInfo)

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <Text style={styles.title}>Sign in screen</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text lightColor="rgba(0,0,0,0.8)" darkColor="rgba(255,255,255,0.8)">
          Hello world
        </Text>

        <TextInput
          style={styles.input}
          autoCapitalize="none"
          onChangeText={value => {
            dispatch(setSigninInfo({ ...signinInfo, username: value }))
          }}
          value={signinInfo.username}
          placeholder="Username"
        />

        <TextInput
          style={styles.input}
          onChangeText={value => {
            dispatch(setSigninInfo({ ...signinInfo, password: value }))
          }}
          value={signinInfo.password}
          textContentType={'password'}
          secureTextEntry={true}
          placeholder="Password"
        />

        {/*<TouchableOpacity onPress={() => {*/}
        {/*  dispatch(setIsLogged(true))*/}
        {/*}}>*/}
        {/*  <Text>Login fake!</Text>*/}
        {/*</TouchableOpacity>*/}

        <TouchableOpacity
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
          <Text>TEST Login</Text>
        </TouchableOpacity>
      </View>
    </DismissKeyboard>
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
  input: {
    width: '80%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
})
