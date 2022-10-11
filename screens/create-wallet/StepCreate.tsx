import { Button, Icon, Input, Layout } from '@ui-kitten/components'
import general from '../../styles/general'
import * as Clipboard from 'expo-clipboard'
import { Text } from '../../components/Themed'
import React from 'react'
import { isEnoughBalance } from '../../api/GetLoginUtils'
import { Animated } from 'react-native'

export default function StepCreate({ mnemonic, address, onNextStep }) {
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

      <Layout style={general.rowContainer} level="1">
        <Button
          style={[general.button]}
          status="success"
          onPress={async () => {
            if ((await isEnoughBalance(address)) && onNextStep) {
              onNextStep()
            }
          }}
        >
          {evaProps => <Text {...evaProps}>Check balance</Text>}
        </Button>
      </Layout>
    </>
  )
}
