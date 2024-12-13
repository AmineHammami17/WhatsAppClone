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
  ActivityIndicator,
} from "react-native";
import firebase from "../../Config";
import { Ionicons } from '@expo/vector-icons';

const database = firebase.database();
const ref_tableProfils = database.ref("Tabledeprofils");

export default function ListProfile({ route, navigation }) {
  const currentid = route.params.currentid;
  const [data, setData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = () => {
      ref_tableProfils.on("value", (snapshot) => {
        const profiles = [];
        let currentUserData = null;

        snapshot.forEach((unprofil) => {
          const profile = unprofil.val();
          profile.id = unprofil.key;
          if (profile.id === currentid) {
            currentUserData = profile;
          } else {
            profiles.push(profile);
          }
        });

        setCurrentUser(currentUserData);
        setData(profiles);
        setLoading(false);
      });
    };

    fetchProfiles();

    return () => {
      ref_tableProfils.off("value");
    };
  }, [currentid]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#008CBA" />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer} key={item.id}>
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
            <Ionicons name="call" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => navigation.navigate("Chat", { seconditem: item })}
          >
            <Ionicons name="chatbubbles" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  textstyle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 50,
    marginBottom: 20,
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: "95%",
    alignSelf: "center",
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
    color: "#000",
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
    backgroundColor: "#28A745",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  chatButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  listContent: {
    paddingBottom: 20,
  },
});
