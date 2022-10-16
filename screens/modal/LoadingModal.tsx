import { Modal, StyleSheet, View } from 'react-native'
import { Layout, Spinner } from '@ui-kitten/components'
import general from '../../styles/general'
import * as React from 'react'
import { useAppSelector } from '../../redux/hooks'
import { selectIsModal } from '../../redux/app/appSlice'

export default function LoadingModal() {
  const isModal = useAppSelector(selectIsModal)

  return (
    <Modal animationType="fade" transparent={true} visible={isModal}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Layout style={[general.rowContainer, { justifyContent: 'center' }]} level="1">
            <Spinner size="giant" />
          </Layout>
        </View>
      </View>
    </Modal>
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
