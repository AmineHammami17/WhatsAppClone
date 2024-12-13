import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import ListProfile from './Accueil/ListProfile';
import Groupe from './Accueil/Groupe';
import MyProfile from './Accueil/MyProfile'; 

const Tab = createMaterialBottomTabNavigator();

export default function Accueil(props) {
  const currentid=props.route.params.currentid;
  return (
    <Tab.Navigator>
      <Tab.Screen name="List" component={ListProfile} initialParams={{currentid:currentid}} />
      <Tab.Screen name="Groupe" component={Groupe} />
      <Tab.Screen name="My Profile" component={MyProfile} initialParams={{currentid:currentid}} />
    </Tab.Navigator>
  );
}
