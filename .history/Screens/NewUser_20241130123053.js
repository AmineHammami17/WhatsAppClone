import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useRef, useState } from 'react';
import firebase from '../Config';

export default function NewUser({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const refInput2 = useRef();

  const registerUser = async () => {
    if (email === "" || password === "") {
      alert("Please enter both email and password.");
      return;
    }

    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password).then(()=>{
        const currentid = auth.currentUser.uid;
        props.navigation.replace("Acceuil",{currentid:currentid});
      });
      alert("User registered successfully!");
      navigation.goBack(); 
    } catch (error) {
      console.error(error);
      alert(`Registration failed: ${error.message}`);
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
          <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#fff', marginTop: 15 }}>
            Register New User
          </Text>

          <TextInput
            onChangeText={text => setEmail(text)}
            onSubmitEditing={() => refInput2.current.focus()}
            blurOnSubmit={false}
            style={styles.input}
            placeholder='Email'
            keyboardType='email-address'
          />

          <TextInput
            ref={refInput2}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            placeholder='Password'
            secureTextEntry={true}
            keyboardType='default'
          />

          {}
          <Button
            mode="contained"
            onPress={registerUser}
            style={styles.registerButton}
          >
            Register
          </Button>

          {/* Back Button */}
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
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
