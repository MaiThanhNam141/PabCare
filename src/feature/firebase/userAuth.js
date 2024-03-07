import {auth} from '@react-native-firebase/auth'

const handleSignUp = (email, password) => {
    return auth().createUserWithEmailAndPassword(email.trim(), password)
    .then ( cred =>{
        const {uid} = cred.user
        auth().currentUser.updateProfile({
            displayName: fullname
        })
        return uid
    })
    .catch(
        err => console.error(err.code, err.message)
    )
}

const handleLogin = (email, password) => {
    return auth().signInWithEmailAndPassword(email.trim(), password)
    .then(()=>{
        console.log(auth().currentUser.uid)
    })
}

const handleLogout = () => {
    return auth().signOut()
}
const Auth = { handleLogin, handleLogout, handleSignUp}
export default Auth