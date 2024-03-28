import React, {Component} from 'react'
import { Text, StyleSheet, View, Modal, TouchableOpacity } from 'react-native'
import TodoModal from './TodoModal'

export default class TodoList extends Component {
    state = {
        showListVisible: false
    }

    toggleListVisible(){
        this.setState({showListVisible: !this.state.showListVisible})
    }
    render(){
        const list = this.props.list
        const todos = list.todos || []
        const completedCount = todos.filter(todo=>todo.completed).length
        const remainingCount = todos.length - completedCount

        return (
            <View>
                <Modal animationType='slide' visible={this.state.showListVisible} onRequestClose={()=>this.toggleListVisible()}>
                    <TodoModal list={list} closeModal={()=>this.toggleListVisible()} updateList={this.props.updateList}/>
                </Modal>
                <TouchableOpacity style={[styles.listContainer, {backgroundColor:list.color}]} onPress={()=>this.toggleListVisible()}>
                    <Text style={styles.listTitle} numberOfLines={1}>{list.name}</Text>
                    <View>
                        <View style={{alignItems:"center"}}>
                            <Text style={styles.count}>{remainingCount}</Text>
                            <Text style={styles.subTitle}>Remaining</Text>
                        </View>
                        <View style={{alignItems:"center"}}>
                            <Text style={styles.count}>{completedCount}</Text>
                            <Text style={styles.subTitle}>Completed</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    listContainer:{
        paddingVertical:30,
        paddingHorizontal:16,
        borderRadius:16,
        marginHorizontal:16,
        alignItems:"center",
        width:200,
    },
    listTitle:{
        fontWeight:"700",
        fontSize:24,
        marginBottom:15,
        color: "white"
    },
    count:{
        fontSize:48,
        fontWeight:"200",
        color: "white"
    },
    subTitle:{
        fontWeight:"700",
        fontSize:12,
        color: "white"
    }
})
