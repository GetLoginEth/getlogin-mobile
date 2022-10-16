import { Dimensions, StyleSheet } from 'react-native'
import { View } from '../components/Themed'
import { Layout, Spinner } from '@ui-kitten/components'
import general from '../styles/general'
import * as React from 'react'

export default function LoaderModalScreen() {
  return (
    <View style={styles.modalView}>
      <Layout style={[general.rowContainer, { justifyContent: 'center' }]} level="1">
        <Spinner size="giant" />
      </Layout>
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    marginTop: Dimensions.get('window').height * 0.83,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})
