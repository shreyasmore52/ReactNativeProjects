import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import axios from "axios";
import SafeArea from "../services/SafeAreaContext";

// Backend URL
const API_URL = "http://localhost:3000/tasks";

export default function TaskScreen() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setTasks(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load tasks | Server is not connected");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!taskName.trim()) return alert("Enter task name");
    try {
      setLoading(true);
      await axios.post(API_URL, { title: taskName });
      setTaskName("");
      await fetchTasks();
    } catch (err) {
      setError("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const task = tasks.find((t) => t.id === id);
      await axios.put(`${API_URL}/${id}`, { ...task, completed: !task.completed });
      fetchTasks();
    } catch (err) {
      alert("Failed to update task");
    }
  };

  const renderTask = ({ item }) => (
    <TouchableOpacity
      style={[styles.taskCard, item.completed && styles.completedCard]}
      onPress={() => toggleComplete(item.id)}
    >
      <View style={styles.taskLeft}>
        <View style={[styles.checkbox, item.completed && styles.checkedBox]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.taskText, item.completed && styles.completedText]}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeArea >
      <View style={styles.container}>

      
      <Text style={styles.header}>📝 Todo List</Text>

     
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task"
          placeholderTextColor="#999"
          value={taskName}
          onChangeText={setTaskName}
        />
        <TouchableOpacity style={styles.button} onPress={addTask}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      
      {loading && <Text style={styles.info}>Loading...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      {tasks.length === 0 && !loading && !error && (
        <Text style={styles.info}>No tasks yet. Add your first task!</Text>
      )}

      
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={renderTask}
      />
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9cafc1ff",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4f46e5",
    textAlign: "center",
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  button: {
    marginLeft: 10,
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  completedCard: {
    backgroundColor: "#e0e7ff",
  },
  taskLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#4f46e5",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkedBox: {
    backgroundColor: "#4f46e5",
  },
  checkmark: {
    color: "#fff",
    fontWeight: "bold",
  },
  taskText: {
    fontSize: 16,
    color: "#333",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  info: {
    textAlign: "center",
    color: "#666",
    marginVertical: 15,
    fontSize: 16,
  },
  error: {
    textAlign: "center",
    color: "red",
    marginVertical: 15,
    fontSize: 16,
  },
});
