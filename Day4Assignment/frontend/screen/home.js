import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SafeAreaWrapper from "../components/safeAreaView";

export default function HomeScreen({ navigation }) {
  const posts = [
    {
      id: 1,
      user: "Priya Mehta",
      time: "10:45 AM",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=60",
      description: "Just finished a cool UI design today! 🚀 Loving React Native.",
    },
    {
      id: 2,
      user: "Shreyas More",
      time: "09:20 AM",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAJEkJQ1WumU0hXNpXdgBt9NUKc0QDVIiaw&s",
      description: "Exploring animations with Reanimated — it’s so smooth!",
    },
    {
      id: 3,
      user: "Kajal Verma",
      time: "Yesterday",
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=60",
      description: "Finally deployed my full-stack project — feels awesome 🔥",
    },
  ];

  return (
    <SafeAreaWrapper>

      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-circle-outline" size={32} color="#333" />
        </TouchableOpacity>
      </View>

      
      <ScrollView showsVerticalScrollIndicator={false}>
        {posts.map((post) => (
          <FeedCard
            key={post.id}
            user={post.user}
            time={post.time}
            image={post.image}
            description={post.description}
          />
        ))}
      </ScrollView>
    </SafeAreaWrapper>
  );
}


function FeedCard({ user, time, image, description }) {
  return (
    <View style={styles.feedContainer}>
      <View style={styles.feedCard}>
        <View style={styles.feedHeader}>
          <Image source={{ uri: image }} style={styles.profileIcon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.feedUser}>{user}</Text>
            <Text style={styles.feedTime}>{time}</Text>
          </View>
        </View>
        <Text style={styles.feedDescription}>{description}</Text>
      </View>
    </View>
  );
}


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

  feedContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop:30
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
    width: 50,
    height: 50,
    borderRadius: 25,
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
    marginTop: 6,
    lineHeight: 20,
  },
});

