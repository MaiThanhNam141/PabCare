import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Text, StyleSheet, View, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard, Alert, Image, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AIImage } from '../../data/Link';
import { getRoutineFirebase, updateRoutineFirebase } from '../../feature/firebase/handleFirestore';

let todoId = 0;

const TodoRoutine = (props) => {
  const [newTodo, setNewTodo] = useState("");
  const [routine, setRoutine] = useState(null);
  const { date, user } = props;
  const [loading, setLoading] = useState(true);

  const vietsubName = useMemo(() => (date === 'Tomorrow' ? 'Ngày mai' : 'Hôm nay'), [date]);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const routineRef = getRoutineFirebase(date);
        const snapshot = await routineRef.get();
        setRoutine(snapshot.data());
      } catch (error) {
        console.error("TodoRoutine: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutine();
  }, [date]);

  const toggleTodoCompleted = useCallback(index => {
    if (routine && routine.todos) {
      const updatedTodos = routine.todos.map((todo, i) => i === index ? { ...todo, completed: !todo.completed } : todo);
      setRoutine(prevRoutine => ({ ...prevRoutine, todos: updatedTodos }));
      updateRoutineFirebase(updatedTodos, date);
    }
  }, [routine, date]);

  const addTodo = useCallback(() => {
    if (!newTodo.trim()) {
      Alert.alert("Vui lòng nhập tên công việc");
      return;
    }
    if (!routine) {
      setRoutine({ todos: [] });
    } else if (!Array.isArray(routine.todos)) {
      routine.todos = [];
    }
  
    if (!routine.todos.some(todo => todo.title === newTodo)) {
      try {
        const newID = todoId++;
        const updatedTodos = [...routine.todos, { id: newID, title: newTodo, completed: false }];
        setNewTodo("");
        Keyboard.dismiss();
        updateRoutineFirebase(updatedTodos , date);
        setRoutine(prevRoutine => ({ ...prevRoutine, todos: updatedTodos }));
      } catch (error) {
        Alert.alert("Đã có lỗi xảy ra");
        console.error("AddTodoRoutine: ", error);
      }
    } else {
      Alert.alert("Công việc này đã tồn tại");
    }
  }, [newTodo, routine, date]);  
  
  

  const deleteTodo = useCallback(index => {
    if (routine && routine.todos) {
      const updatedTodos = routine.todos.filter((_, i) => i !== index);
      setRoutine(prevRoutine => ({ ...prevRoutine, todos: updatedTodos }));
      updateRoutineFirebase(updatedTodos, date);
    }
  }, [routine, date]);

  const renderTodo = useCallback(({ item, index }) => (
    <View style={styles.todoContainer}>
      <TouchableOpacity onPress={() => toggleTodoCompleted(index)}>
        <MaterialIcons
          name={item.completed ? 'check-box' : 'check-box-outline-blank'}
          size={28}
          color={'#87bc9d'}
          style={{ width: 32 }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => toggleTodoCompleted(index)} style={{ flex: 5 }}>
        <Text style={[styles.todo, { color: item.completed ? "#999" : "#000", textDecorationLine: item.completed ? 'line-through' : 'none' }]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      {item.completed && (
        <TouchableOpacity onPress={() => deleteTodo(index)} style={{ width: 27, height: 27 }}>
          <View style={styles.deleteButton}>
            <MaterialIcons name='delete' size={28} color={'#87bc9d'} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  ), [toggleTodoCompleted, deleteTodo]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator color={'#87bc9d'} size={"large"} />
      </View>
    );
  }

  const renderContent = () => {
    if (!routine?.todos?.length) {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.helloUser}>Xin chào, {user}</Text>
            <Image source={AIImage} style={{ width: 55, height: 55 }} />
          </View>
          <Text style={styles.reminder}>
            {date === 'Today' ? 'Bạn muốn khởi động bằng việc gì ngày hôm nay?' : 'Lên kế hoạch cho ngày mai vào hôm nay là một ý tưởng sáng suốt đó!'}
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={routine.todos}
        renderItem={renderTodo}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerTitle}>
          <View style={styles.divider} />
          <Text style={styles.title}>{vietsubName}</Text>
          <View style={styles.divider} />
        </View>

        <View style={[styles.section, { flex: 4, marginVertical: 10, marginRight: 10 }]}>
          {renderContent()}
        </View>

        <View style={[styles.section, styles.footer]}>
          <TextInput
            style={styles.input}
            onChangeText={setNewTodo}
            value={newTodo}
            placeholder='Điều gì đó bạn muốn thực hiện...'
            placeholderTextColor={'#ffffff'}
          />
          <TouchableOpacity style={styles.addTodo} onPress={addTodo}>
            <MaterialIcons name='reply' size={35} color={'#87bc9d'} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  section: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: 'center'
  },
  headerTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    paddingTop: 5,
    marginTop: 25
  },
  divider: {
    backgroundColor: '#87bc9d',
    height: 3,
    flex: 1,
    alignSelf: "center",
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: '#fafaf7',
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 35,
    backgroundColor: '#87bc9d',
  },
  footer: {
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center'
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 60,
    paddingHorizontal: 8,
    color: 'white',
    paddingLeft: 25,
    marginLeft: -10,
    backgroundColor: '#87bc9d'
  },
  addTodo: {
    borderRadius: 4,
    padding: 16,
    marginRight: -15
  },
  todoContainer: {
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  todo: {
    color: "#000",
    fontWeight: "700",
    fontSize: 18,
    marginLeft: 10
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 27,
    height: 27,
    borderRadius: 100
  },
  helloUser: {
    color: '#2b7449',
    fontSize: 27,
    fontWeight: 'bold',
    marginRight: 5
  },
  reminder: {
    color: '#737373',
    fontSize: 10,
    fontWeight: '400',
  }
});

export default TodoRoutine;
