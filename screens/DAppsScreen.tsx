import { View } from '../components/Themed'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { Icon, Layout, List, ListItem, Text } from '@ui-kitten/components'
import { selectInitInfo } from '../redux/init/initSlice'
import general from '../styles/general'
import { selectDappsInfo, selectDappsSessionsList, updateDappsSessionsList } from '../redux/app/appSlice'

export default function DAppsScreen({ navigation }: { navigation: any }) {
  const [refreshing, setRefreshing] = useState(false)
  const dispatch = useAppDispatch()
  const initInfo = useAppSelector(selectInitInfo)
  const dappsSessionsList = useAppSelector(selectDappsSessionsList)
  const dappsInfo = useAppSelector(selectDappsInfo)

  useEffect(() => {
    if (!initInfo.username) {
      return
    }

    dispatch(updateDappsSessionsList(initInfo.username))
  }, [initInfo.username])

  const data = dappsSessionsList?.map(item => {
    const app = dappsInfo[item.applicationId]

    if (app) {
      return {
        title: app.title.substring(0, 45),
        description: app.description.substring(0, 45),
        applicationId: item.applicationId,
      }
    } else {
      return { title: '...', description: '', applicationId: item.applicationId }
    }
  })

  const renderItemIcon = (props: any) => <Icon {...props} name="cube-outline" />

  const renderItem = ({ item }: { item: { applicationId: number; title: string; description: string } }) => (
    <ListItem
      title={item.title}
      description={item.description}
      accessoryLeft={renderItemIcon}
      onPress={() => {
        navigation.navigate('AppSessionModal', { applicationId: item.applicationId })
      }}
    />
  )

  const onRefresh = React.useCallback(async () => {
    if (!initInfo.username) {
      return
    }

    setRefreshing(true)
    dispatch(updateDappsSessionsList(initInfo.username))
    setRefreshing(false)
  }, [])

  return (
    <View style={general.container}>
      <Layout style={[general.rowContainer, { marginBottom: 20 }]} level="1">
        <Text style={{ ...general.text, ...general.greenText }} category="h3">
          DApps
        </Text>
      </Layout>

      {(!data || data.length === 0) && (
        <Layout style={[general.rowContainer, { backgroundColor: '#ffffff' }]} level="2">
          <Text style={[general.text]}>There is no authorized DApps</Text>
        </Layout>
      )}

      {data && (
        <List
          onRefresh={onRefresh}
          refreshing={refreshing}
          style={{ backgroundColor: '#ffffff' }}
          data={data}
          renderItem={renderItem}
        />
      )}
    </View>
  )
}
