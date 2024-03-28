import React, { Component } from 'react'
import { Text, StyleSheet, View, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard, Animated, ToastAndroid } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Swipeable } from 'react-native-gesture-handler';

export default class TodoModal extends Component {
  state={
    newTodo: ""
  }

  toggleTodoCompleted = index =>{
    let list = this.props.list
    list.todos[index].completed = !list.todos[index].completed
    this.props.updateList(list)
  }

  addTodo = () => {
    let list = this.props.list
    if(!this.state.newTodo.trim()){
      ToastAndroid.show("Vui lòng nhập tên công việc",ToastAndroid.SHORT);
      return;
    } 
    if (!list.todos.some(todo => todo.title === this.state.newTodo)) {
      list.todos.push({ title: this.state.newTodo, completed: false });
      this.setState({newTodo : ""})
      Keyboard.dismiss()
      this.props.updateList(list);
    }
    else{
      ToastAndroid.show("Công việc này đã tồn tại",ToastAndroid.SHORT);
    }
    ToastAndroid.show("Đã có lỗi xảy ra",ToastAndroid.SHORT);
  }

  deleteTodo = (index) => {
    let list = this.props.list
    list.todos.splice(index, 1)
    this.props.updateList(list)
  }

  renderTodo = (todo, index) =>{
    return(
      <Swipeable renderRightActions={(_,dragX) => this.rightActions(dragX, index)}>
        <View style={styles.todoContainer}>
          <TouchableOpacity onPress={()=>this.toggleTodoCompleted(index)}>
            <MaterialIcons 
              name={todo.completed ? 'check-box' : 'check-box-outline-blank'}
              size={24} 
              color="#999"
              style={{width:32}}
            />
          </TouchableOpacity>
          <Text 
            style={[
              styles.todo, 
              {color: todo.completed ? "#999" : "#000", textDecorationLine: todo.completed ? 'line-through' : 'none'}
            ]}
          >
            {todo.title}
          </Text>
        </View>
      </Swipeable>
    )
  }

  rightActions = (dragX, index) => {
    const scale = dragX ? dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.9],
      extrapolate: "clamp"
    }) : new Animated.Value(1);
    
    const opacity = dragX ? dragX.interpolate({
      inputRange: [-100, -20, 0],
      outputRange: [1, 0.9, 0],
      extrapolate: "clamp"
    }) : new Animated.Value(1);

    return(
      <TouchableOpacity onPress={()=> this.deleteTodo(index)}>
        <View style={[styles.deleteButton, {opacity: opacity}]}>
          <Animated.Text style={{color:"#ded9da", fontWeight:'bold', transform: [{ scale}]}}>
            Xóa
          </Animated.Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const list = this.props.list
    const taskCount = list.todos ? list.todos.length : 0
    const completedCount = list.todos ? list.todos.filter(todo => todo.completed).length : 0

    return (
      <KeyboardAvoidingView style={{flex:1}} behavior='padding'>
        <SafeAreaView style={styles.container}>
          <TouchableOpacity 
            style={{position:'absolute', top:64, right:32, zIndex:10}} 
            onPress={this.props.closeModal}
          >
            <MaterialIcons name='close' size={24} color="#000" />
          </TouchableOpacity>
          <View style={[styles.section, styles.header, {borderBottomColor: list.color} ]}>
            <View>
              <Text style={styles.title}>{list.name}</Text>
              <Text style={styles.taskCount}>{completedCount} of {taskCount} tasks</Text>
            </View>
          </View>
          <View style={[styles.section, {flex:3, marginVertical: 16}]}>
            <FlatList 
              data={list.todos} 
              renderItem={({item, index}) => this.renderTodo(item, index)}
              //keyExtractor={(_, index) => index.toString()}
              keyExtractor={item => item.title}
              contentContainerStyle={{paddingHorizontal:32, paddingVertical:64}}
              showsVerticalScrollIndicator={false}
            />
          </View>
          <View style={[styles.section, styles.footer]}>
            <TextInput 
              style={[styles.input, {borderColor: list.color}]} 
              onChangeText={text => this.setState({newTodo: text})}
              value={this.state.newTodo}
            />
            <TouchableOpacity style={[styles.addTodo, {backgroundColor: list.color}]} onPress={()=>this.addTodo()}>
              <MaterialIcons name='add' size={16} color="#fff"/>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center",
    justifyContent:"center"
  },
  section:{
    flex:1,
    alignSelf:"stretch"
  },
  header:{
    justifyContent:"flex-end",
    marginLeft:64,
    borderBottomWidth:3,
    paddingTop:5
  },
  title:{
    fontSize:30,
    fontWeight:"800",
    color: "#000"
  },
  taskCount:{
    marginTop:4,
    marginBottom:16,
    color: "#999",
    fontWeight:"600"
  },
  footer:{
    paddingHorizontal:32,
    flexDirection:'row',
    alignItems:"center",
    paddingVertical:10
  },
  input:{
    flex: 1,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal:8
  },
  addTodo:{
    borderRadius:4,
    padding:16,
    alignItems:"center",
    justifyContent:"center"

  },
  todoContainer:{
    paddingVertical:16,
    flexDirection:"row",
    alignItems:"center",
    paddingLeft:32
  },
  todo:{
    color: "#000",
    fontWeight: "700",
    fontSize:16
  },
  deleteButton:{
    flex: 1,
    backgroundColor: '#ad050e',
    justifyContent:'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 15
  }
})
