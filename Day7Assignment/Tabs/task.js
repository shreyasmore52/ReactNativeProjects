import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from "react-native";
import axios from "axios";
import SafeArea from "../services/SafeAreaContext";

const API_URL = "http://localhost:3000/tasks";

export default function TaskScreen() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");

 
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setTasks(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load tasks");
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
      const res = await axios.post(API_URL, { title: taskName });
   
      setTasks((prev) => [...prev, res.data]);
      setTaskName("");
    } catch (err) {
      setError("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

 
  const toggleComplete = async (id) => {
    try {
      const task = tasks.find((t) => t.id === id);
      const updatedTask = { ...task, completed: !task.completed };
      await axios.put(`${API_URL}/${id}`, updatedTask);

 
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
    } catch (err) {
      alert("Failed to update task");
    }
  };


  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
     
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  
  const openEditModal = (task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditModalVisible(true);
  };


  const saveEdit = async () => {
    if (!editTitle.trim()) return alert("Title cannot be empty");
    try {
      const updatedTask = { ...editTask, title: editTitle };
      await axios.put(`${API_URL}/${editTask.id}`, updatedTask);

      setTasks((prev) =>
        prev.map((t) => (t.id === editTask.id ? updatedTask : t))
      );

      setEditModalVisible(false);
      setEditTask(null);
    } catch (err) {
      alert("Failed to update task");
    }
  };


  const renderTask = ({ item }) => (
    <View style={[styles.taskCard, item.completed && styles.completedCard]}>
      <TouchableOpacity
        style={styles.taskLeft}
        onPress={() => toggleComplete(item.id)}
      >
        <View style={[styles.checkbox, item.completed && styles.checkedBox]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.taskText, item.completed && styles.completedText]}>
          {item.title}
        </Text>
      </TouchableOpacity>

      <View style={styles.taskRight}>
       
        <TouchableOpacity
          onPress={() => openEditModal(item)}
          style={styles.iconButton}
        >
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>

  
        <TouchableOpacity
          onPress={() => deleteTask(item.id)}
          style={styles.iconButton}
        >
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeArea style={styles.container}>
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


      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Edit Task</Text>
            <TextInput
              style={{height:50,borderRadius:9,backgroundColor: "#fff",fontSize: 16}}
              value={editTitle}
              onChangeText={setEditTitle}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeArea>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 15,
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
    justifyContent: "space-between",
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
  taskRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 10,
  },
  editIcon: {
    fontSize: 20,
  },
  deleteText: {
    fontSize: 20,
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
    color: "#555",
    marginVertical: 15,
    fontSize: 16,
  },
  error: {
    textAlign: "center",
    color: "red",
    marginVertical: 15,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#a09e9eff",
    padding: 20,
    borderRadius: 12,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cancelText: {
    color: "#4f46e5",
    fontWeight: "bold",
  },
});
