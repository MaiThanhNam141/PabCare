import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useState } from 'react';

const useFirestoreDiary = () => {
    const [ref, setRef] = useState(null);

    const addDiary = async () => {
        try {
            if(ref){
                await ref.add(diaryText)
            }
            else {
                console.error("Firestore reference is not initialized.")
            }
        } catch (error) {
            console.log(error)
            return []
        }
    }

    const updateDiary = async (diary) => {
        try {
            await ref.doc(diary.id).update(diary);
        } catch (error) {
            console.log(error)
        }
    }

    const getDiary = async () => {
        try {
          const user = auth().currentUser;
          const diaryRef = firestore().collection('users').doc(user.uid).collection('diary');
          const snapshot = await diaryRef.get()
          setRef(diaryRef);
          const diaryText = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          return diaryText;
        } catch (error) {
          console.error(error);
          return [];
        }
    };

    return {getDiary, addDiary, updateDiary}

}

export default useFirestoreDiary