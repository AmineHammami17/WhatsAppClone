import React, { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, BackHandler } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import firebase from '../Config';

export default function Authentification({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const refInput2 = useRef();

  const handleExit = () => {
    BackHandler.exitApp();
  };

  const handleSignIn = async () => {
    if (email === '' || password === '') {
      alert("Please enter both email and password.");
      return;
    }
  
    try {
      const auth = firebase.auth(); 
      await firebase.auth().signInWithEmailAndPassword(email, password);
      const currentid = auth.currentUser.uid; 
      navigation.replace("Accueil", { currentid: currentid }); 
      alert('Login successful');
    } catch (error) {
      console.error(error);
      alert(`Login failed: ${error.message}`);
    }
  };
  
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor='#ffff80' />
      <ImageBackground 
        source={require('../assets/flower.jpg')} 
        style={styles.container}
      >
        
        <View 
          style={{
            height: 350,
            width: "85%",
            backgroundColor: '#0005',
            borderRadius: 20,
            justifyContent: 'flex-start', 
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Text style={styles.title}>Authentification</Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            onSubmitEditing={() => refInput2.current?.focus()}
            blurOnSubmit={false}
            mode="outlined"
            style={styles.input}
            keyboardType='email-address'
          />

          <TextInput
            label="Password"
            ref={refInput2}
            value={password}
            onChangeText={text => setPassword(text)}
            mode="outlined"
            style={styles.input}
            secureTextEntry={true}
          />

          {/* Sign In Button */}
          <Button 
            mode="contained" 
            onPress={handleSignIn}
            style={styles.button}
            buttonColor="black"
          >
            Sign In
          </Button>

          {/* Create New User Link */}
          <TouchableOpacity 
            style={styles.newUserLink}
            onPress={() => navigation.navigate('NewUser')}
          >
            <Text style={{ color: '#fff' }}>Create new user</Text>
          </TouchableOpacity>

          {/* Exit Button */}
          <Button 
            mode="outlined" 
            onPress={handleExit} 
            style={styles.exitButton}
          >
            Exit
          </Button>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
  },
  input: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 7,
    height: 50,
    width: "90%",
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'black', 
    marginTop: 20,
    borderRadius: 5,
    width: "90%",
    justifyContent: 'center',
  },
  newUserLink: {
    paddingRight: 10,
    width: "100%",
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 10,
  },
  exitButton: {
    marginTop: 20,
    borderColor: '#fff',
    width: "90%",
    borderRadius: 5,
  },
});
