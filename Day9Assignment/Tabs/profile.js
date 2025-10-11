import { useEffect, useState } from "react";
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, 
  ActivityIndicator, Alert, Modal, TextInput, Platform,
  Linking
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import SafeAreaWrapper from "../components/safeAreaView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosUrl from "../apiServices/axiosUrlApi";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [about, setAbout] = useState("");
  const [address, setAddress] = useState("");
  const [profileImg, setProfileImg] = useState(String | null);
  const [backgroundImg, setBackgroundImg] = useState(null);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          Alert.alert("Error", "Token not found. Please log in again.");
          navigation.replace("LogIn");
          return;
        }

        const res = await axiosUrl.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.user;
        setUser(data);
        setAbout(data?.about || "");
        setAddress(data?.address || "");
        const imgUrl = "http://localhost:3000";
        setProfileImg(data?.profileimg ? `${imgUrl}${data.profileimg}` : null);
        setBackgroundImg(data?.profilebackimg ? `${imgUrl}${data.profilebackimg}` : null);

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
    await AsyncStorage.removeItem("userToken");
    navigation.replace("LogIn");
  };

const pickImage = async (type) => {
  try {
    if (Platform.OS !== "web") {
      if (status?.status !== "granted") {
        const permissionResponse = await requestPermission();
        if (permissionResponse.status !== "granted") {
          Alert.alert(
            "Permission Required",
            "You need to grant photo library permission to select an image.",
            [
              { text: "Cancel" },
              {
                text: "Open Settings",
                onPress: () => {
                  Platform.OS === "ios"
                    ? Linking.openURL("app-settings:")
                    : Linking.openSettings();
                },
              },
            ]
          );
          return;
        }
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    const { uri} = asset;

    if (!uri) {
      Alert.alert("Error on 398line", "Image picking failed. Try again.");
      return;
    }

    const fileType = asset.uri.split(".").pop().split("?")[0]; 

    const formData = new FormData();
    formData.append("image", {
      uri: asset.uri,
      type: `image/${fileType}`,
      name: `photo.${fileType}`,
    });

  
    const token = await AsyncStorage.getItem("userToken");
    const endpoint = type === "profile" ? "/upload/profile" : "/upload/background";

    const res = await axiosUrl.post(
      endpoint,
      formData,
      
      { headers: { 
        Authorization: `Bearer ${token}`, 
        "Content-Type": "multipart/form-data",  
      }, 
    });


    if (type === "profile") setProfileImg(res.data.profile.profileimg);
    else setBackgroundImg(res.data.profile.profilebackimg);

    Alert.alert("Success", `${type === "profile" ? "Profile" : "Background"} image uploaded!`);
  } catch (err) {
    console.error("pickImage error ->", err);
    Alert.alert("Error", "Image upload failed. Try again.");
  }
};

  const handleSaveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const res = await axiosUrl.post(
        "/profile/add",
        { about, address, profileimg: profileImg, profilebackimg: backgroundImg },
        { headers: { Authorization: `Bearer ${token}`} }
      );

      const updatedProfile = res.data.profile;

      setUser(prev => ({
        ...prev,
        firstname: prev.firstname || updatedProfile.firstname,
        lastname: prev.lastname || updatedProfile.lastname,
        about: updatedProfile.about,
        address: updatedProfile.address,
        profileimg: updatedProfile.profileimg,
        profilebackimg: updatedProfile.profilebackimg,
      }));

      setModalVisible(false);
      Alert.alert("Success", "Profile saved successfully!");
    } catch (error) {
      console.log("Save profile error:", error.message);
      Alert.alert("Error", "Failed to save profile.");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#304a67ff" />
      </View>
    );
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileCard
          ProfileName={user?.firstname || "Unknown User"}
          About={about || "Add your bio"}
          Address={address || "Add your address"}
          ProfileImg={profileImg}
          ProfileBackImg={backgroundImg}
          onEditPress={() => setModalVisible(true)}
        />
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>Edit Profile</Text>

            <Text>About</Text>
            <TextInput
              style={styles.modalInput}
              value={about}
              onChangeText={setAbout}
              placeholder="Write something about yourself"
            />
            <Text>Address</Text>
            <TextInput
              style={styles.modalInput}
              value={address}
              onChangeText={setAddress}
              placeholder="Your address"
            />

            <Text>Profile Image</Text>
            <TouchableOpacity style={styles.pickBtn} onPress={() => pickImage("profile")}>
                <Text style={styles.pickBtnText}>Pick Profile Image</Text>
                {profileImg ? (<Image source={{ uri: profileImg }} style={styles.modalImage}/>) : (
                  <Ionicons name="person-circle-outline" size={30} color={'#68965eff'} />
                ) }
                
            </TouchableOpacity>

            <Text style={{marginTop:20}}>Background Image</Text>
            <TouchableOpacity style={styles.pickBtn} onPress={() => pickImage("background")}>
                <Text style={styles.pickBtnText}>Pick Background Image</Text>
                
                  { backgroundImg ? (<Image source={{ uri: backgroundImg }} style={styles.modalImage} />) : (
                  <Ionicons name="image-outline" size={30} color={'#68965eff'}  />
                ) }
            </TouchableOpacity>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#46ad2fff" }]} onPress={handleSaveProfile}>
                <Text style={styles.modalButtonText}>{about || address ? "Update Profile" : "Add Profile"}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#af0909ff" }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaWrapper>
  );
}

function ProfileCard({ ProfileName, ProfileImg, About, Address, ProfileBackImg, onEditPress }) {
  return (
    <View style={styles.profileCard}>
      <Image source={{ uri: ProfileBackImg }} style={styles.backgroundImg} />
      <Image source={{ uri: ProfileImg }} style={styles.profileImg} />
      <View style={styles.cardContent}>
        <Text style={styles.profileName}>{ProfileName}</Text>
        <Text style={styles.about}>{About}</Text>
        <Text style={styles.address}>{Address}</Text>

        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Text style={{ color: "#fff" }}>{About || Address ? "Update Profile" : "Add Profile"}</Text>
        </TouchableOpacity>
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
  editButton: { backgroundColor: "#304a67ff", padding: 8, marginTop: 10, borderRadius: 6, alignItems: "center" },
  logoutButton: { backgroundColor: "#e74c3c", padding: 12, marginHorizontal: 20, borderRadius: 8, alignItems: "center", marginTop: 20 },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContainer: { width: "90%", padding: 20, backgroundColor: "#fff", borderRadius: 10 },
  modalInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10, marginBottom: 15 },
  modalImage: { width: 100, height: 100, marginBottom: 10, borderRadius: 8, alignSelf: "center" },
  modalButtonRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 15,
},
modalButton: {
  flex: 1,
  padding: 12,
  borderRadius: 8,
  alignItems: "center",
  marginHorizontal: 5,
},
modalButtonText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
},  
pickBtn: {
    borderWidth: 1.5,            
    borderColor: "#46AD2F",   
    borderRadius: 10,            
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  pickBtnText: {
    color: "#46AD2F",            
    fontWeight: "600",
    fontSize: 16,
  },
});
