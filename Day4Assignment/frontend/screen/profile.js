import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SafeAreaWrapper from "../components/safeAreaView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../services/axiosUrl";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          Alert.alert("Error", "Token not found. Please log in again.");
          navigation.replace("LogIn");
          return;
        }
        
        const res = await axiosInstance.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
      } catch (error) {
        console.log("Profile fetch error:", error.message);
    
        Alert.alert("Error", "Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      console.log("Token removed, logging out");
      navigation.replace("LogIn");
    } catch (error) {
      console.log("Logout error:", error.message);
      Alert.alert("Error", "Failed to logout. Try again.");
    }
  };

  if (loading) {
    return (
      <View style={[styles.flex, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#304a67ff" />
      </View>
    );
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileCard
          ProfileName={user?.firstname || "Unknown User"}
          About="React Native Developer | Tech Enthusiast"
          Address="Pune, India"
          ProfileImg="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAJEkJQ1WumU0hXNpXdgBt9NUKc0QDVIiaw&s"
          ProfileBackImg="https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=800&q=60"
        />

        <ProfileComponent
          Title={user?.firstname || "Unknown User"}
          SubTitle="100 Followers"
          Time="12:00 PM"
          Description="Hi there! This is a representation of the code."
          Uri="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAJEkJQ1WumU0hXNpXdgBt9NUKc0QDVIiaw&s"
        />

        <ProfileComponent
          Title={user?.firstname || "Unknown User"}
          SubTitle="120 Followers"
          Time="02:30 PM"
          Description="Second post! This is another representation of the code."
          Uri="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAJEkJQ1WumU0hXNpXdgBt9NUKc0QDVIiaw&s"
        />
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaWrapper>
  );
}

function ProfileCard({ ProfileName, ProfileImg, About, Address, ProfileBackImg }) {
  return (
    <View style={styles.profileCard}>
      <Image source={{ uri: ProfileBackImg }} style={styles.backgroundImg} />
      <Image source={{ uri: ProfileImg }} style={styles.profileImg} />
      <View style={styles.cardContent}>
        <Text style={styles.profileName}>{ProfileName}</Text>
        <Text style={styles.about}>{About}</Text>
        <Text style={styles.address}>{Address}</Text>

        <View style={styles.experienceBox}>
          <Text style={styles.plus}>+</Text>
          <Text style={styles.experienceText}> Experience</Text>
        </View>
      </View>
    </View>
  );
}

function ProfileComponent({ Title, SubTitle, Time, Description, Uri }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: Uri }} style={styles.profileImage} />
          <View style={styles.textContainer}>
            <Text style={styles.Title}>{Title}</Text>
            <Text style={styles.subtitle}>{SubTitle}</Text>
          </View>
          {Time && <Text style={styles.time}>{Time}</Text>}
        </View>
        <Text style={styles.description}>{Description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  headerBar: { flexDirection: "row", alignItems: "center", marginBottom: 10, paddingHorizontal: 16, marginTop: 10 },
  backButton: { padding: 6, borderRadius: 20, backgroundColor: "#f2f2f2", marginRight: 10 },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  profileCard: { backgroundColor: "white", borderRadius: 10, marginHorizontal: 20, marginBottom: 20, overflow: "hidden" },
  backgroundImg: { width: "100%", height: 90 },
  profileImg: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: "white", position: "absolute", top: 50, left: 20 },
  cardContent: { paddingTop: 50, paddingHorizontal: 16, paddingBottom: 10 },
  profileName: { fontSize: 18, fontWeight: "800" },
  about: { fontSize: 14, color: "#444", marginTop: 4 },
  address: { fontSize: 12, color: "gray", marginTop: 6 },
  experienceBox: { marginTop: 10, borderWidth: 1, borderStyle: "dashed", borderColor: "gray", paddingVertical: 5, flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius: 6 },
  plus: { fontSize: 18, marginRight: 4, color: "gray" },
  experienceText: { color: "gray" },
  container: { alignItems: "center", paddingHorizontal: 20, marginBottom: 10 },
  card: { width: "100%", backgroundColor: "white", borderRadius: 12, padding: 16, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 1 },
  profileHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  textContainer: { flex: 1 },
  Title: { fontSize: 14, color: "#393838ff", fontWeight: "800" },
  subtitle: { fontSize: 14, color: "#777" },
  time: { fontSize: 12, color: "#999" },
  description: { fontSize: 15, color: "#444", lineHeight: 20 },
  logoutButton: { backgroundColor: "#e74c3c", padding: 12, marginHorizontal: 20, borderRadius: 8, alignItems: "center", marginTop: 20 },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
