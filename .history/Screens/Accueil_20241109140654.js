import { View, Text } from 'react-native'
import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import ListProfile from './Accueil/ListProfile'
const Tab = createMaterialBottomTabNavigator
export default function Accueil() {
  return (
     <Tab.Navigator>
      <Tab.Screen name="list" component=(ListProrfile)
     </Tab.Navigator>

  )
}
