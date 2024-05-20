import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useState } from 'react';

const useFirestoreList = () => {
  const [ref, setRef] = useState(null);

  const addList = async (list) => {
    try {
      if (ref) {
        await ref.add(list);
      } else {
        console.error("Firestore reference is not initialized.");
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const updateList = async (list) => {
    try {
      if (ref) {
        await ref.doc(list.id).update(list);
      } else {
        console.error("Firestore reference is not initialized.");
      }
    } catch (error) {
     console.error("firebase nè:",error)
    }
  };

  const renewListRoutine = async (listID, userID) => {
    try {
        const renewListRef = firestore().collection('users').doc(userID).collection('lists').doc(listID);
        const renewSnapshot = await renewListRef.get();

        if (renewSnapshot.exists) {
            const todos = renewSnapshot.data().todos;

            // Thay đổi giá trị của completed thành false cho mỗi phần tử trong mảng todos
            const updatedTodos = todos.map(todo => ({
                ...todo,
                completed: false
            }));

            // Cập nhật mảng todos mới vào tài liệu
            await renewListRef.update({ todos: updatedTodos });
        } else {
            console.log("Document does not exist");
        }
    } catch (error) {
        console.error(error);
    }
};


  const getLists = async () => {
    try {
      const user = auth().currentUser;
      const currentTimeStamp = firestore.FieldValue.serverTimestamp();

      const listRef = firestore().collection('users').doc(user.uid).collection('lists');
      const snapshot = await listRef.get()

      setRef(listRef);
      const lists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const renewRoutinePromises = snapshot.docs
        .filter(doc => doc.data().routine)
        .map(async doc => {
          const listData = doc.data();
          if (listData.initdate) {
              const initdate = listData.initdate.toDate(); 
              if (initdate < currentTimeStamp) {
                await renewListRoutine(doc.id, user.uid);
              }
          }
      });
      await Promise.all(renewRoutinePromises);

      return lists;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const deleteList = async(listId) => {
    try {
      if (!ref) {
        console.error("Firestore reference is not initialized.");
        return;
      }
      
      await ref.doc(listId).delete();
    } catch (error) {
      console.error("Error deleting list useFirestoreList:", error);
      throw new Error(error);
    }
  }

  return { addList, updateList, getLists, deleteList };
};

export default useFirestoreList;
