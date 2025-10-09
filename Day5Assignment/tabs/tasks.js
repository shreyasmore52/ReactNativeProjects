import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Button,
} from "react-native";

export default function TaskScreen() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔁 Change this to: "normal" | "empty" | "error"
  const MODE = "normal";

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");


      await new Promise((resolve) => setTimeout(resolve, 1000));

   
      let mockData = [];

      if (MODE === "normal") {
      
        mockData = [
          { id: 1, name: "Finish UI layout", status: "pending", created_at: "2025-10-08T10:30:00Z" },
          { id: 2, name: "Integrate login flow", status: "completed", created_at: "2025-10-07T09:00:00Z" },
          { id: 3, name: "Polish loading states", status: "in-progress", created_at: "2025-10-06T13:45:00Z" },
          { id: 4, name: "Add JWT verification", status: "pending", created_at: "2025-10-05T16:00:00Z" },
          { id: 5, name: "Setup AsyncStorage for tokens", status: "completed", created_at: "2025-10-04T11:20:00Z" },
          { id: 6, name: "Connect React Native to API", status: "in-progress", created_at: "2025-10-03T10:15:00Z" },
          { id: 7, name: "Implement logout feature", status: "pending", created_at: "2025-10-02T14:30:00Z" },
          { id: 8, name: "Design dashboard screen", status: "completed", created_at: "2025-09-30T08:10:00Z" },
          { id: 9, name: "Fix navigation bug", status: "in-progress", created_at: "2025-09-28T18:40:00Z" },
          { id: 10, name: "Refactor AuthContext", status: "completed", created_at: "2025-09-27T09:55:00Z" },
        ];
      } else if (MODE === "error") {
        throw new Error("Simulated error: unable to fetch tasks!");
      } else if (MODE === "empty") {
       
        mockData = [];
      }

      setTasks(mockData);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.info}>Loading tasks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Retry" onPress={fetchTasks} />
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.info}>No tasks available</Text>
        <Button title="Reload" onPress={fetchTasks} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.taskCard,
              item.status === "completed"
                ? styles.completed
                : item.status === "in-progress"
                ? styles.inProgress
                : styles.pending,
            ]}
          >
            <Text style={styles.taskName}>{item.name}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Created: {new Date(item.created_at).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  taskCard: {
    padding: 16,
    borderRadius: 10,
    marginVertical: 6,
  },
  taskName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  completed: {
    backgroundColor: "#d4edda",
  },
  inProgress: {
    backgroundColor: "#fff3cd",
  },
  pending: {
    backgroundColor: "#f8d7da",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  error: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
});
