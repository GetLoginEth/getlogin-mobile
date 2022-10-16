import { StatusBar } from 'expo-status-bar'
import { Platform, StyleSheet } from 'react-native'
import { View } from '../components/Themed'
import QRCode from 'react-native-qrcode-svg'
import logo from '../assets/images/icon.png'
import { AddressCopyInput } from '../utils/ui'
import React from 'react'
import { useAppSelector } from '../redux/hooks'
import { selectInitInfo } from '../redux/init/initSlice'
import general from '../styles/general'
import { Layout, Text } from '@ui-kitten/components'

export default function ReceiveModalScreen() {
  const initInfo = useAppSelector(selectInitInfo)
  const address = initInfo.address as string

  return (
    <View style={[general.container, { alignItems: 'center' }]}>
      <Layout style={{ ...general.rowContainer }} level="1">
        <Text style={[general.text, general.greenText, { marginBottom: 20 }]} category="h3">
          Receive
        </Text>
      </Layout>

      <View>
        <QRCode size={300} value={address} logo={logo} logoSize={60} logoBackgroundColor="transparent" />
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <AddressCopyInput address={address} />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
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
    width: '100%',
  },
})
