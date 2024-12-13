import React, { useState, useEffect } from "react";
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
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://<your-supabase-url>.supabase.co";
const supabaseAnonKey = "<your-anon-key>";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function MyProfile(props) {
  const currentid = props.route.params.currentid;
  const [nom, setNom] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [telephone, setTelephone] = useState("");
  const [uriImage, setUriImage] = useState(null);
  const [isUploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentid)
          .single();

        if (error) throw error;

        if (data) {
          setNom(data.nom || "");
          setPseudo(data.pseudo || "");
          setTelephone(data.telephone || "");
          setUriImage(data.image_url || null);
        }
      } catch (error) {
        alert("Error fetching profile: " + error.message);
      }
    };

    fetchProfile();
  }, [currentid]);

  const handleProfileImageChange = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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
        const imageUri = result.assets ? result.assets[0].uri : result.uri;
        if (imageUri) {
          setUriImage(imageUri);
          await uploadImage(imageUri);
        }
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      alert("Failed to select an image. Please try again.");
    }
  };

  const uploadImage = async (uri) => {
    try {
      setUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();

      const fileName = `profile_${currentid}_${new Date().getTime()}.jpg`;
      const { data, error } = await supabase.storage
        .from("profile-images")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("profile-images")
        .getPublicUrl(fileName);

      setUriImage(publicUrlData.publicUrl);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error.message);
      alert("Failed to upload the image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!nom || !pseudo || !telephone || !uriImage) {
      alert("Please fill all fields and upload a profile image.");
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: currentid,
          nom,
          pseudo,
          telephone,
          image_url: uriImage,
        });

      if (error) throw error;

      alert("Profile updated successfully!");
    } catch (error) {
      alert("Error updating profile: " + error.message);
    }
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
            uriImage ? { uri: uriImage } : require("../../assets/profil.png")
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
