import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import ListProfile from './Accueil/ListProfile';
import Groupe from './Accueil/Groupe';
import MyProfile from './Accueil/MyProfile'; 

const Tab = createMaterialBottomTabNavigator();

export default function Accueil() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="List" component={ListProfile} />
      <Tab.Screen name="Groupe" component={Groupe} />
      <Tab.Screen name="My Profile" component={MyProfile} />
    </Tab.Navigator>
  );
}
