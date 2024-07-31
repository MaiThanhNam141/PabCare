import React, { useState, useEffect } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, ToastAndroid, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TodoList from './TodoList.js';
import AddListModal from './AddListModal.js';
import useFirestoreList from '../../feature/firebase/useFirestoreList.js';
import LinearGradient from "react-native-linear-gradient";
import { Today, Tomorrow } from '../../data/Link.js';
import TodoRoutine from './TodoRoutine.js';
import { getCurrentUser, getUserInfo } from '../../feature/firebase/handleFirestore.js';

const Todo = () => {
  let initdate = new Date();

  const [addTodoVisible, setAddTodoVisible] = useState(false);
  const [lists, setLists] = useState([]);
  const [date, setDate] = useState('Today')
  const [showRoutineModalVisible, setShowRoutineModalVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  const { addList, updateList, getLists, deleteList, getRoutine } = useFirestoreList();

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        const userData = await getUserInfo();
        if (userData) {
          setUser(userData.displayName);
          const snapshot = getCurrentUser();
          const userId = snapshot.uid;
          const fetchData = async () => {
              try {
                  const response = await fetch(`https://us-central1-pabcare-9633d.cloudfunctions.net/updateTodos?userId=${userId}`);
                  const data = await response.text();
                  console.log(data);
              } catch (error) {
                  console.error('Error updating routines in UseEffect:', error);
              }
          };
          fetchData();
        }
      } catch (error) {
        console.error("Error get user in Todo:", error);
      }
    };

    initializeFirebase();
  }, []);

  useEffect(()=>{
    getListsFromFirestore();
  }, [reload]);

  const getListsFromFirestore = async () => {
    try {
      const lists = await getLists();
      setLists(lists);
      setLoading(false);

      getRoutine();
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
      setReload(!reload);
      await addList({
        name: list.name,
        color: list.color,
        initdate: initdate,
        todos: []
      });
    } catch (error) {
      console.error("Error adding list Todo:", error);
      ToastAndroid.show("Thêm todo thất bại", ToastAndroid.SHORT);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      setReload(!reload);
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
      ToastAndroid.show("Cập nhật todo thất bại", ToastAndroid.SHORT);
    }
  };

  const handleRoutine = (day) => {
    try {
      day !== 'today' ? setDate('Tomorrow') : setDate('Today');
      setShowRoutineModalVisible(!showRoutineModalVisible);
    } catch (error) {
      console.error("Error adding list Todo:", error);
      ToastAndroid.show("Đã xảy ra lỗi", ToastAndroid.SHORT);
    }
  }

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
      <Modal animationType='slide' visible={showRoutineModalVisible} onRequestClose={() => setShowRoutineModalVisible(false)}>
        <TodoRoutine 
          date={date} 
          user={user}
        />
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
      <View style={styles.scheduleContainer}>
        <TouchableOpacity onPress={() => handleRoutine('today')} style={styles.routineContainer}>
          <Image source={Today} style={styles.routine}/>
          <Text style={styles.routineText}>Hôm nay</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRoutine('tomorrow')} style={styles.routineContainer}>
          <Image source={Tomorrow} style={styles.routine}/>
          <Text style={styles.routineText}>Ngày mai</Text>
        </TouchableOpacity>
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
    marginBottom:-28,
  },
  addList: {
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderRadius: 16,
    margin: 10,
    alignItems: "center",
    justifyContent:'center',
    width: 150,
    height: 120,
    borderWidth: 3,
    backgroundColor: '#fafaf7',
    borderColor:'#d9d9d9'
  },
  scheduleContainer:{
    backgroundColor:'rgba(135,188,157,0.5)',
    width:350,
    height:85,
    marginBottom:10,
    borderRadius:20,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-evenly'
  },
  routineContainer:{
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    marginLeft:15,
  },
  routine:{
    width:55,
    height:55,
    overflow:'hidden',
    resizeMode:'contain',
    paddingVertical:0
  },
  routineText:{
    color:'#b8e28a',
    fontSize:12,
    textAlign:'center'
  }
});
