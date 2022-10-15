import { Button, Icon, Input, Layout, Text } from '@ui-kitten/components'
import general from '../../styles/general'
import * as Clipboard from 'expo-clipboard'
import React, { useState } from 'react'
import { getUIBalance, isUIBalanceEnough } from '../../api/GetLoginUtils'
import { LoaderOutline } from '../../utils/ui'

export default function StepCreate({
  mnemonic,
  address,
  onNextStep,
}: {
  mnemonic: string
  address: string
  onNextStep: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [currentBalance, setCurrentBalance] = useState('0.0')
  const CopyOutline = (props: any) => <Icon {...props} name="copy-outline" />

  return (
    <>
      <Layout style={general.rowContainer} level="1">
        <Input
          style={general.input}
          label="Address"
          autoCapitalize="none"
          value={address}
          editable={false}
          accessoryRight={
            <Button
              appearance="ghost"
              accessoryLeft={CopyOutline}
              onPress={() => {
                Clipboard.setStringAsync(address).then()
              }}
            />
          }
        />
      </Layout>

      <Layout style={[general.rowContainer]} level="1">
        <Input
          style={general.textarea}
          editable={false}
          label="Mnemonic phrase"
          autoCapitalize="none"
          multiline={true}
          textStyle={{ minHeight: 64 }}
          value={mnemonic}
          accessoryRight={
            <Button
              appearance="ghost"
              accessoryLeft={CopyOutline}
              onPress={() => {
                Clipboard.setStringAsync(mnemonic).then()
              }}
            />
          }
        />
      </Layout>

      <Layout style={[general.rowContainer, { marginTop: 15 }]} level="1">
        <Text>
          In order to register an account, you need to top-up your account with at least{' '}
          <Text style={{ fontWeight: 'bold' }}>0.01 xDai</Text>
        </Text>
      </Layout>

      <Layout style={[general.rowContainer, { marginTop: 15 }]} level="1">
        <Text>
          Current balance: <Text style={{ fontWeight: 'bold' }}>{currentBalance} xDai</Text>
        </Text>
      </Layout>

      <Layout style={[general.rowContainer, { marginTop: 15 }]} level="1">
        <Button
          style={[general.button]}
          status="success"
          disabled={loading}
          accessoryLeft={<LoaderOutline loading={loading} />}
          onPress={async () => {
            setLoading(true)

            try {
              const uiBalance = await getUIBalance(address)
              setCurrentBalance(uiBalance)

              if (isUIBalanceEnough(uiBalance) && onNextStep) {
                onNextStep()
              }
              // eslint-disable-next-line no-empty
            } catch (e) {
            } finally {
              setLoading(false)
            }
          }}
        >
          {evaProps => <Text {...evaProps}>Check balance</Text>}
        </Button>
      </Layout>
    </>
  )
}
