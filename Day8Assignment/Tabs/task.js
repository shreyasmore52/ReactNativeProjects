import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import SafeArea from "../services/SafeAreaContext";

const API_URL = "http://localhost:3000/tasks";

export default function TaskScreen() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        params: { status, search, page, limit: 5 },
      });
      setTasks(res.data.tasks);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [status, search, page]);

  const addTask = async () => {
    if (!taskName.trim()) return alert("Please enter a task name");
    await axios.post(API_URL, { title: taskName });
    setTaskName("");
    fetchTasks();
  };

  const toggleTask = async (id, completed) => {
    await axios.put(`${API_URL}/${id}`, { completed: !completed });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => toggleTask(item.id, item.completed)}
      >
        <Text style={[styles.taskText, item.completed && styles.completedTask]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Text style={styles.delete}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeArea>
      <Text style={styles.header}>📋 Task Manager</Text>

      {/* Add Task */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter new task"
          placeholderTextColor="#aaa"
          value={taskName}
          onChangeText={setTaskName}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Filter + Search */}
      <View style={styles.filterContainer}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={status}
            onValueChange={(value) => setStatus(value)}
            style={{ color: "#1e293b" }}
            mode="dropdown"
          >
            <Picker.Item label="All" value="all" />
            <Picker.Item label="Pending" value="pending" />
            <Picker.Item label="Completed" value="completed" />
          </Picker>
        </View>

        <TextInput
          style={styles.search}
          placeholder="🔍 Search tasks..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Task List */}
      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTask}
          ListEmptyComponent={<Text style={styles.info}>No tasks found</Text>}
          contentContainerStyle={{ paddingBottom: 60 }}
        />
      )}

      {/* Pagination */}
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          <Text style={[styles.pageBtn, page === 1 && styles.disabled]}>⬅ Prev</Text>
        </TouchableOpacity>

        <Text style={styles.pageNumber}>
          Page {page} / {Math.ceil(total / 5) || 1}
        </Text>

        <TouchableOpacity
          onPress={() => setPage((p) => (p * 5 < total ? p + 1 : p))}
          disabled={page * 5 >= total}
        >
          <Text style={[styles.pageBtn, page * 5 >= total && styles.disabled]}>
            Next ➡
          </Text>
        </TouchableOpacity>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    borderRadius: 10,
    marginLeft: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 15,
  },
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginRight: 20,
    justifyContent: "center",
    height:50 
  },
  search: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  taskText: {
    fontSize: 17,
    color: "#1e293b",
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "#94a3b8",
  },
  delete: {
    fontSize: 18,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 10,
  },
  pageBtn: {
    fontSize: 16,
    color: "#4f46e5",
  },
  disabled: {
    opacity: 0.4,
  },
  pageNumber: {
    fontWeight: "600",
    color: "#1e293b",
  },
  info: {
    textAlign: "center",
    color: "#64748b",
    marginTop: 25,
    fontSize: 16,
  },
});
