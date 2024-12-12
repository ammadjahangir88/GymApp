import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  TextInput
} from 'react-native';
import Toast from "react-native-toast-message";
import OTPScreen from './OTPScreen';
import axiosInstance from '../../axios/Axios';
import styles from './Login.styles';
// Import the Pakistani flag image (you'll need to add this to your assets)
const PakistanFlag = require('../../assets/images/pakistani-flag.png');

const CustomInput = ({ value, setValue, placeholder, secureTextEntry }) => (
  <View style={styles.inputContainer}>
    <TextInput
      value={value}
      onChangeText={setValue}
      placeholder={placeholder}
      style={styles.input}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#666"
      autoCapitalize='none'
      keyboardType="phone-pad"
      maxLength={10}
    />
  </View>
);

const CustomButton = ({ onPress, text, loading, type = 'PRIMARY' }) => (
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

const OTPLoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [OTP,sendOtp]=useState("")
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }
  
    setLoading(true);
  
    try {
      const fullPhoneNumber = `+92${phoneNumber}`
      console.log(typeof fullPhoneNumber)
      const response = await axiosInstance.post('/auth/send-otp', {
        phoneNumber: fullPhoneNumber,
      });
      console.log(response.data)
      // Check for a successful response
      if (response.status === 201) {
        console.log(response)
        Alert.alert(
          'OTP Generated',
          'An OTP has been sent to your phone number. Please enter the OTP in the next screen.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('OTP',{phoneNumber});
              },
            },
          ]
        );
      } else {
        throw new Error('Failed to generate OTP. Please try again.');
      }
    } catch (error) {
      
      Alert.alert('Error', error.response?.data?.message || 'Failed to generate OTP. Please try again.');
    } finally {
      setLoading(false);
    }
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
        
        <Text style={styles.welcomeText}>Login with OTP</Text>

        <View style={styles.formContainer}>
          <View style={styles.phoneInputContainer}>
            <View style={styles.flagContainer}>
              <Image 
                source={PakistanFlag} 
                style={styles.flagImage} 
                resizeMode="contain"
              />
              <Text style={styles.countryCode}>+92</Text>
            </View>
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="3XX-XXXXXXX"
              style={styles.phoneInput}
              keyboardType="phone-pad"
              maxLength={10}
              placeholderTextColor="#666"
            />
          </View>

          <CustomButton
            onPress={handleVerifyOTP}
            text="Verify"
            loading={loading}
            type="PRIMARY"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};



export default OTPLoginScreen;
