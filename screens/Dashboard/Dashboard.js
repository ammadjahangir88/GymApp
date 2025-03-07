  import React, {useEffect, useState} from 'react';
  import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    ScrollView,
    Dimensions,
    PermissionsAndroid,
    Modal,
    Pressable,
  } from 'react-native';
  import {Camera, CameraType} from 'react-native-camera-kit';
  import axiosInstance from '../../axios/Axios';
  import {useDispatch, useSelector} from 'react-redux';
  import {LOGOUT, selectUserId} from '../../redux/authSlice';
  import {BarChart, LineChart} from 'react-native-gifted-charts';
  import Icon from 'react-native-vector-icons/FontAwesome';
  import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
  import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

  import BillModal from './BillModal';
  const {width} = Dimensions.get('window');
import styles from './Dashboard.styles';
 

  const Dashboard = () => {
    const userId = useSelector(selectUserId);
    const [status, setStatus] = useState(null);
    const [successMessage, setSuccessMessage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [timeStamp, setTimeStamp] = useState('');
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const dispatch = useDispatch();
    const [userName,setUserName]=useState('')
    useEffect(() => {
      const date = new Date();
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setCurrentDate(formattedDate);
    }, []);
    const waterData = [
      {value: 50, label: '', frontColor: '#ff9c64'},
      {value: 70, label: '', frontColor: '#ffc19f'},
      {value: 90, label: '', frontColor: '#ffebe1'},
      {value: 80, label: '', frontColor: '#ffc3a2'},
      {value: 60, label: '', frontColor: '#ff9d65'},
    ];

    const caloriesData = [
      {value: 800, label: ''},
      {value: 1000, label: ''},
      {value: 950, label: ''},
      {value: 600, label: ''},
    ];

    const [isCameraVisible, setIsCameraVisible] = useState(false);

    const requestCameraPermission = async () => {
     
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'This app needs access to your camera to scan QR codes.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setIsCameraVisible(true);
          } else {
            Alert.alert(
              'Permission Denied',
              'Camera permission is required to scan QR codes.',
            );
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        setIsCameraVisible(true);
      }
    };

    const handleScanQR = () => {
      requestCameraPermission();
    };

    const handleExitCamera = () => {
      setIsCameraVisible(false);
    };

    useEffect(() => {
      const fetchAttendanceStatus = async () => {
        try {
          const response = await axiosInstance.get('/attendance/status');
          // successMessage(response.data.canMark)
          console.log("Sata is",response.data.user.name);
          setUserName(response.data.user.name)  
          if (!response.data.canMark) {
            setSuccessMessage(true);
            setTimeStamp(response.data.markedAt);
            console.log(timeStamp);
          }
          setStatus(response.data);
        } catch (err) {
          console.log({err});
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchAttendanceStatus();
    }, []);

    const sendQR = async qr => {
      try {
        const response = await axiosInstance.post('/attendance/mark', {
          userId: userId,
          qrToken: qr,
        });

        setSuccessMessage(true);
        setTimeStamp(response?.data?.markedAt);
        setModalVisible(true);
        console.log('Response:', response.data);
      } catch (error) {
        console.error('Error:', error?.response?.data || error?.message);
        Alert.alert(
          'Error',
          error?.response?.data?.message || 'Failed to mark attendance',
        );
      }
    };

    const handleBarcodeRead = event => {
      // Alert.alert('QR Code Found', event.nativeEvent.codeStringValue);
      sendQR(event?.nativeEvent?.codeStringValue);
      setIsCameraVisible(false);
    };
    const formatTimestamp = isoString => {
      const date = new Date(isoString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true, // For AM/PM format
      });
    };
    const handleLogout = () => {
      dispatch(LOGOUT());
    };

    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.successMessage}>
                  Checked in successfully!
                </Text>
                <Text style={styles.timestamp}>
                  {timeStamp ? formatTimestamp(timeStamp) : ''}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <StatusBar backgroundColor="#111214" barStyle="light-content" />

          <View style={styles.upperContainer}>
            <View style={styles.topBar}>
              <Text style={styles.gymName}>Shapes</Text>
              <View style={styles.rightContainer}>
                <View style={styles.dateContainer}>
                  <Text style={styles.date}>{currentDate}</Text>
                </View>
               
              </View>
            </View>

            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{uri: 'https://i.pravatar.cc/150?img=3'}}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>Hello, {userName}!</Text>
                <Text style={styles.motivation}>Ready to start workout?</Text>
              </View>
            </View>
            <View style={styles.scanSection}>
              {!isCameraVisible && !successMessage && (
                <Pressable
                  style={[
                    styles.scanQRButton,
                    isHovered && styles.scanQRButtonHover, 
                  ]}
                  onPress={handleScanQR}
                  onPressIn={() => setIsHovered(true)} 
                  onPressOut={() => setIsHovered(false)}
                >
                  <MaterialIcon name="qrcode-scan" size={24} color="#ff9900" />
                  <Text style={styles.scanQRText}>Quick Check-In</Text>
                </Pressable>
              )}
              {successMessage && (
                <View style={styles.successMessageContainer}>
                  <Text style={styles.successMessageLine1}>Last Check-In</Text>
                  <Text style={styles.successMessageLine2}>
                    {timeStamp ? formatTimestamp(timeStamp) : ''}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.lowerContainer}>
            {isCameraVisible && (
              <View style={styles.cameraContainer}>
                <Camera
                cameraType={CameraType.Back}
                  style={styles.camera}
                  scanBarcode={true}
                  onReadCode={handleBarcodeRead}
                  showFrame={true}
                  laserColor="#4A90E2"
                  frameColor="white"
                />
                <TouchableOpacity
                  style={styles.exitCamera}
                  onPress={handleExitCamera}>
                  <Text style={styles.exitCameraText}>Exit Camera</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.recentGoals}>
              <Text style={styles.recentGoalsTitle}>Recent Goals</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.goalsContainer}>
                {/* Water Intake Goal */}
                <View style={[styles.goalBox, {backgroundColor: '#ff7921'}]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                    <Text style={styles.goalName}>Hydration</Text>
                    <Icon name="tint" size={24} color="#FFFFFF" />
                  </View>

                  <View style={styles.chartContainer}>
                    <BarChart
                      data={waterData}
                      frontColor={'#FFFFFF'}
                      barWidth={13}
                      barRadius={30}
                      hideRules={true}
                      hideYAxisText={true}
                      hideXAxisText={true}
                      hideDataPoints={true}
                      width={180}
                      height={70}
                      labelWidth={10}
                      xAxisColor={'transparent'}
                      yAxisColor={'transparent'}
                      barBorderRadius={4}
                    />
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.goalDetails}>781</Text>
                    <Text
                      style={{color: '#FFFFFF', fontSize: 20, lineHeight: 28}}>
                      ml
                    </Text>
                  </View>
                </View>

                {/* Calories Goal */}
                <View style={[styles.goalBox, {backgroundColor: '#414dd4'}]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                    <Text style={styles.goalName}>Calories</Text>
                    <MaterialIcon name="fire" size={24} color="#FFFFFF" />
                  </View>

                  <View style={styles.chartContainer}>
                    <LineChart
                      data={caloriesData}
                      color={'#FFFFFF'}
                      width={180}
                      height={70}
                      hideRules
                      hideYAxisText={true}
                      hideXAxisText={true}
                      hideDataPoints={true}
                      showGradient
                      labelWidth={30}
                      xAxisColor={'transparent'}
                      yAxisColor={'transparent'}
                    />
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.goalDetails}>1500 </Text>
                    <Text
                      style={{color: '#FFFFFF', fontSize: 20, lineHeight: 28}}>
                      kcal
                    </Text>
                  </View>
                </View>

                {/* BMI Goal */}
                <View style={[styles.goalBox, {backgroundColor: '#686b75'}]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                    <Text style={styles.goalName}>BMI</Text>
                    <Icon name="heart" size={24} color="#FFFFFF" />
                    {/* Using 'heart' icon for BMI */}
                  </View>
                  <Text style={styles.goalDetails}>22.1</Text>
                  <View style={styles.bmiContainer}>
                    <Text style={styles.bmiLabel}>Healthy Range</Text>
                    <View style={styles.bmiProgressBar}>
                      <View style={[styles.bmiProgress, {width: '70%'}]} />
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>

            <View style={styles.subscription}>
              <View style={styles.box}>
                <View style={styles.titleContainer}>
                  <MaterialIcons name="subscriptions" size={24} color="#ff9900" />
                  <Text style={styles.title}>Package Details</Text>
                </View>

                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Monthly Subscription</Text>
                    <View style={styles.valueContainer}>
                      <Text style={styles.value}>5000 PKR</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Last Payment</Text>
                    <View style={styles.valueContainer}>
                      <Text style={styles.value}>5000 PKR</Text>
                      <Text style={styles.dateText}>15 Nov 2024</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Next Payment Due</Text>
                    <View style={styles.valueContainer}>
                      <Text style={styles.value}>5000 PKR</Text>
                      <Text style={styles.dateText}>15 Dec 2024</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <BillModal />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

 

  export default Dashboard;
