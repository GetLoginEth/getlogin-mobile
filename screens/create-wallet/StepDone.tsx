import { Button, Layout, Text } from '@ui-kitten/components'
import general from '../../styles/general'
import React from 'react'
import signupStyles from '../../styles/signup'

export default function StepDone({ navigation }) {
  return (
    <>
      <Layout style={{ ...general.rowContainer, ...signupStyles.createWallet }} level="1">
        <Text style={{ ...general.text, ...general.greenText }} category="h3">
          Done!
        </Text>
      </Layout>

      <Layout style={general.rowContainer} level="1">
        <Button style={[general.button]} status="basic" onPress={() => navigation.goBack()}>
          {evaProps => <Text {...evaProps}>Close</Text>}
        </Button>
      </Layout>
    </>
  )
}
