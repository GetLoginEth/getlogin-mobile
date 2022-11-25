import { Button, Input, Layout, Text } from '@ui-kitten/components'
import general from '../../styles/general'
import React, { useState } from 'react'
import { useInputState } from '../../utils/state'
import { assertUsernameAvailable, signup } from '../../api/GetLoginUtils'
import signupStyles from '../../styles/signup'
import { USERNAME_MIN_LENGTH } from '../../utils/wallet'
import { LoaderOutline } from '../../utils/ui'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function StepSignup({ mnemonic, onNextStep }) {
  const username = useInputState()
  const [loading, setLoading] = useState(false)

  return (
    <>
      <Layout style={{ ...general.rowContainer, ...signupStyles.createWallet }} level="1">
        <Text style={{ ...general.text, ...general.greenText }} category="h3">
          Create a username
        </Text>
      </Layout>

      <Layout style={general.rowContainer} level="1">
        <Input style={general.input} placeholder="Username" autoCapitalize="none" {...username} disabled={loading} />
      </Layout>

      <Layout style={general.rowContainer} level="1">
        <Button
          style={[general.button]}
          status="success"
          disabled={username.value.trim().length < USERNAME_MIN_LENGTH || loading}
          accessoryLeft={<LoaderOutline loading={loading} />}
          onPress={() => {
            setLoading(true)

            setTimeout(async () => {
              try {
                const usernamePrepared = username.value.trim()
                await assertUsernameAvailable(usernamePrepared)
                await signup(usernamePrepared, mnemonic)

                if (onNextStep) {
                  onNextStep(username.value)
                }
              } catch (e) {
                console.log('signup error')
                console.log(e)
                // todo show error on UI
              } finally {
                setLoading(false)
              }
            }, 10)
          }}
        >
          {evaProps => <Text {...evaProps}>Sign up</Text>}
        </Button>
      </Layout>
    </>
  )
}
