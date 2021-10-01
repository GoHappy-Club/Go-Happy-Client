import React, {Component} from 'react';
import { SafeAreaView,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback, StyleSheet, View, TextInput, Image, Text, KeyboardAvoidingView } from 'react-native';

// import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar } from 'react-native-paper'
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';
import HomeScreen from '../homeScreen/HomeScreen';
// import { Container, Header, Content, Left, Body, Right, Icon, Title, Form, Item, Input, Label } from 'native-base';
import {
  MaterialIndicator,
} from 'react-native-indicators';

import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-google-signin/google-signin';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { SafeAreaViewBase } from 'react-native';
import { ViewPagerAndroidBase } from 'react-native';
import firebase from '@react-native-firebase/app'
import '@react-native-firebase/auth';
import { Button } from 'react-native-elements';


const user = firebase.auth().currentUser;

GoogleSignin.configure({
	webClientId: '908368396731-fr0kop29br013r5u6vrt41v8k2j9dak1.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
	offlineAccess: true,
	// hostedDomain: '', // specifies a hosted domain restriction
	// loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
	// forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
	// accountName: '', // [Android] specifies an account name on the device that should be used
	iosClientId: '908368396731-vppvalbam1en8cj8a35k68ug076pq2be.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  });


export default class LoginScreen extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			phoneNumber: '+91',
			password: '',showAlert:false,loader:false,
			userInfo: null,
			confirmResult: null,
			verificationCode:'',
			userId:''
		}
		this.getCurrentUserInfo();
	}
	getCurrentUser = async () => {
		const currentUser = await GoogleSignin.getCurrentUser();
		this.setState({ currentUser });
	  };
	validatePhoneNumber = () => {
		var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/
		return regexp.test(this.state.phoneNumber)
	}
	handleSendCode = () => {
		// Request to send OTP
		if (this.validatePhoneNumber()) {
		  firebase
			.auth()
			.signInWithPhoneNumber(this.state.phoneNumber)
			.then(confirmResult => {
			  this.setState({ confirmResult })
			})
			.catch(error => {
			  alert(error.message)
			  console.log(error)
			})
		} else {
		  alert('Invalid Phone Number')
		}
	  }
	changePhoneNumber = () => {
		this.setState({ confirmResult: null, verificationCode: '' })
	}
	handleVerifyCode = () => {
		// Request for OTP verification
		const { confirmResult, verificationCode } = this.state
		if (verificationCode.length == 6) {
		  confirmResult
			.confirm(verificationCode)
			.then(user => {
			  this.setState({ userId: user.uid })
			  this.setState({loader:true});
					this.props.navigation.navigate('GoHappy Club');
					this.setState({loader:false});
			  alert(`Verified! ${user.uid}`)
			})
			.catch(error => {
			  alert(error.message)
			  console.log(error)
			})
		} else {
		  alert('Please enter a 6 digit OTP code.')
		}
	  }
	  renderConfirmationCodeView = () => {
		return (
		  <View style={styles.verificationView}>
			<TextInput
			  style={styles.textInput}
			  placeholder='Verification code'
			  placeholderTextColor='#eee'
			  value={this.state.verificationCode}
			  keyboardType='numeric'
			  onChangeText={verificationCode => {
				this.setState({ verificationCode })
			  }}
			  maxLength={6}
			/>
			<TouchableOpacity
			  style={[styles.themeButton, { marginTop: 20 }]}
			  onPress={this.handleVerifyCode}>
			  <Text style={styles.themeButtonTitle}>Verify Code</Text>
			</TouchableOpacity>
		  </View>
		)
	  }
	async fetchUserInfo(email){
		var url = SERVER_URL+"/user/getUserByEmail";
		console.log('right here');
		axios.post(url,{'email':email})
        .then(response => {
            if (response.data) {
				AsyncStorage.setItem('membership',response.data.user.membership);
            }
        })
        .catch(error => {
			this.error=true;
            console.log('Errwdqor while fetching the transactions from sms');
        });
	}
	getCurrentUserInfo = async () => {
		try {
		  const userInfo = await GoogleSignin.signInSilently();
		  this.setState({ userInfo });
		  console.log('login state',this.state);
		  var token = userInfo['idToken'];
		  var email = userInfo['user']['email'];
		  var name = userInfo['user']['name'];
		  var profileImage = userInfo['user']['photo'];
		  await this.fetchUserInfo(email);
		  AsyncStorage.setItem('name',name);
		  AsyncStorage.setItem('email',email);
		  AsyncStorage.setItem('profileImage',profileImage);
		  AsyncStorage.setItem('token',token);
		//   this.props.navigator.resetTo({
		// 	title: 'GoHappy Club',
		// 	component: 'GoHappy Club',
		// })
		  this.props.navigation.navigate('GoHappy Club');
		  
		  this.setState({loader:false});
		} catch (error) {
		  if (error.code === statusCodes.SIGN_IN_REQUIRED) {
			// user has not signed in yet
		  } else {
			// some other error
		  }
		}
	  };
	componentDidMount(){
		// this.getCurrentUserInfo();
	}
	signOut = async () => {
		try {
		  await GoogleSignin.revokeAccess();
		  await GoogleSignin.signOut();
		  setloggedIn(false);
		  setuserInfo([]);
		} catch (error) {
		  console.error(error);
		}
	  };
    _signIn = async () => {
        try {
			console.log('herehereherehereherehere');
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          console.log('teet',userInfo);
          this.setState({ userInfo });
		  var token = userInfo['idToken'];
		  var email = userInfo['user']['email'];
		  var name = userInfo['user']['name'];
		  var profileImage = userInfo['user']['photo'];
		  await this.fetchUserInfo(email);
		  var url = SERVER_URL+"/auth/login";
		  axios.post(url, {'token':token,'email':email,'name':name,'profileImage':profileImage})
		  .then(response => {
			  console.log('here'+response);
				  if (response.data && response.data!="ERROR") {
					// this.setState({fullName: userInfo.fullName});
					if(response.data.phoneNumber!=null)
					AsyncStorage.setItem('phoneNumber',response.data.phoneNumber);
					// AsyncStorage.setItem('fullName',response.data.fullName);
					AsyncStorage.setItem('name',name);
					AsyncStorage.setItem('email',email);
					AsyncStorage.setItem('profileImage',profileImage);
					AsyncStorage.setItem('token',token);
					// this.props.navigation.navigate('DrawerNavigator');
					this.setState({loader:true});
					this.props.navigation.navigate('GoHappy Club');
					this.setState({loader:false});
				  }
				  else if(response.data=="ERROR"){
					  this.setState({showAlert:true,loader:false})
				  }
		  })
		  .catch(error => {
				  console.log('Error while fetching the transactions from sms');
		  });
		  
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      };
	render() {
		if(this.state.loader==true){
			// return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
			return (<MaterialIndicator color='white' style={{backgroundColor:"#0A1045"}}/>)
		}
		const navigation = this.props.navigation;
		const title = 'Login';
		return (
			<View style={styles.container1}>
				
					<Text style={styles.title}>Login</Text>
					{/* <GoogleSigninButton
								style={{width: 192, height: 48,alignSelf:'center'}}
								size={GoogleSigninButton.Size.Wide}
								color={GoogleSigninButton.Color.Dark}
								onPress={this._signIn}
							/>
							<Text>OR</Text> */}
						

						<View style={styles.page}>
							<TextInput
							style={styles.textInput}
							placeholder='Phone Number with country code'
							placeholderTextColor='#eee'
							keyboardType='phone-pad'
							value={this.state.phoneNumber}
							onChangeText={phoneNumber => {
								this.setState({ phoneNumber })
							}}
							maxLength={15}
							editable={this.state.confirmResult ? false : true}
							/>
							<Button outline style={[styles.themeButton, { marginTop: 20 }]}
								title={this.state.confirmResult ? 'Change Phone Number' : 'Get OTP'}
								onPress={this.state.confirmResult
									? this.changePhoneNumber
									: this.handleSendCode}>
							</Button>
							{/* <TouchableOpacity
							style={[styles.themeButton, { marginTop: 20 }]}
							onPress={
								this.state.confirmResult
								? this.changePhoneNumber
								: this.handleSendCode
							}>
							<Text style={styles.themeButtonTitle}>
								{this.state.confirmResult ? 'Change Phone Number' : 'Get OTP'}
							</Text>
							</TouchableOpacity> */}
							{this.state.confirmResult ? this.renderConfirmationCodeView() : null}
						</View>
                    
				<AwesomeAlert
				  show={this.state.showAlert}
				  showProgress={false}
				  title="Login Error"
				  message="Invalid Credentials"
				  closeOnTouchOutside={true}
				  closeOnHardwareBackPress={false}
				  showConfirmButton={true}
				  confirmText="Try Again"
				  confirmButtonColor="#DD6B55"
				  onConfirmPressed={() => {
				    this.setState({showAlert:false})
				  }}
				/>
			 </View>
		);
	}
  _register = async() => {
		this.props.navigation.navigate('Register');
	}

}

