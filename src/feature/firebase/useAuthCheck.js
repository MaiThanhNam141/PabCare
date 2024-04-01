import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { ToastAndroid } from 'react-native';

const useAuthCheck = () => {
  const fetchData = async (setDisplayName, setAvatar) => {
    try {
      const user = auth().currentUser;
      if (user) {
        const userDoc = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();
        if (userDoc.exists) {
          setDisplayName(userDoc.data().displayName);
          setAvatar(userDoc.data().photoURL);
        } else {
          setDisplayName("Guest");
          setAvatar(null);
          return ToastAndroid.show('Đã đăng nhập, nhưng không thể truy xuất được dữ liệu người dùng', ToastAndroid.SHORT);
        }
      } else {
        setDisplayName(null);
        setAvatar(null);
        return ToastAndroid.show('Người dùng không tồn tại', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log("Lỗi khi truy cập dữ liệu người dùng:", error);
      return ToastAndroid.show('Lỗi khi đăng nhập, vui lòng đăng nhập lại', ToastAndroid.SHORT);
    }
  };

  const onAuthStateChanged = (setDisplayName, setAvatar) => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth().onAuthStateChanged(async user => {
            if (!user) {
                //ToastAndroid.show('Người dùng đã đăng xuất', ToastAndroid.SHORT);
                reject(new Error('Người dùng đã đăng xuất'));
            } else {
                try {
                    await fetchData(setDisplayName, setAvatar);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            }
        });

        return () => {
            unsubscribe();
        };
    });
};
  
  return {onAuthStateChanged};
};

export default useAuthCheck;
