import React, { useState } from "react";
import * as FileSystem from "expo-file-system";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import firebase  from "../../Config";

const database = firebase.database();
const storage = firebase.storage();
const ref_tableProfils = database.ref("Tabledeprofils");

export default function MyProfile() {
  const [nom, setNom] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [telephone, setTelephone] = useState("");
  const [uriImage, setUriImage] = useState(null);
  const [isUploading, setUploading] = useState(false);

  const handleProfileImageChange = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access the gallery is required!");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) { 
      console.log("ImagePicker Result:", result);
      setUriImage(result.uri); 
      await uploadImage(result.uri); 
    } else {
      console.log("Image selection was canceled.");
    }
  };
  
  const uploadImage = async (uri) => {
    try {
      setUploading(true);
  
      // Ensure the URI starts with "file://"
      if (!uri.startsWith("file://")) {
        throw new Error("Invalid image URI");
      }
  
      // Read the file using expo-file-system
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error("File does not exist at the given URI");
      }
  
      // Convert file to a blob
      const response = await fetch(uri);
      const blob = await response.blob();
  
      // Prepare Firebase Storage reference
      const fileName = `profile_${new Date().getTime()}.jpg`;
      const storageRef = storage.ref().child(`profileImages/${fileName}`);
  
      // Upload the blob to Firebase Storage
      await storageRef.put(blob);
  
      // Get and set the download URL
      const downloadURL = await storageRef.getDownloadURL();
      setUriImage(downloadURL);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error.message);
      alert("Failed to upload the image. Please try again.");
    } finally {
      setUploading(false);
    }
  };
    

  const handleSave = () => {
    if (!nom || !pseudo || !telephone || !uriImage) {
      alert("Please fill all fields and upload a profile image.");
      return;
    }

    const key = ref_tableProfils.push().key;
    const ref_unprofil = ref_tableProfils.child("unprofil_" + key);
    ref_unprofil
      .set({
        nom,
        pseudo,
        telephone,
        imageUrl: uriImage, 
      })
      .then(() => alert("Profile saved successfully!"))
      .catch((error) => alert("Error saving profile: " + error.message));
  };

  return (
    <ImageBackground
      source={require("../../assets/imgbleu.jpg")}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text style={styles.textstyle}>My Account</Text>

      <TouchableHighlight
        onPress={handleProfileImageChange}
        underlayColor="#ddd"
        style={styles.profileImageWrapper}
      >
        <Image
          source={
            uriImage
              ? { uri: uriImage }
              : require("../../assets/profil.png")
          }
          style={styles.profileImage}
        />
      </TouchableHighlight>

      <TextInput
        onChangeText={setNom}
        value={nom}
        textAlign="center"
        placeholderTextColor="#fff"
        placeholder="Nom"
        keyboardType="default"
        style={styles.textinputstyle}
      />
      <TextInput
        onChangeText={setPseudo}
        value={pseudo}
        textAlign="center"
        placeholderTextColor="#fff"
        placeholder="Pseudo"
        keyboardType="default"
        style={styles.textinputstyle}
      />
      <TextInput
        onChangeText={setTelephone}
        value={telephone}
        placeholderTextColor="#fff"
        textAlign="center"
        placeholder="Numero"
        keyboardType="phone-pad"
        style={styles.textinputstyle}
      />
      <TouchableHighlight
        onPress={handleSave}
        activeOpacity={0.8}
        underlayColor="#0080ff"
        style={styles.saveButton}
        disabled={isUploading}
      >
        <Text style={styles.saveButtonText}>
          {isUploading ? "Uploading..." : "Save"}
        </Text>
      </TouchableHighlight>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  textstyle: {
    fontSize: 40,
    fontFamily: "serif",
    color: "#07f",
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileImageWrapper: {
    marginBottom: 20,
    borderRadius: 100,
    overflow: "hidden",
  },
  profileImage: {
    height: 200,
    width: 200,
  },
  textinputstyle: {
    fontWeight: "bold",
    backgroundColor: "#0004",
    fontSize: 20,
    color: "#fff",
    width: "75%",
    height: 50,
    borderRadius: 10,
    margin: 5,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: "#08f",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
