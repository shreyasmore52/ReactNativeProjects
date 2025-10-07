import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import SafeAreaWrapper from "../components/safeAreaView";

export default function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Aarav Mehta",
      time: "10:45 AM",
      //image:
       // "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=60",
      description: "Just finished a cool UI design today! 🚀 Loving React Native.",
      profile:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=60",
    },
  ]);

  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setNewPostImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    if (!newPostText.trim() && !newPostImage) return;
    const newPost = {
      id: Date.now(),
      user: "You",
      time: "Now",
      image: newPostImage,
      description: newPostText,
      profile:
        "https://cdn-icons-png.flaticon.com/512/147/147142.png",
    };
    setPosts([newPost, ...posts]);
    setNewPostText("");
    setNewPostImage(null);
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-circle-outline" size={32} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ✅ Create Post Section */}
        <View style={styles.createPost}>
          <View style={styles.createHeader}>
            <Ionicons name="person-circle" size={45} color="#777" />
            <TextInput
              style={styles.input}
              placeholder="What's on your mind?"
              value={newPostText}
              onChangeText={setNewPostText}
              multiline
            />
          </View>

          {newPostImage && (
            <Image source={{ uri: newPostImage }} style={styles.previewImage} />
          )}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
              <Ionicons name="image-outline" size={22} color="#333" />
              <Text style={styles.actionText}>Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.postButton} onPress={handlePost}>
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ✅ Feed Posts */}
        {posts.map((post) => (
          <FeedCard
            key={post.id}
            user={post.user}
            time={post.time}
            image={post.image}
            description={post.description}
            imagep={post.profile}
          />
        ))}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

/* Feed Card */
function FeedCard({ user, time, image, description, imagep }) {
  return (
    <View style={styles.feedContainer}>
      <View style={styles.feedCard}>
        <View style={styles.feedHeader}>
          <Image source={{ uri: imagep }} style={styles.profileIcon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.feedUser}>{user}</Text>
            <Text style={styles.feedTime}>{time}</Text>
          </View>
        </View>
        <Text style={styles.feedDescription}>{description}</Text>
        {image && <Image source={{ uri: image }} style={styles.feedImage} />}
      </View>
    </View>
  );
}

/* Styles */
const styles = StyleSheet.create({
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  /* Create Post */
  createPost: {
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  createHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#222",
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginTop: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 6,
    color: "#333",
  },
  postButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  postButtonText: {
    color: "white",
    fontWeight: "600",
  },

  /* Feed */
  feedContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  feedCard: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  feedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  profileIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  feedUser: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  feedTime: {
    fontSize: 12,
    color: "#999",
  },
  feedDescription: {
    fontSize: 15,
    color: "#444",
    marginBottom: 10,
  },
  feedImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
  },
});
