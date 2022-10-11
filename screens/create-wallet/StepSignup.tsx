import { Button, Input, Layout, Text } from '@ui-kitten/components'
import general from '../../styles/general'
import React from 'react'
import { useInputState } from '../../utils/state'
import { signup } from '../../api/GetLoginUtils'
import signupStyles from '../../styles/signup'
import { USERNAME_MIN_LENGTH } from '../../utils/user'

export default function StepSignup({ mnemonic, onNextStep }) {
  const username = useInputState()

  return (
    <>
      <Layout style={{ ...general.rowContainer, ...signupStyles.createWallet }} level="1">
        <Text style={{ ...general.text, ...general.greenText }} category="h3">
          Create a username
        </Text>
      </Layout>

      <Layout style={general.rowContainer} level="1">
        <Input style={general.input} placeholder="Username" autoCapitalize="none" {...username} />
      </Layout>

      <Layout style={general.rowContainer} level="1">
        <Button
          style={[general.button]}
          status="success"
          disabled={username.value.trim().length < USERNAME_MIN_LENGTH}
          onPress={async () => {
            try {
              // todo show spinner
              console.log('singup...', username.value.trim(), mnemonic)
              await signup(username.value.trim(), mnemonic)
              console.log('signup ok')

              if (onNextStep) {
                // todo pass other data for storing in local storage of a device
                onNextStep(username)
              }
            } catch (e) {
              console.log('signup error')
              console.log(e)
              // todo show error on UI
            } finally {
              // todo hide spinner
            }
          }}
        >
          {evaProps => <Text {...evaProps}>Sign up</Text>}
        </Button>
      </Layout>
    </>
  )
}
