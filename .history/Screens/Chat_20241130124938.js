import { View, Text } from 'react-native'
import React from 'react'

export default function Chat(props) {
    const secondUser=props.route.params.seconditem;
    const currentUser=props.route.params.currentUser;

  return (
    <View>
      <Text>{seconditem.nom}</Text>
    </View>
  )
}
