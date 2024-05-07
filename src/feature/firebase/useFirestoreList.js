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

  const getLists = async () => {
    try {
      const user = auth().currentUser;
      const listRef = firestore().collection('users').doc(user.uid).collection('lists');
      const snapshot = await listRef.get()
      setRef(listRef);
      const lists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
