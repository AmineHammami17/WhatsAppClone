import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Authentification from './Screens/Authentification';
import NewUser from './Screens/NewUser';
import Accueil from './Screens/Accueil';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Authentification">
        <Stack.Screen
          name="Authentification"
          component={Authentification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewUser"
          component={NewUser}
          options={{ title: 'Create New Account' }}
        />
        <Stack.Screen
          name="Accueil"
          component={Accueil}
          options={{ title: 'Home', headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}