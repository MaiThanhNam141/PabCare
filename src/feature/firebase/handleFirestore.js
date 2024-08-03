import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Lấy thông tin người dùng hiện tại
const getCurrentUser = () => {
    return auth().currentUser;
}

// Lấy reference đến tài liệu Firestore của người dùng hiện tại
const getUserDocumentRef = () => {
    const user = getCurrentUser();
    if (user) {
        return firestore().collection('users').doc(user.uid);
    }
    return null;
}

const getDocumentRef = async(collectionName) => {
    try {
        return await firestore().collection(collectionName).get()
    } catch (error) {
        console.error("handleFirestore:" , error)
    }
}

// Lấy thông tin từ Firestore của người dùng hiện tại
const getUserInfo = async () => {
    const userRef = getUserDocumentRef();
    if (userRef) {
        try {
            const snapshot = await userRef.get();
            if (snapshot.exists) {
                return snapshot.data();
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            throw error; 
        }
    }
    return null;
}

// Cập nhật thông tin của người dùng hiện tại trong Firestore
const updateUserInfo = (...userData) => {
    const userRef = getUserDocumentRef();
    if (userRef) {
        try {
            userRef.update(...userData);
            return true; // Trả về true nếu cập nhật thành công
        } catch (error) {
            console.error('Error updating user info:', error);
            throw error; // Ném lỗi để bên ngoài có thể xử lý
        }
    }
    return false; // Trả về false nếu không thể cập nhật
}

// Thiết lập thông tin của người dùng hiện tại trong Firestore
const setUserInfo = async (userData) => {
    const userRef = getUserDocumentRef();
    if (userRef) {
        try {
            await userRef.set(userData);
            return true; // Trả về true nếu thiết lập thành công
        } catch (error) {
            console.error('Error setting user info:', error);
            throw error; // Ném lỗi để bên ngoài có thể xử lý
        }
    }
    return false; // Trả về false nếu không thể thiết lập
}

const getRoutineFirebase = (routineType) => {
    try {
        const user = getCurrentUser()
        return firestore().collection("users").doc(user.uid).collection("lists").doc(routineType);
    } catch (error) {
        console.log("getRoutineFirebase Error: ", error);
    }
}

const updateRoutineFirebase = (todos, type) => {
   try {
     const date = new Date()
     getRoutineFirebase(type).update({todos: todos, lastDate: date})
   } catch (error) {
    console.log("updateRoutineFirebase: ", error);
   }
}

const getDiary = async () => {
   try {
        const user = getCurrentUser();
        const diaryRef = firestore().collection('users').doc(user.uid).collection('diary');
        const snapshot = await diaryRef.get();
        if (snapshot) {
            const diary = snapshot.docs.map(doc => ({id: doc.id, ...doc.data() }));
            return diary
        }
   } catch (error) {
        console.error("getDiaryFirebase: ", error)
   }
}
const setDiary = (date, diaryText) => {
   try {
        const user = getCurrentUser();
        firestore().collection('users').doc(user.uid).collection('diary').doc(date).set({text: diaryText});
   } catch (error) {
        console.error("setDiaryFirebase: ", error)
   }
}


export { getCurrentUser, getUserInfo, updateUserInfo, setUserInfo, getDocumentRef, getUserDocumentRef, getRoutineFirebase, updateRoutineFirebase, getDiary, setDiary };
