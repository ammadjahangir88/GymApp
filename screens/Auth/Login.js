import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import axiosInstance from '../../axios/Axios';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SET_ACTIVE_USER} from '../../redux/authSlice';
import Toast from "react-native-toast-message";
const CustomInput = ({value, setValue, placeholder, secureTextEntry}) => (
  <View style={styles.inputContainer}>
    <TextInput
      value={value}
      onChangeText={setValue}
      placeholder={placeholder}
      style={styles.input}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#666"
      autoCapitalize='none'
    />
  </View>
);

const CustomButton = ({onPress, text, loading, type = 'PRIMARY'}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.buttonContainer, styles[`button_${type}`]]}
    disabled={loading}>
    {loading ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text style={[styles.buttonText, styles[`buttonText_${type}`]]}>
        {text}
      </Text>
    )}
  </TouchableOpacity>
);

export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {
      setEmail('');
      setPassword('');
    }, [])
  );
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      // console.log(response.data.access_token)
      setLoading(false);
      if (response.data) {
        console.log(response.data);
        const token = response.data.accessToken;
        console.log(token)
        console.log('Email is ', response.data.user.email);
        dispatch(
          SET_ACTIVE_USER({
            email: response.data.user.email,
            userName: response.data.user.name,
            token: token,
            userType: response.data.user.role,
            userId: response.data.user.id,
          }),
        );
        await AsyncStorage.setItem('token', token);
        Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Login Successful!',
            text2: 'Welcome to the app!',
            visibilityTime: 1200,
            autoHide: true,
            topOffset: 50,
            bottomOffset: 40,
          });
        navigation.navigate('Dashboard');
      }
    } catch (error) {
      setLoading(false);
      console.log(error.response.data);
      if (error.response?.data?.message) {
        const errorMessage = Array.isArray(error.response.data.message)
          ? error.response.data.message.join('\n') // Join array elements with newline or any desired separator
          : error.response.data.message; // Use it directly if not an array
    
        Alert.alert('Error', errorMessage);
      } else {
        Alert.alert('Error', 'Login failed. Please try again.');
      }
     
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
    Alert.alert('Info', 'Forgot password functionality to be implemented');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/wp7661163.jpg')}
            resizeMode="cover"
            style={styles.logo}
          />
         
        </View>
        <Text style={styles.welcomeText}>Welcome Back!</Text>
     
        <View style={styles.formContainer}>
          <CustomInput placeholder="Email" value={email} setValue={setEmail} />
          <CustomInput
            placeholder="Password"
            value={password}
            setValue={setPassword}
            secureTextEntry
          />
          <CustomButton text="Login" onPress={handleLogin} loading={loading} />
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: '#F9FBFC',
    },
    contentContainer: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    logoContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: '100%',
      height: '100%',
      opacity:  0.8,
      resizeMode: 'cover',
      position: 'absolute',
    },
    welcomeText: {
      fontSize: 28,
      
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center', 
      position: 'absolute',
      top: '35%', 
      left: '25%',
    //   borderColor:'red',
    //   borderWidth: 4
    },
    subtitleText: {
      fontSize: 16,
      color: '#FFFFFF',
      textAlign: 'center',
    },
    formContainer: {
      width: '100%',
      alignItems: 'center',
      marginTop: '50%',
    },
    inputContainer: {
      width: '100%',
      backgroundColor: 'white',
      height: 50,
      borderRadius: 10,
      marginVertical: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    input: {
      height: 50,
      color:'black',
      paddingHorizontal: 15,
      fontSize: 16,
    },
    forgotPasswordText: {
      color: '#ff9900',
      fontWeight: '600',
      marginVertical: 15,
      alignSelf: 'flex-end',
    },
    buttonContainer: {
      width: '100%',
      padding: 15,
      marginVertical: 5,
      alignItems: 'center',
      borderRadius: 10,
    },
    button_PRIMARY: {
      backgroundColor: '#ff9900',
    },
    button_SECONDARY: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#3B71F3',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    buttonText_PRIMARY: {
      color: 'white',
    },
    buttonText_SECONDARY: {
      color: '#3B71F3',
    },
    signUpContainer: {
      flexDirection: 'row',
      marginTop: 20,
      alignItems: 'center',
    },
    signUpText: {
      color: '#FFFFFF',
      fontSize: 14,
    },
    signUpLink: {
      color: '#ff9900',
      fontWeight: '600',
      fontSize: 14,
    },
  });
  