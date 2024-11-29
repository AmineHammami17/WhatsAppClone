import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useRef, useState } from 'react';
export default function NewUser() {
 const [email, setEmail] = useState("A");
 const [password, setPassword] = useState("0");
 const refinput2 = useRef();
  return (
    <View style={{ flex: 1 }}>
      <StatusBar  backgroundColor='#ffff80'  />
      <ImageBackground 
        source={require('../assets/flower.jpg')} 
        style={styles.container}
      >
        
        <View 
          style={{
            height: 300,
            width: "85%",
            backgroundColor: '#0005',
            borderRadius: 20,
            justifyContent: 'flex-start', 
            alignItems: 'center',
            padding: 20
          }}
        >
          <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#fff', marginTop: 15 }}>
            Authentification
          </Text>
          <TextInput 
          onChangeText={text => setEmail(text)}
          onsubmitEditing={() => refinput2.current.focus()} 
          blurOnSubmit={false}
          style={styles.input}
          placeholder='email'
          keyboardType='email-address'>
          </TextInput>
          <TextInput 
          ref={refinput2}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          placeholder='password'
          secureTextEntry={true}
          keyboardType='default'>
            
            </TextInput>      
              <TextInput 
          ref={refinput2}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          placeholder='password'
          secureTextEntry={true}
          keyboardType='default'>
            
            </TextInput>
            <Button 
          onPress={() => {
            if(email === "A" && password === "0"){
              alert('Login successful');
            } else {
              alert('Login failed');
            }
          }}
          title="Register" style={{  backgroundColor: '#fff',  borderRadius: 5 }}>Register</Button>
                    <Button 
          
          title="Back" style={{  backgroundColor: '#fff',  borderRadius: 5 }}>Back</Button>
          <TouchableOpacity style={{  paddingRight: 10, width: "100%", alignItems: 'flex-end', marginTop: 10, marginBottom: 10}}>
          </TouchableOpacity>
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
    fontSize:16,
    marginTop:15,
    marginBottom:7,
    height: 50,
   width:"90%",
    borderRadius: 5,
    textAlign: 'center',
  },
});
