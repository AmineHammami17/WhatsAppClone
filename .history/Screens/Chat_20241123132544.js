import { View, Text } from 'react-native'
import React from 'react'

export default function Chat(props) {
    const seconditem=props.route.params.seconditem;
  return (
    <View>
      <Text>{seconditem.nom}</Text>
    </View>
  )
}
