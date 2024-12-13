import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import firebase from "../../Config";

const database = firebase.database();
const ref_tableProfils = database.ref("Tabledeprofils");

export default function ListProfile({ navigation }) {
  const [data, setData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null); // Assume you get the current user's ID from your authentication context or state

  useEffect(() => {
    const fetchProfiles = () => {
      ref_tableProfils.on("value", (snapshot) => {
        const profiles = [];
        snapshot.forEach((unprofil) => {
          const profile = unprofil.val();
          profile.id = unprofil.key;
          if (profile.id !== currentUserId) { // Filter out the current user's profile
            profiles.push(profile);
          }
        });
        setData(profiles);
      });
    };

    fetchProfiles();

    return () => {
      ref_tableProfils.off();
    };
  }, [currentUserId]);

  return (
    <ImageBackground
      source={require("../../assets/imgbleu.jpg")}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text style={styles.textstyle}>List Profile</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image
              source={item.imageUrl ? { uri: item.imageUrl } : require("../../assets/profil.png")}
              style={styles.profileImage}
            />
            <View style={styles.detailsContainer}>
              <Text style={styles.nameText}>{item.nom}</Text>
              <Text style={styles.numberText}>{item.telephone}</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => alert(`Calling ${item.nom}...`)}
              >
                <Text style={styles.buttonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => navigation.navigate("Chat", { seconditem: item })}
              >
                <Text style={styles.buttonText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={{ width: "95%" }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  textstyle: {
    fontSize: 40,
    fontFamily: "serif",
    color: "white",
    fontWeight: "bold",
    paddingTop: 45,
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 8,
    padding: 15,
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  numberText: {
    fontSize: 14,
    color: "#555",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  callButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  chatButton: {
    backgroundColor: "#008CBA",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
