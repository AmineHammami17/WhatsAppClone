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
        try {
          const profiles = [];
          let currentUserData = null;

          snapshot.forEach((unprofil) => {
            const profile = unprofil.val();
            if (profile.id === currentid) {
              currentUserData = profile;
            } else {
              profiles.push(profile);
            }
          });

          setCurrentUser(currentUserData);
          setData(profiles);
        } catch (error) {
          console.error("Error fetching profiles:", error);
        } finally {
          setLoading(false);
        }
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

  return (
    <ImageBackground
      source={require("../../assets/imgbleu.jpg")}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text style={styles.textstyle}>List Profile</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image
              source={
                item.imageUrl
                  ? { uri: item.imageUrl }
                  : require("../../assets/profil.png")
              }
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
                accessibilityLabel={`Call ${item.nom}`}
              >
                <Text style={styles.buttonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() =>
                  navigation.navigate("Chat", {
                    currentUser,
                    secondUser: item,
                  })
                }
                accessibilityLabel={`Chat with ${item.nom}`}
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
