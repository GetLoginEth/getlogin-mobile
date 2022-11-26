/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native'
import * as Linking from 'expo-linking'
import { RootStackParamList } from '../types'

const linking: LinkingOptions<RootStackParamList> = {
  // prefixes: [Linking.createURL('/'), 'https://getlogin.org'],
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Root: {
        screens: {
          TabOne: {
            screens: {
              TabOneScreen: 'dapp-authorize',
            },
          },
          TabTwo: {
            screens: {
              TabTwoScreen: 'two',
            },
          },
        },
      },
      // screens that could be opened by 3rd-party app
      // DAppAuthorizationModal: 'dapp-authorize',
      NotFound: '*',
    },
  },
}

export default linking
