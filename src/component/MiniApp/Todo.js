import React, { useState, useEffect } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, ToastAndroid } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TodoList from './TodoList.js';
import AddListModal from './AddListModal.js';
import useFirestoreList from '../../feature/firebase/useFirestoreList.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '@react-native-firebase/firestore';
import LinearGradient from "react-native-linear-gradient";

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
    if (item.addNew) {
      return (
        <TouchableOpacity style={styles.addList} onPress={toggleAddTodoModal}>
          <MaterialIcons name="add" size={32} color={'#2b7449'} />
        </TouchableOpacity>
      );
    }
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
        routine: list.routine,
        initdate: firebase.firestore.FieldValue.serverTimestamp(),
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
    <LinearGradient colors={['#FCFCFC', '#3A915E']} style={styles.container}>
      <Modal animationType='slide' visible={addTodoVisible} onRequestClose={toggleAddTodoModal}>
        <AddListModal closeModal={toggleAddTodoModal} addList={addListFireStore} />
      </Modal>
      <View style={{ flexDirection: 'row'}}>
        <View style={[styles.divider, {marginLeft:15}]} />
          <Text style={styles.title}>User: {user}</Text>
        <View style={[styles.divider, {marginRight:15}]} />
      </View>
      <Text style={styles.subTitle}>Danh sách</Text>
      <View style={{ height: 500, padding: 5 }}>
        <FlatList
          data={[...lists, { id: 'add', addNew: true }]}
          keyExtractor={item => item.id.toString()}
          horizontal={false}
          numColumns={2}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={renderList}
          keyboardShouldPersistTaps="always"
        />
      </View>
    </LinearGradient>
  );
};

export default Todo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
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
    paddingVertical:10,
    borderRadius:35,
    backgroundColor:'#87bc9d',
  },
  subTitle:{
    fontWeight:'bold',
    color:'black',
    fontSize:22,
    alignSelf:'flex-start',
    marginLeft:10,
    marginBottom:-80,
    marginTop:-40
  },
  addList: {
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderRadius: 16,
    margin: 10,
    alignItems: "center",
    justifyContent:'center',
    width: 170,
    height: 120,
    borderWidth: 3,
    backgroundColor: '#fafaf7',
    borderColor:'#d9d9d9'
  },

});
