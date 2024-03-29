import { Button, Layout, Text } from '@ui-kitten/components'
import general from '../../styles/general'
import React from 'react'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function StepDone({ navigation }) {
  return (
    <>
      <Layout style={[general.rowContainer]} level="1">
        <Text style={[general.text, general.greenText]} category="h3">
          Done!
        </Text>
      </Layout>

      <Layout style={[general.rowContainer]} level="1">
        <Text style={[general.text]}>
          The wallet has been successfully saved on your device. Now you can close this message and start using the app.
        </Text>
      </Layout>

      <Layout style={[general.rowContainer, { marginTop: 20 }]} level="1">
        <Button style={[general.button]} status="basic" onPress={() => navigation.goBack()}>
          {evaProps => <Text {...evaProps}>Close</Text>}
        </Button>
      </Layout>
    </>
  )
}
