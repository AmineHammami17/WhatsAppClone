import { View, Text } from 'react-native'
import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

const Tab = createMaterialBottomTabNavigator
export default function Accueil() {
  return (
    <View>
      <Text>Accueil</Text>
    </View>
  )
}
