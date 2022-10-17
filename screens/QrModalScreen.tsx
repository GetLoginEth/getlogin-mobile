import { StyleSheet } from 'react-native'
import { Text, View } from '../components/Themed'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { useEffect, useState } from 'react'
import { isEthereumAddress } from '../api/GetLoginUtils'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function QrModalScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(false)
  const [scanned, setScanned] = useState(false)

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    }

    getBarCodeScannerPermissions().then()
  }, [])

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (type !== 'org.iso.QRCode') {
      return false
    }

    if (!isEthereumAddress(data)) {
      return false
    }

    setScanned(true)
    navigation.goBack()
    navigation.navigate('SendModal', { address: data })
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>
  }

  if (!hasPermission) {
    return <Text>No access to camera</Text>
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {/*{scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}*/}
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
    width: '80%',
  },
})
