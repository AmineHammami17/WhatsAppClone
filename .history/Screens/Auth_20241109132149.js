import React, { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, BackHandler } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function Authentification({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const refInput2 = useRef();

  const handleExit = () => {
    BackHandler.exitApp();
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

          <Button 
            mode="contained" 
            onPress={() => {
              if (email === "A" && password === "0") {
                alert('Login successful');
                navigation.navigate('Accueil');
              } else {
                alert('Login failed');
              }
            }}
            style={styles.button}
          >
            Sign In
          </Button>

          <TouchableOpacity 
            style={styles.newUserLink}
            onPress={() => navigation.navigate('NewUser')}
          >
            <Text style={{ color: '#fff' }}>Create new user</Text>
          </TouchableOpacity>

          {/* Add Exit Button */}
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
    backgroundColor: '#fff',
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
