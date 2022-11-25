import { Button, Layout, Text } from '@ui-kitten/components'
import general from '../../styles/general'
import React, { useState } from 'react'
import { getCurrencyName, isUIBalanceEnough } from '../../api/GetLoginUtils'
import { AddressCopyInput, getUIBalance, LoaderOutline, MnemonicCopyInput } from '../../utils/ui'
import { MIN_BALANCE } from '../../utils/wallet'

export default function StepCreate({
  mnemonic,
  address,
  onNextStep,
}: {
  mnemonic: string
  address: string
  onNextStep: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [currentBalance, setCurrentBalance] = useState('0.0')

  return (
    <>
      <AddressCopyInput address={address} />

      <MnemonicCopyInput mnemonic={mnemonic} />

      <Layout style={[general.rowContainer, { marginTop: 15 }]} level="1">
        <Text>
          In order to register an account, you need to top-up your account with at least{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {MIN_BALANCE} {getCurrencyName()}
          </Text>
        </Text>
      </Layout>

      <Layout style={[general.rowContainer, { marginTop: 15 }]} level="1">
        <Text>
          Current balance:{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {currentBalance} {getCurrencyName()}
          </Text>
        </Text>
      </Layout>

      <Layout style={[general.rowContainer, { marginTop: 15 }]} level="1">
        <Button
          style={[general.button]}
          status="success"
          disabled={loading}
          accessoryLeft={<LoaderOutline loading={loading} />}
          onPress={async () => {
            setLoading(true)

            try {
              const uiBalance = await getUIBalance(address)
              setCurrentBalance(uiBalance)

              if (isUIBalanceEnough(uiBalance) && onNextStep) {
                onNextStep()
              }
              // eslint-disable-next-line no-empty
            } catch (e) {
            } finally {
              setLoading(false)
            }
          }}
        >
          {evaProps => <Text {...evaProps}>Check balance</Text>}
        </Button>
      </Layout>
    </>
  )
}
