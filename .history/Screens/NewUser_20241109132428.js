import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useRef, useState } from 'react';

export default function NewUser({ navigation }) {
  const [email, setEmail] = useState("A");
  const [password, setPassword] = useState("0");
  const refInput2 = useRef();

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
          <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#fff', marginTop: 15 }}>
            Authentification
          </Text>

          <TextInput
            onChangeText={text => setEmail(text)}
            onSubmitEditing={() => refInput2.current.focus()}
            blurOnSubmit={false}
            style={styles.input}
            placeholder='email'
            keyboardType='email-address'
          />

          <TextInput
            ref={refInput2}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            placeholder='password'
            secureTextEntry={true}
            keyboardType='default'
          />

          <Button
            mode="contained"
            onPress={() => {
              if (email === "A" && password === "0") {
                alert('Login successful');
              } else {
                alert('Login failed');
              }
            }}
            style={styles.registerButton}
          >
            Register
          </Button>

          {/* Back Button */}
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()} // Navigate back to the previous screen
            style={styles.backButton}
          >
            Back
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
  input: {
    fontFamily: 'serif',
    fontSize: 16,
    marginTop: 15,
    marginBottom: 7,
    height: 50,
    width: "90%",
    borderRadius: 5,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 20,
    width: "90%",
  },
  backButton: {
    marginTop: 15,
    borderColor: '#fff',
    width: "90%",
    borderRadius: 5,
  },
});