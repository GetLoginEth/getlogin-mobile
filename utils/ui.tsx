import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { Button, Icon, Input, Layout, Text } from '@ui-kitten/components'
import { utils } from 'ethers'
import { Instances } from '../Instances'
import general from '../styles/general'
import * as Clipboard from 'expo-clipboard'
import { getTokenBalance } from '../api/GetLoginUtils'

export const ErrorText = ({ text }: { text: string }) => (
  <Layout style={[general.rowContainer, { marginBottom: 20 }]} level="1">
    <Text style={[{ color: 'red', fontWeight: 'bold' }]}>Error: {text}</Text>
  </Layout>
)

export const StatusText = ({ text }: { text: string }) => (
  <Layout style={[general.rowContainer, { marginTop: 10, marginBottom: 10 }]} level="1">
    <Text>{text}</Text>
  </Layout>
)

export const CopyOutline = (props: any) => <Icon {...props} name="copy-outline" />

export const AddressCopyInput = ({ address }: { address: string }) => (
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
)
export const MnemonicCopyInput = ({ mnemonic }: { mnemonic: string }) => (
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
)

/**
 * Hide keyboard by clicking to screen out of inputs
 */
export const DismissKeyboard = (data: any) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{data.children}</TouchableWithoutFeedback>
)

/**
 * Displaying loader without animation inside elements
 */
export const LoaderOutline = (props: any) => {
  return (props.loading && <Icon {...props} name="loader-outline" />) || <></>
}

export const EditOutline = (props: any) => <Icon {...props} name="edit-outline" />
export const CreditCardOutline = (props: any) => <Icon {...props} name="credit-card-outline" />

/**
 * Gets balance suitable for displaying on UI
 */
export async function getUIBalance(address: string): Promise<string> {
  return utils.formatEther(await Instances.getGetLogin.dataContract.provider.getBalance(address))
}

/**
 * Gets balance suitable for displaying on UI
 */
export async function getUIBalanceBzz(address: string): Promise<string> {
  const contractAddress = Instances.data?.bzz.address

  if (!contractAddress) {
    throw new Error('Bzz address: is no defined')
  }

  return utils.formatUnits(await getTokenBalance(contractAddress, address), 16)
}

/**
 * Prepare balance by cutting zeros after dot
 */
export function prepareBalance(balance: string) {
  const maxLengthAfterZero = 4
  const split = balance.split('.')

  if (split.length === 2 && split[1].length > 2) {
    return `${split[0]}.${split[1].substr(0, maxLengthAfterZero)}`
  } else {
    return balance
  }
}

export function parseBNStringOrZero(bnString: string): string {
  bnString = bnString.trim()

  try {
    utils.parseUnits(bnString, 'ether')
  } catch (e) {
    bnString = '0'
  }

  return bnString
}
