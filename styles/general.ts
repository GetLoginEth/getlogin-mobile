import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  textarea: {
    width: '100%',
  },
  text: {
    margin: 2,
  },
  greenText: {
    color: '#04c0a5',
  },
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: '5%',
  },
  input: {
    flex: 1,
    margin: 2,
  },
  button: {
    flex: 1,
    margin: 2,
  },
  greenButton: {
    backgroundColor: '#04c0a5',
    borderColor: '#04c0a5',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  controlContainer: {
    borderRadius: 4,
    margin: 2,
    padding: 6,
    backgroundColor: '#3366FF',
  },
  viewCorner: {
    // flex: 1,
    borderColor: '#04c0a5',
    borderWidth: 2,
    borderRadius: 20,
    padding: 20,
    paddingBottom: 8,
    // width: 250,
    // height: 250,
    // width: '100%',
    // height: '10%',
    // paddingLeft: 8,
    // paddingRight: 8,
  },
})
