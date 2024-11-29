import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Authentification from './Screens/Auth';
import NewUser from './Screens/NewUser';
import Accueil from './Screens/Accueil';
import Chat from './Screens/Chat';

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
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{ title: 'Chat' }} // Example options for the Chat screen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
