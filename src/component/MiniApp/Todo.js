import React, { useState, useEffect } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, ToastAndroid } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TodoList from './TodoList.js';
import AddListModal from './AddListModal.js';
import useFirestoreList from '../../feature/firebase/useFirestoreList.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Todo = () => {
  const [addTodoVisible, setAddTodoVisible] = useState(false);
  const [lists, setLists] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false)
  const { addList, updateList, getLists, deleteList } = useFirestoreList()

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData)
          setUser(user.displayName)
          // getListsFromFirestore();  
        }
      } catch (error) {
        console.error("Error initializing Firestore in Todo:", error);
      }
    };

    initializeFirebase();
  }, []);

  useEffect(()=>{
    getListsFromFirestore()
  }, [reload])

  const getListsFromFirestore = async () => {
    try {
      const lists = await getLists();
      setLists(lists);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lists in Todo:", error);
    }
  };

  const toggleAddTodoModal = () => {
    setAddTodoVisible(!addTodoVisible);
  };

  const renderList = ({ item }) => {
    return (
      <TodoList list={item} updateList={updateListFireStore} deleteList={handleDeleteList} />
    );
  };

  const addListFireStore = async (list) => {
    try {
      setLists([...lists, { ...list, id: lists.length + 1, todos: [] }]);
      setReload(!reload)
      await addList({
        name: list.name,
        color: list.color,
        todos: []
      });
    } catch (error) {
      console.error("Error adding list Todo:", error);
      ToastAndroid.show("Thêm todo thất bại", ToastAndroid.SHORT)
    }
  };
  const handleDeleteList = async (listId) => {
    try {
      setReload(!reload)
      setLists(prevLists => prevLists.filter(item => item.id !== listId));
      await deleteList(listId);
    } catch (error) {
      console.error("Error deleting list Todo.js:", error);
    }
  };

  const updateListFireStore = async (list) => {
    try {
      // setReload(!reload)
      setLists(lists.map(item => (item.id === list.id ? list : item)));
      await updateList(list);
    } catch (error) {
      console.error("Error updating list:", error);
      ToastAndroid.show("Cập nhật todo thất bại", ToastAndroid.SHORT)
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={'#24A6D9'}></ActivityIndicator>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal animationType='slide' visible={addTodoVisible} onRequestClose={toggleAddTodoModal}>
        <AddListModal closeModal={toggleAddTodoModal} addList={addListFireStore} />
      </Modal>
      <View>
        <Text>User: {user ? user : 'Guest'}</Text>
      </View>
      <View style={{ flexDirection: 'row'}}>
        <View style={styles.divider} />
          <Text style={styles.title}>
            Todo<Text style={{ fontWeight: "300", color: '#24A6D9' }}> Lists</Text>
          </Text>
        <View style={styles.divider} />
      </View>
      <View style={{ marginVertical: 38 }}>
        <TouchableOpacity style={styles.addList} onPress={toggleAddTodoModal}>
          <MaterialIcons name="add" size={16} color={'#24A6D9'} />
        </TouchableOpacity>
        <Text style={styles.add}>Add List</Text>
      </View>
      <View style={{ height: 500, padding: 5 }}>
        <FlatList
          data={lists}
          keyExtractor={item => item.id.toString()}
          horizontal={false}
          numColumns={2}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={renderList}
          keyboardShouldPersistTaps="always"
        />
      </View>
    </View>
  );
};

export default Todo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    backgroundColor: '#A7CBD9',
    height: 1,
    flex: 1,
    alignSelf: "center"
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: '#203436',
    paddingHorizontal: 45
  },
  addList: {
    borderWidth: 2,
    borderColor: '#A7CBD9',
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  add: {
    color: '#24A6D9',
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8
  }
});
