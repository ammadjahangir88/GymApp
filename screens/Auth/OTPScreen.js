import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard
} from 'react-native';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SET_ACTIVE_USER} from '../../redux/authSlice';
import axiosInstance from '../../axios/Axios';
import Toast from 'react-native-toast-message';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from "react-native-confirmation-code-field";
import styles from './OTP.styles';

const OTPScreen = ({route,navigation}) => {
    const CELL_COUNT = 4;
 
  const {phoneNumber} = route.params;
  const [loading, setLoading] = useState(false);
  
  const dispatch=useDispatch()
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [cellProps, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });
  const handleCodeChange = (text) => {
    setValue(text);
    if (text.length === CELL_COUNT) {
      Keyboard.dismiss();
    }
  };

  const verifyOtp = async () => {
    if (!value || value.length !== 4) {
   
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Please enter a valid 6-digit OTP',
        visibilityTime: 1200,
        autoHide: true,
        topOffset: 50,
        bottomOffset: 40,
      });
      return;
    }
  
    setLoading(true);
  
    try {
      const fullPhoneNumber = `+92${phoneNumber}`
      const response = await axiosInstance.post('/auth/verify-Otp', {
        phoneNumber: fullPhoneNumber,
        otp: value,
      });
  
      if (response.status === 201) {
        const token = response.data.accessToken;
        console.log(token);
  
        
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
      } else {
       
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error',
          text2: 'Invalid OTP. Please try again.',
          visibilityTime: 1200,
          autoHide: true,
          topOffset: 50,
          bottomOffset: 40,
        });
      }
    } catch (error) {
      console.error(error);
  
     
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to verify OTP. Please try again.',
        visibilityTime: 1200,
        autoHide: true,
        topOffset: 50,
        bottomOffset: 40,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter OTP</Text>
      <Text style={styles.subHeader}>
        Please enter the OTP sent to your phone.
      </Text>


      <View style={styles.optInputWrapper}>
        <CodeField
          ref={ref}
          {...cellProps}
          value={value}
          onChangeText={handleCodeChange}
          cellCount={CELL_COUNT}
          rootStyle={styles.optInputRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.optInputCellRoot, isFocused && styles.optInputFocusCell]}>
              <Text style={styles.optInputCellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />
      </View>
      {/* <View style={styles.inputContainer}>
        <TextInput
          value={otp}
          onChangeText={setOtp}
          placeholder="Enter OTP"
          style={styles.input}
          keyboardType="numeric"
          maxLength={6}
        />
      </View> */}

      <TouchableOpacity style={styles.verifyButton} onPress={verifyOtp}>
        <Text style={styles.verifyButtonText}>Verify OTP</Text>
      </TouchableOpacity>

   
    </View>
  );
};



export default OTPScreen;
