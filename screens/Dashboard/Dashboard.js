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
  import {Camera} from 'react-native-camera-kit';
  import axiosInstance from '../../axios/Axios';
  import {useDispatch, useSelector} from 'react-redux';
  import {LOGOUT, selectUserId} from '../../redux/authSlice';
  import {BarChart, LineChart} from 'react-native-gifted-charts';
  import Icon from 'react-native-vector-icons/FontAwesome';
  import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
  import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

  import BillModal from './BillModal';
  const {width} = Dimensions.get('window');

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

    useEffect(() => {
      const date = new Date();
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
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
          console.log(response.data);
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
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}>
                  <MaterialIcon name="logout" size={20} color="#ff9900" />
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
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
                <Text style={styles.greeting}>Hello, Usman!</Text>
                <Text style={styles.motivation}>Ready to start workout?</Text>
              </View>
            </View>
            <View style={styles.scanSection}>
              {!isCameraVisible && !successMessage && (
                <Pressable
                  style={[
                    styles.scanQRButton,
                    isHovered && styles.scanQRButtonHover, // Apply hover style
                  ]}
                  onPress={handleScanQR}
                  onPressIn={() => setIsHovered(true)} // Start hover effect
                  onPressOut={() => setIsHovered(false)} // End hover effect
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

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#F5F5F5',
    },
    container: {
      flex: 1,
    },
    upperContainer: {
      width: '100%',
      padding: 20,
      backgroundColor: '#111214',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 153, 0, 0.1)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: '#ff9900',
    },
    logoutText: {
      fontSize: 14,
      color: '#ff9900',
      fontWeight: '600',
      marginLeft: 4,
    },
    dateContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: 8,
      borderRadius: 15,
    },
    date: {
      fontSize: 16,
      color: '#ff9900',
      fontWeight: '500',
    },
    gymName: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#ff9900',
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 3,
    },
    dateContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: 8,
      borderRadius: 15,
    },
    date: {
      fontSize: 16,
      color: '#ff9900',
      fontWeight: '500',
    },
    avatarSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    avatarWrapper: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 45,
      borderWidth: 3,
      borderColor: '#FFFFFF',
    },
    greetingContainer: {
      marginLeft: 20,
    },
    greeting: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#ff9900',
      marginBottom: 5,
    },
    motivation: {
      fontSize: 18,
      color: '#E0E0E0',
      fontWeight: '500',
    },
    lowerContainer: {
      flex: 1,

      marginBottom: 50,
    },
    scanSection: {
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 20,
    },
    scanQRButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 153, 0, 0.1)',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: '#ff9900',
    },
    scanQRButtonHover: {
      backgroundColor: '#23272a', 
      transform: [{ scale: 1.05 }], 
      borderColor: '#ffa726', 
      borderWidth: 2,
      shadowColor: '#ffa726',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6, 
      shadowRadius: 10,
      elevation: 12,
      opacity: 0.95, 
    },
    
    scanQRText: {
      fontSize: 16,
      color: '#ff9900',
      fontWeight: 'bold',
      marginLeft: 10,
    },
    cameraContainer: {
      flex: 1,
      padding: 20,
      marginVertical: 20,
      borderRadius: 20,
      overflow: 'hidden',
    },
    camera: {
      height: '300',
      width: '100%',
    },
    exitCamera: {
      backgroundColor: '#676a74',
      padding: 15,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 10,
    },
    exitCameraText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    goalName: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: 'bold',
    },
    goalDetails: {
      color: '#FFFFFF',
      fontSize: 28,
      fontWeight: 'bold',
      lineHeight: 28,
    },
    recentGoals: {
      color: '#363636',
      paddingLeft: 20,
      marginTop: 20,
    },
    recentGoalsTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#2C3E50',
      marginBottom: 20,
    },
    goalsContainer: {
      flexDirection: 'row',

      paddingBottom: 20,
    },
    goalBox: {
      width: width * 0.45,
      marginRight: 15,
      padding: 15,
      height: '180',
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    chartContainer: {
      marginTop: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bmiContainer: {
      marginTop: 10,
      width: '100%',
      alignItems: 'center',
    },
    bmiLabel: {
      color: '#FFFFFF',
      fontSize: 12,
      marginBottom: 5,
    },
    bmiProgressBar: {
      width: '100%',
      height: 10,
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: 5,
      overflow: 'hidden',
    },
    bmiProgress: {
      height: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: 5,
    },
    subscription: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#f7f7f7',
    },
    box: {
      width: '100%',
      padding: 20,
      borderRadius: 15,
      backgroundColor: '#ffffff',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 6,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#333',
      marginLeft: 10,
    },
    detailsContainer: {
      marginBottom: 20,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    label: {
      fontSize: 16,
      color: '#555',
    },
    valueContainer: {
      alignItems: 'flex-end',
    },
    value: {
      fontSize: 18,
      color: '#333',
      fontWeight: 'bold',
    },
    valuePKR: {
      fontSize: 14,
      color: '#777',
      marginTop: 3,
    },
    dateText: {
      fontSize: 14,
      color: '#777',
      marginTop: 3,
    },
    buttonContainer: {
      alignItems: 'center',
      marginTop: 10,
    },
    viewBillButton: {
      flexDirection: 'row',
      width: 200,
      paddingVertical: 12,
      backgroundColor: '#ff9900',
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    viewBillText: {
      fontSize: 16,
      color: '#ffffff',
      marginLeft: 10,
      fontWeight: '600',
    },
    successMessageContainer: {
      backgroundColor: '#222', // Dark gray to blend with the black background
      padding: 15,
      borderRadius: 8,
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#FFFFFF', // Adds a pop of color
    },

    successMessageLine1: {
      color: '#fff', // Bright white for visibility
      fontSize: 18, // Slightly larger for emphasis
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 5, // Space between lines
    },

    successMessageLine2: {
      color: 'green', // Contrasting color for the second line
      fontSize: 16,
      textAlign: 'center',
      fontWeight: '500',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
    successMessage: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#4caf50',
      marginBottom: 10,
    },
    timestamp: {
      fontSize: 16,
      color: '#333',
      marginBottom: 20,
    },
    closeButton: {
      backgroundColor: '#4caf50',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    closeButtonText: {
      color: '#ffffff',
      fontSize: 16,
    },
  });

  export default Dashboard;
