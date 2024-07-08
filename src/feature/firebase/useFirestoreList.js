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
     console.error("updateList nè:",error)
    }
  };

  const updateRoutine = async (routine) => {
    try {
      if (ref) {
        await ref.doc("Routine").update(routine);
      } else {
        console.error("Firestore reference is not initialized.");
      }
    } catch (error) {
     console.error("updateRoutine nè:",error)
    }
  };

  const renewListRoutine = async (routineListTomorrowID, currentTimeStamp, routineListTodayID) => {
    try {
      if(routineListTodayID) {
        await ref.doc(routineListTodayID).delete();
      }
      const renewListRef = await ref.doc(routineListTomorrowID);
      const renewSnapshot = await renewListRef.get();

      if (renewSnapshot.exists) {
        const updatedTodos = renewSnapshot.data().todos.map(todo => ({
          ...todo,
          completed: false
        }));

        await renewListRef.update({ todos: updatedTodos, date: "Today", lastDate:  currentTimeStamp});
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
          const routineList = lists[routineListIndexTomorrow];
          const initdate = routineList.initdate.toDate();
          initdate.setHours(0, 0, 0, 0);

          if (initdate < currentTimeStamp) {
            await renewListRoutine(routineList.id, currentTimeStamp, 0);
          }
          lists.splice(routineListIndexTomorrow, 1);
        }
        
        if (routineListIndexTomorrow !== -1 && routineListIndexToday !== -1) {
          const routineList = lists[routineListIndexTomorrow];
          const initdate = routineList.initdate.toDate();
          initdate.setHours(0, 0, 0, 0);

          if (initdate < currentTimeStamp && !routineList.todos?.length) {
            await renewListRoutine(routineList.id, currentTimeStamp, routineListIndexToday);
          }
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
      let initdate = new Date();
      const user = auth().currentUser;
      const listRef = firestore().collection('users').doc(user.uid).collection('lists');
      const snapshot = await listRef.get()

      const routineListToday = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .find(list => list.date === 'Today');

      const routineListTomorrow = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .find(list => list.date === 'Tomorrow');

      routineListTomorrow || await listRef.doc(`Routine ${initdate}`).set({ "color":"#87bc9d", "routine": true,"initdate" :initdate,"lastDate" : initdate, "todos" : [], "date" : "Tomorrow"})

      return routineListToday;

    } catch (error) {
      console.error("Error getting routine:", error);
      throw new Error(error);
    }
  }

  return { addList, updateList, getLists, deleteList, getRoutine, updateRoutine };
};
export default useFirestoreList;
