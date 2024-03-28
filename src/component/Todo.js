import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, ToastAndroid } from 'react-native';
import React, { Component } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TodoList from './TodoList.js';
import AddListModal from './AddListModal.js';
import addListFireStore from '../feature/firebase/addListFireStore.js';
import {getAuth} from "@react-native-firebase/auth"

export class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addTodoVisible: false,
      lists: [],
      user: null,
      loading: true,
    };
    this.firebase = new addListFireStore((error, user) => {
      if (error) {
        console.error("Error initializing Firestore:", error);
      } else {
        this.setState({ user });
        this.getListsFromFirestore();
      }
    });
  }
  
  async componentDidMount() {
    try {
      const firestoreInstance = new addListFireStore();
      const user = await firestoreInstance.init();
  
      if (user) {
        this.setState({ user: user.displayName }, () => {
          this.getListsFromFirestore();
        }); 
      }
    } catch (error) {
      console.error("Error initializing Firestore:", error);
    }
  }

  async getListsFromFirestore() {
    try {
      const firebase = new addListFireStore()
      const lists = await firebase.getLists();
      this.setState({ lists, loading: false });
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  }


  toggleAddTodoModal() {
    this.setState({ addTodoVisible: !this.state.addTodoVisible })
  }

  renderList = list => {
    return (
      <TodoList list={list} updateList={this.updateList} />
    )
  }

  addList = async list => {
    try {
      this.setState({ lists: [...this.state.lists, { ...list, id: this.state.lists.length + 1, todos: [] }] });
      const firebase = new addListFireStore()
      await firebase.addList({
        name: list.name,
        color: list.color,
        todos: []});
    } catch (error) {
      console.error("Error adding list:", error);
    }
  }


  updateList = async list => {
    try {
      this.setState({
        lists: this.state.lists.map(item => {
          return item.id === list.id ? list : item;
        })
      })
      const firebase = new addListFireStore()
      await firebase.updateList(list)

    } catch (error) {
      
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size={'large'} color={'#24A6D9'}></ActivityIndicator>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Modal animationType='slide' visible={this.state.addTodoVisible} onRequestClose={() => this.toggleAddTodoModal()}>
          <AddListModal closeModal={() => this.toggleAddTodoModal()} addList={this.addList} />
        </Modal>
        <View>
          <Text>User: {this.state.user ? this.state.user : 'Guest'}</Text>
        </View>
        <View style={{ flexDirection: 'row'}}>
          <View style={styles.divider} />
            <Text style={styles.title}>
              Todo<Text style={{ fontWeight: "300", color: '#24A6D9' }}> Lists</Text>
            </Text>
          <View style={styles.divider} />
        </View>
        <View style={{ marginVertical: 48 }}>
          <TouchableOpacity style={styles.addList} onPress={() => this.toggleAddTodoModal()}>
            <MaterialIcons name="add" size={16} color={'#24A6D9'} />
          </TouchableOpacity>
          <Text style={styles.add}>Add List</Text>
        </View>
        <View style={{ height: 300, paddingLeft: 32 }}>
          <FlatList
            data={this.state.lists}
            keyExtractor={item => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => this.renderList(item)}
            keyboardShouldPersistTaps="always"
          />
        </View>
      </View>
    )
  }
}

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
