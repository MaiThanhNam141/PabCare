import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useState } from 'react';

let initdate = new Date();

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
     console.error("updateList nè:",error)
    }
  };

  const getLists = async () => {
    try {
      const user = auth().currentUser;
      const currentTimeStamp = new Date();
      currentTimeStamp.setHours(0, 0, 0, 0);
      const listRef = firestore().collection('users').doc(user.uid).collection('lists');
      const snapshot = await listRef.get()
      setRef(listRef);
      if(snapshot){
        const lists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const routineListIndexTomorrow = lists.findIndex(list => list?.date === 'Tomorrow');
        const routineListIndexToday = lists.findIndex(list => list?.date === 'Today');

        if (routineListIndexTomorrow !== -1 && routineListIndexToday === -1) {
          lists.splice(routineListIndexTomorrow, 1);
        }
        
        if (routineListIndexTomorrow !== -1 && routineListIndexToday !== -1) {
          lists.splice(routineListIndexTomorrow, 1);
          lists.splice(routineListIndexToday, 1);
        }
        return lists;
      }
      else console.log("Lỗi");
    } catch (error) {
      console.error("Error getLists: ", error);
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

  const getRoutine = async() => {
    try {
      const user = auth().currentUser;
      const listRef = firestore().collection('users').doc(user.uid).collection('lists');
      const snapshot = await listRef.get()

      const routineListToday = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .find(list => list.date === 'Today');

      const routineListTomorrow = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .find(list => list.date === 'Tomorrow');

      routineListTomorrow || await listRef.doc(`Tomorrow`).set({ 
        "routine": true,
        "initdate": initdate,
        "lastDate": initdate, 
        "todos": [], 
        "date": "Tomorrow"
      });

      routineListToday || await listRef.doc(`Today`).set({ 
        "routine": true,
        "initdate": initdate,
        "lastDate": initdate, 
        "todos": [], 
        "date": "Today"
      });

      return routineListToday;

    } catch (error) {
      console.error("Error getting routine:", error);
      throw new Error(error);
    }
  }

  return { addList, updateList, getLists, deleteList, getRoutine };
};
export default useFirestoreList;
