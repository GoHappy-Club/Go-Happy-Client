import React, {Component} from 'react';
import { NativeSyntheticEvent,ImageBackground,Image,Text,StyleSheet, View,KeyboardAvoidingView,Keyboard,TouchableWithoutFeedback} from 'react-native';

import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';
import PhoneInput from "react-native-phone-number-input";
import {
  MaterialIndicator,
} from 'react-native-indicators';
import Video from 'react-native-video'

import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-google-signin/google-signin';
import firebase from '@react-native-firebase/app'
import '@react-native-firebase/auth';
import { Button } from 'react-native-elements';
// import OTPTextInput from 'react-native-otp-textinput';
import OTPInputView from '@bherila/react-native-otp-input'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { setProfile } from '../../redux/actions/counts.js';
import { bindActionCreators } from 'redux';
import LinearGradient from 'react-native-linear-gradient';
// import OtpInputs from 'react-native-otp-inputs';


// GoogleSignin.configure({
// 	webClientId: '908368396731-fr0kop29br013r5u6vrt41v8k2j9dak1.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
// 	offlineAccess: true,
// 	iosClientId: '908368396731-vppvalbam1en8cj8a35k68ug076pq2be.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
//   });


class LoginScreen extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			phoneNumber: '',
			password: '',showAlert:false,loader:true,loadingButton:false,
			userInfo: null,
			confirmResult: null,
			verificationCode:'',
			userId:'',
			email:'',
			name:'',
			state:'',
			city:''
		}
		this.getCurrentUserInfo();
	}
	
	setProfile(name,email,phoneNumber,profileImage,token,plan,sessionsAttended) {
		let { profile, actions } = this.props;
		profile = {name:name,email:email,phoneNumber:phoneNumber,profileImage:profileImage,token:token,membership:plan,sessionsAttended:sessionsAttended};
		actions.setProfile(profile);
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
		console.log('in handle send code');
		this.setState({ loadingButton:true })
		if (this.validatePhoneNumber()) {
		  firebase
			.auth()
			.signInWithPhoneNumber(this.state.phoneNumber)
			.then(confirmResult => {
				console.log('in handle send code inside');
			  this.setState({ confirmResult })
			  this.setState({ loadingButton:false })
			})
			.catch(error => {
			  alert(error.message)
			  this.setState({ loadingButton:false })
			})
		} else {
		  alert('Invalid Phone Number')
		}
	  }
	changePhoneNumber = () => {
		// this.loadingButton=true;
		this.setState({ confirmResult: null, verificationCode: '',phoneNumber:null})
	}
	resendOtp = () => {
		// this.loadingButton=true;
		//this.setState({ confirmResult: null, verificationCode: ''})
		this.handleSendCode();
	}
	handleVerifyCode = () => {
		// Request for OTP verification
		this.setState({ loadingButton:true })
		console.log('fsddfssdfsdfdsfdsfsdfs');
		const { confirmResult, verificationCode } = this.state
		if (verificationCode.length == 6) {
		  confirmResult
			.confirm(verificationCode)
			.then(user => {
		
			  this.setState({ userId: user.user.uid })
			  try{
			  	this._backendSignIn(user.user.uid,user.user.displayName,'https://www.pngitem.com/pimgs/m/272-2720607_this-icon-for-gender-neutral-user-circle-hd.png',user.user.phoneNumber);
			  } 
			  catch(error){
				  console.log(error);
			  }
			  this.setState({ loadingButton:false });
			  console.log('fsddfssdfsdfdsfdsfrwerewrwerwerwerewrewrsdfs');
			})
			.catch(error => {
			  alert(error.message)
			  this.setState({ loadingButton:false })

			  console.log('fwrewrsdfs');
			})
		} else {
		  alert('Please enter a 6 digit OTP code.')

		  console.log('fwrewrsdfsOTP');
		}
	  }
	  
	  renderConfirmationCodeView = () => {
		return (
		  <View style={styles.verificationView}>
			{/* <OTPTextInput inputCount={6} textInputStyle={{color:'white'}} handleTextChange= {(text) => {
				this.setState({verificationCode:text})}}/> */}
				<OTPInputView
					// ref={input => this.otpInput = input}
					style={{width: '80%', height: 60,color:'#000'}}
					pinCount={6}
					// secureTextEntry={true}

					// code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
					// onCodeChanged = {code => { this.setState({code})}}
					// autoFocusOnLoad
					codeInputFieldStyle={styles.underlineStyleBase}
					codeInputHighlightStyle={styles.underlineStyleHighLighted}
					onCodeChanged = {code => { this.setState({verificationCode:code})}}
				/>	
				 {/* <OtpInputs
				 style={{width: '50%', height: 60,color:'#000',backgroundColor:'black'}}
					handleChange={(code) => console.log(code)}
					numberOfInputs={6}
					/> */}
			<Button outline style={[styles.themeButton, { paddingTop:20 }]}
				title='Verify Code'
				loading={this.state.loadingButton}
				onPress={this.handleVerifyCode}
				ViewComponent={LinearGradient}
				linearGradientProps={{
					colors: ['#4c669f', '#3b5998', '#192f6a'],
					start: { x: 0, y: 0.25 },
					end: { x: 0.5, y: 1 },
					locations: [0,0.5,0.6]
					}}>
			</Button>
			<Button type='clear' 
				title='Resend OTP'
				loading={this.state.loadingButton}
				onPress={this.resendOtp.bind(this)}
				>
			</Button>
			<Button type='clear' 
				title='Enter a Different Phone Number'
				loading={this.state.loadingButton}
				onPress={this.changePhoneNumber}
				>
			</Button>
		</View>
			
		)
	  }
	getCurrentUserInfo = async () => {
		try {
			 
		  const token1 = await AsyncStorage.getItem('token');
		   
		  if(token1!=null){
				const name = await AsyncStorage.getItem('name');
				const email = await AsyncStorage.getItem('email');
				const profileImage = await AsyncStorage.getItem('profileImage');
				const token = await AsyncStorage.getItem('token');
				const membership = await AsyncStorage.getItem('membership');
				const phoneNumber = await AsyncStorage.getItem('phoneNumber');
				const sessionsAttended = await AsyncStorage.getItem('sessionsAttended');
				this.setProfile(name,email,phoneNumber,profileImage,token,membership,sessionsAttended);
				this.props.navigation.replace('GoHappy Club');
				// this.setState({loader:false});
				return;
			// }
		  }
		  this.setState({loader:false});
		} catch (error) {
		  if (error.code === statusCodes.SIGN_IN_REQUIRED) {
			// user has not signed in yet
		  } else {
			// some other error
		  }
		}
	  };
	_backendSignIn(token,name,profileImage,phone){
		console.log(token,name,profileImage,phone);
		if(name==null){
			name='';
		}
		var url = SERVER_URL+"/auth/login";
		axios.post(url, {'token':token,'name':name,'profileImage':profileImage,'phone':phone.substr(1)})
		.then(response => {
			 console.log('backend sign in',response)
				if (response.data && response.data!="ERROR") {
				  // this.setState({fullName: userInfo.fullName});
				  if(response.data.phone!=null)
				  AsyncStorage.setItem('phoneNumber',response.data.phone);
				  // AsyncStorage.setItem('fullName',response.data.fullName);
				   
				  if(response.data.name!=null) 
				  AsyncStorage.setItem('name',response.data.name);
				  if(response.data.email!=null)
				  AsyncStorage.setItem('email',response.data.email);
				  if(response.data.profileImage!=null)
				  AsyncStorage.setItem('profileImage',response.data.profileImage);
				  AsyncStorage.setItem('token',token);
				  AsyncStorage.setItem('membership',response.data.membership);
				  AsyncStorage.setItem('sessionsAttended',response.data.sessionsAttended);
				  this.setProfile(response.data.name,response.data.email,response.data.phone,response.data.profileImage,token,response.data.membership,response.data.sessionsAttended)
				  this.setState({name:response.data.name,email:response.data.email,
						phoneNumber:response.data.phone});
				  // this.props.navigation.navigate('DrawerNavigator');
				  if(this.pending()){
					this.props.navigation.replace('Additional Details',{navigation:this.props.navigation,email:this.state.email,phoneNumber:this.state.phoneNumber,
						name:this.state.name,state:this.state.state,city:this.state.city});
					return;
				  }
				  else{
					this.setState({loader:true});
					this.props.navigation.replace('GoHappy Club');
					this.setState({loader:false});
				  }
				}
				else if(response.data=="ERROR"){
					this.setState({showAlert:true,loader:false})
				}
		})
		.catch(error => {
				 console.log(error);
		});
	}
	pending(){
		console.log('state in pending',this.state);
		if((this.state.phoneNumber==null || this.state.phoneNumber.length==0)||(this.state.name==null || this.state.name.length==0)||(this.state.dob==null || this.state.dob.length==0))
			return true;
		return false;
	}
	render() {
		if(this.state.loader==true){
			// return (<ActivityIndicator size='large' color="#0A1045" style={{flex: 1,justifyContent: "center",flexDirection: "row",justifyContent: "space-around",padding: 10}}/>);
			// return (<MaterialIndicator color='white' style={{backgroundColor:"#0A1045"}}/>)
			return (
				<Video source={require('../../images/logo_splash.mp4')}
					style={{position: 'absolute',
							top: 0,flex: 1,
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							left: 0,
							right: 0,
							bottom: 0,
							opacity: 1,}}
							muted={true}
							repeat={true}
							resizeMode="cover"/>
		)
		}
		const navigation = this.props.navigation;
		const title = 'Login';
		return (
			<View style={styles.container}>
				<Image
				resizeMode="contain"
				style={styles.logo}
				source={require('../../images/logo.png')}
				/>

				<Text style={{marginLeft:'10%',fontWeight: 'normal',fontSize:50,color:'black',alignSelf:'flex-start'}}>LOGIN</Text>
					{ !this.state.confirmResult &&  
						<View style={styles.page}>

							<PhoneInput
							style={styles.textInput}
								ref={this.state.phoneNumber}
								keyboardType='phone-pad'
								defaultCode="IN"
								layout="first"
								onChangeText={(text) => {
									this.setState({phoneNumber:text})
								}}
								onChangeFormattedText={(text) => {
								
								this.setState({phoneNumber:text});
								}}
								withDarkTheme
								withShadow
								autoFocus
							/>
							
							<Button outline style={[styles.themeButton, { paddingTop:20 }]}
								title={'Login'}
								loading={this.state.loadingButton}
								ViewComponent={LinearGradient}
								linearGradientProps={{
									colors: ['#4c669f', '#3b5998', '#192f6a'],
									start: { x: 0, y: 0.25 },
									end: { x: 0.5, y: 1 },
									locations: [0,0.5,0.6]
									}}

								onPress={this.handleSendCode}>
							</Button>
						</View>
					}
					{ this.state.confirmResult && 
						<View style={styles.page}>
							{ this.renderConfirmationCodeView()}		
						</View>
					}
						<ImageBackground resizeMode="contain"
						style={styles.cover}
						source={require('../../images/login_bg.png')}
						>
						</ImageBackground>
						{/* <Text style={{fontSize:20,color:'black',alignSelf:'center'}}>India ka Sabse Khush Pariwar</Text> */}
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

}

const styles = StyleSheet.create({
	title: {
		fontSize: 20,
    	fontWeight: "bold",
		color:'white',
		marginTop:'30%',
		alignSelf:'center'
	},
	container: {
		flex: 1,backgroundColor: '#fffaf1',
	},
	container1: {
		flex: 1,
		backgroundColor: '#fffaf1',
		justifyContent: "space-around"
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
		width: 200,
		height: 200,
		alignSelf: 'flex-end',
		marginTop: -20,
		marginRight: -20
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
	cover:{
		flex: 1,
    justifyContent: "center",
	marginBottom:-10
	// width:600,height:'100%'
	},
	page: {
		marginTop:'20%',
		alignItems: 'center',
		justifyContent: 'center',
		// marginBottom: 200
	  },
	  textInput: {
		width: '90%',
		height: 40,
		borderColor: '#555',
		borderWidth: 2,
		borderRadius: 5,
		paddingLeft: 10,
		color: '#fff',
		fontSize: 16,
	  },
	  themeButton: {
		paddingHorizontal: 40,
		paddingVertical: 10,
		borderRadius: 10,
		marginTop: 20
	  },
	  themeButtonTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#fff'
	  },
	  verificationView: {
		width: '100%',
		alignItems: 'center',
		// marginTop: 50
	  },
	  underlineStyleBase: {
		borderColor: "black",
		color:'black'
	  },
	
	  underlineStyleHighLighted: {
		borderColor: "black",
	  },
});

const mapStateToProps = state => ({
	profile:state.profile
  });

  const ActionCreators = Object.assign(
	{},
	{setProfile}
  );
  const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(ActionCreators, dispatch),
  });
  export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)