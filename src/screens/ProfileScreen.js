import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = () => {
  const {heightS, widthS} = Dimensions.get("window")
  const imageLink = {uri:"https://images.unsplash.com/photo-1550147760-44c9966d6bc7?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
  const handleLogin = () => {
    // Viết code xử lý đăng nhập ở đây
    console.log('Đăng nhập');
  };

  const handleForgotPassword = () => {
    // Viết code xử lý quên mật khẩu ở đây
    console.log('Quên mật khẩu');
  };

  const handleSignUp = () => {
    // Viết code xử lý đăng ký ở đây
    console.log('Đăng ký');
  };

  const handleGoogleLogin = () => {
    // Viết code xử lý đăng nhập bằng Google ở đây
    console.log('Đăng nhập bằng Google');
  };

  const handleFacebookLogin = () => {
    // Viết code xử lý đăng nhập bằng Facebook ở đây
    console.log('Đăng nhập bằng Facebook');
  };

  return (
    <View style={styles.backgroundContainer}>
      <ImageBackground source={imageLink} height={heightS} width={widthS} style={styles.imageBackground}/>
      <View style={styles.container}>      

        {/* Title */}
        <Text style={styles.titleText}>Login</Text>

        {/* Inputs */}
        <TextInput style={styles.input} placeholder="Username" />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry />

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.7}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Links */}
        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Text style={styles.linkDivider}>|</Text>

          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Google Login */}
        <View style={styles.socialLoginsContainer}>
          <View style={[styles.subSocialLoginContainer,{backgroundColor: '#4285F4',}]}>
            <TouchableOpacity style={styles.socialLoginButton} onPress={handleGoogleLogin} activeOpacity={0.7}>
              <View style={styles.socialLoginInnerContainer}>
                <Icon name="google" size={20} color="white" />
                <Text style={styles.socialLoginText}>Login with Google{'    '}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.subSocialLoginContainer,{backgroundColor: '#3b5998'}]}>
            <TouchableOpacity style={styles.socialLoginButton} onPress={handleFacebookLogin} activeOpacity={0.7}>
              <View style={styles.socialLoginInnerContainer}>
                <Icon name="facebook" size={20} color="white" />
                <Text style={styles.socialLoginText}>Login with Facebook</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  container: {
    justifyContent:'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor:'#fafaf7',
    //borderRadius:25,
    width:'100%',
    height:'85%',
    alignSelf:'flex-start',
    borderTopLeftRadius: 25, 
    borderTopRightRadius: 25,
  },
  imageBackground: {
    flex:1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  
  titleText: {
    fontSize: 28,
    margin: 14,
    fontWeight:'bold'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '100%',
    borderRadius: 5,
  },
  loginButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
  },
  linksContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  linkText: {
    marginRight: 20,
    marginLeft:20,
    color: 'blue',
  },
  linkDivider: {
    marginHorizontal: 10,
    color: 'blue',
  },
  socialLoginsContainer: {
    flexDirection: 'column',
    width:'100%',
    justifyContent: 'space-between', 
    marginTop:30
  },
  subSocialLoginContainer: {
    marginTop: 10,
    borderRadius: 5,
  },
  socialLoginButton: {
    width: '100%',
  },
  socialLoginInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  socialLoginText: {
    marginLeft: 10,
    color: 'white',
  },
});


export default ProfileScreen;
