import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

class addListFireStore {
    async init() {
      try {
        const user = auth().currentUser;
        return user;
      } catch (error) {
        throw new Error("Error initializing Firestore:", error);
      }
    }
    
    async addList(list){
      let ref = this.ref
      ref.add(list)
    }
    
    async updateList(list){
      let ref = this.ref
      ref
      .doc(list.id)
      .update(list)
    }
    async getLists() {
      try {
        const userId = this.userID;
        const ref = firestore()
        .collection('users')
        .doc(userId)
        .collection('lists');
        
        const snapshot = await ref.get();
        const lists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return lists;
      } catch (error) {
        throw new Error("Error fetching lists:", error);
      }
    }
    
    get userID() {
      return auth().currentUser.uid;
    }

    get ref(){
      return ref = firestore()
          .collection('users')
          .doc(this.userID)
          .collection('lists');
    }
  }
  
  export default addListFireStore;
  