const styles = StyleSheet.create({
	title: {
		fontSize: 20,
    	fontWeight: "bold",
		color:'white',
		marginTop:'60%',
		alignSelf:'center'
	},
	container1: {
		flex: 1,
		backgroundColor: '#0A1045',
	},
	input: {
		width: "90%",
		backgroundColor: "white",
		padding: 15,
		marginBottom: 10
	},
	btnContainer: {
		flexDirection: "row",
		justifyContent: "center"
	},
	userBtn: {
		backgroundColor: "#f0ad4e",
		paddingVertical: 15,
		height: 60
	},
	btnTxt: {
		fontSize: 20,
		textAlign: 'center',
		color: "black",
		fontWeight: '700'
	},
	registerTxt: {
		marginTop: 5,
		fontSize: 15,
		textAlign: 'center',
		color: "white",
	},
	welcome: {
		fontSize: 30,
		textAlign: 'center',
		margin: 10,
		color: 'white'
	},
	logo: {
		width: 250,
		height: 250
	},
	logoContainer: {
		alignItems: 'center',
		flexGrow: 1,
		justifyContent: 'center'
	},
	
	newinput: {
		height: 50,
		backgroundColor: 'rgba(255,255,255,0.2)',
		marginBottom: 10,
		color: 'white',
		paddingHorizontal: 10
	},
	container2: {
		flex: 1,
		backgroundColor: '#aaa'
	},
	title2: {
		color: 'white',
		marginTop: '30%',
		marginBottom: 10,
		opacity: 0.9,
		textAlign: 'center',
		fontSize: 30
	},
	page: {
		marginTop:'30%',
		alignItems: 'center',
		justifyContent: 'center'
	  },
	  textInput: {
		width: '90%',
		height: 40,
		borderColor: '#555',
		borderWidth: 2,
		borderRadius: 5,
		paddingLeft: 10,
		color: '#fff',
		fontSize: 16
	  },
	  themeButton: {
		width: '100%',
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		
		borderRadius: 5
	  },
	  themeButtonTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#fff'
	  },
	  verificationView: {
		width: '100%',
		alignItems: 'center',
		marginTop: 50
	  }
});